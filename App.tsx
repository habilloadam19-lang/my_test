import React, { useState, useRef, useEffect } from 'react';
import { AppStep, ImageAsset, HistoryItem, LoadingState } from './types';
import TopCards from './components/TopCards';
import StepSelection from './components/StepSelection';
import ClothingGenerator from './components/ClothingGenerator';
import ResultView from './components/ResultView';
import HistoryGallery from './components/HistoryGallery';
import { generateTryOn, urlToBase64 } from './services/geminiService';

// Updated constants with better placeholder IDs for a fashion context
const PRESET_FACES: ImageAsset[] = [
  { id: 'f1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop', type: 'preset', label: '模特 A' },
  { id: 'f2', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop', type: 'preset', label: '模特 B' },
  { id: 'f3', url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=800&fit=crop', type: 'preset', label: '模特 C' },
  { id: 'f4', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop', type: 'preset', label: '模特 D' },
];

const PRESET_CLOTHES: ImageAsset[] = [
  { id: 'c1', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop', type: 'preset', label: '复古夹克' },
  { id: 'c2', url: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=600&h=800&fit=crop', type: 'preset', label: '休闲T恤' },
  { id: 'c3', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop', type: 'preset', label: '时尚裙装' },
  { id: 'c4', url: 'https://images.unsplash.com/photo-1551028919-ac7675cf072a?w=600&h=800&fit=crop', type: 'preset', label: '皮衣' },
];

const App: React.FC = () => {
  // State
  const [step, setStep] = useState<AppStep>(AppStep.SELECT_FACE);
  const [selectedFace, setSelectedFace] = useState<ImageAsset | undefined>(undefined);
  const [selectedCloth, setSelectedCloth] = useState<ImageAsset | undefined>(undefined);
  const [generatedResult, setGeneratedResult] = useState<string | undefined>(undefined);
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: false, message: '' });
  
  // Custom clothes (uploaded or generated)
  const [customClothes, setCustomClothes] = useState<ImageAsset[]>([]);
  
  // History
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Refs needed for scrolling if history gets long, or for auto-scroll to steps
  const contentRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const handleFaceSelect = (face: ImageAsset) => {
    setSelectedFace(face);
    setStep(AppStep.SELECT_CLOTH);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFaceUpload = (base64: string) => {
    const newAsset: ImageAsset = {
      id: `face_up_${Date.now()}`,
      url: base64,
      base64: base64,
      type: 'upload',
      label: '上传人脸'
    };
    handleFaceSelect(newAsset);
  };

  const handleClothSelect = async (cloth: ImageAsset) => {
    setSelectedCloth(cloth);
    setStep(AppStep.GENERATING);
    await processTryOn(cloth);
  };

  const handleClothUpload = (base64: string) => {
    const newAsset: ImageAsset = {
      id: `cloth_up_${Date.now()}`,
      url: base64,
      base64: base64,
      type: 'upload',
      label: '上传服饰'
    };
    // Add to custom clothes list so it appears in the grid
    setCustomClothes(prev => [newAsset, ...prev]);
  };

  const handleClothingGenerated = (asset: ImageAsset) => {
    setCustomClothes(prev => [asset, ...prev]);
  };

  const processTryOn = async (cloth: ImageAsset) => {
    if (!selectedFace) return;

    setLoadingState({ isLoading: true, message: 'Nano Banana 正在生成全身照...' });
    
    try {
      // 1. Prepare Base64 Data
      let faceBase64 = selectedFace.base64;
      if (!faceBase64 && selectedFace.url) {
        faceBase64 = await urlToBase64(selectedFace.url);
      }

      let clothBase64 = cloth.base64;
      if (!clothBase64 && cloth.url) {
        clothBase64 = await urlToBase64(cloth.url);
      }

      if (!faceBase64 || !clothBase64) {
        throw new Error("Could not process images.");
      }

      // 2. Call API
      const resultBase64 = await generateTryOn(faceBase64, clothBase64);
      setGeneratedResult(resultBase64);
      
      // 3. Save to History
      const newHistoryItem: HistoryItem = {
        id: `hist_${Date.now()}`,
        faceUrl: selectedFace.url,
        clothUrl: cloth.url,
        resultUrl: resultBase64,
        timestamp: Date.now()
      };
      setHistory(prev => [newHistoryItem, ...prev]);
      
      setStep(AppStep.RESULT);
    } catch (error) {
      console.error(error);
      alert("生成失败，请检查API Key或网络连接。\n确保使用的是 Nano Banana (Gemini 2.5 Flash) 支持的 Key。");
      setStep(AppStep.SELECT_CLOTH);
    } finally {
      setLoadingState({ isLoading: false, message: '' });
    }
  };

  const handleReset = () => {
    setSelectedFace(undefined);
    setSelectedCloth(undefined);
    setGeneratedResult(undefined);
    setStep(AppStep.SELECT_FACE);
  };

  // Combine presets and custom items for display
  const displayClothes = [...customClothes, ...PRESET_CLOTHES];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-32 font-sans selection:bg-brand-100">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-200">N</div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">NanoStyle <span className="text-brand-500">AI</span></h1>
          </div>
          {step !== AppStep.SELECT_FACE && !loadingState.isLoading && (
            <button onClick={handleReset} className="text-sm text-gray-500 hover:text-brand-600 font-medium transition-colors">
              重置
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6" ref={contentRef}>
        
        {/* Progress Visualization */}
        <TopCards 
          step={step} 
          faceImage={selectedFace} 
          clothImage={selectedCloth} 
          resultUrl={generatedResult} 
        />

        {/* Dynamic Step Content */}
        <div className="mt-8 transition-all duration-500">
          
          {loadingState.isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
              <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-6"></div>
              <h3 className="text-xl font-medium text-gray-700">{loadingState.message}</h3>
              <p className="text-sm text-gray-400 mt-2">正在进行 AI 换装...</p>
            </div>
          )}

          {!loadingState.isLoading && step === AppStep.SELECT_FACE && (
            <StepSelection 
              title="第一步：选择人物"
              description="上传照片或选择预设模特"
              items={PRESET_FACES}
              onSelect={handleFaceSelect}
              onUpload={handleFaceUpload}
            />
          )}

          {!loadingState.isLoading && step === AppStep.SELECT_CLOTH && (
            <div className="animate-fade-in-up">
              
              <ClothingGenerator onGenerated={handleClothingGenerated} />
              
              <StepSelection 
                title="第二步：选择服饰"
                description="上传照片、使用 AI 生成或选择预设"
                items={displayClothes}
                onSelect={handleClothSelect}
                onUpload={handleClothUpload}
              />
            </div>
          )}

          {!loadingState.isLoading && step === AppStep.RESULT && generatedResult && (
             <ResultView resultUrl={generatedResult} onReset={handleReset} />
          )}

        </div>
      </main>

      {/* Gallery Footer */}
      <HistoryGallery history={history} />
    </div>
  );
};

export default App;