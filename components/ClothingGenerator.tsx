import React, { useState } from 'react';
import { generateClothingImage } from '../services/geminiService';
import { ImageAsset } from '../types';

interface ClothingGeneratorProps {
  onGenerated: (asset: ImageAsset) => void;
}

const ClothingGenerator: React.FC<ClothingGeneratorProps> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError('');

    try {
      const base64 = await generateClothingImage(prompt);
      const newAsset: ImageAsset = {
        id: `gen_${Date.now()}`,
        url: base64,
        base64: base64,
        type: 'generated',
        label: prompt.slice(0, 15) + '...'
      };
      onGenerated(newAsset);
      setPrompt(''); // Clear prompt on success
    } catch (err) {
      setError('生成失败，请稍后重试。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 mb-8">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 relative overflow-hidden">
        
        {/* Decorative Badge */}
        <div className="absolute top-0 right-0 bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-bl-xl font-bold">
           Nano Banana 魔法工坊
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
          <span>✨</span> 没有满意的衣服？
        </h3>
        <p className="text-gray-600 text-sm mb-4">输入提示词，让 AI 为你设计独一无二的服装。</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：一件复古风格的红色丝绸连衣裙，有金色刺绣..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            disabled={isGenerating}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`px-6 py-3 rounded-xl font-medium text-white shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 min-w-[120px]
              ${isGenerating || !prompt.trim() 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-purple-600 hover:bg-purple-700 hover:shadow-xl hover:-translate-y-0.5'}`}
          >
            {isGenerating ? (
               <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> 生成中</>
            ) : (
               '立即生成'
            )}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default ClothingGenerator;