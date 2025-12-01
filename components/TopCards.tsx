import React from 'react';
import { ImageAsset, AppStep } from '../types';

interface TopCardsProps {
  step: AppStep;
  faceImage?: ImageAsset;
  clothImage?: ImageAsset;
  resultUrl?: string;
}

const TopCards: React.FC<TopCardsProps> = ({ step, faceImage, clothImage, resultUrl }) => {
  
  const getCardStyle = (index: number) => {
    // Base styles
    let transform = '';
    let zIndex = 10;
    let opacity = 'opacity-60 grayscale-[0.8]';
    let border = 'border-transparent';
    let shadow = 'shadow-md';

    // Active/Completed logic
    if (index === 1) { // Face Card
       transform = '-rotate-[4deg] translate-y-2';
       zIndex = 10;
       if (faceImage) {
         opacity = 'opacity-100 grayscale-0';
         shadow = 'shadow-xl shadow-brand-900/10';
       }
       if (step === AppStep.SELECT_FACE) {
         border = 'border-brand-500 ring-4 ring-brand-100';
         transform = '-rotate-0 scale-105 z-40'; // Pop out when active
       }
    } else if (index === 2) { // Cloth Card
       transform = 'rotate-[3deg] -translate-y-1';
       zIndex = 20;
       if (clothImage) {
         opacity = 'opacity-100 grayscale-0';
         shadow = 'shadow-xl shadow-brand-900/10';
       }
       if (step === AppStep.SELECT_CLOTH) {
         border = 'border-brand-500 ring-4 ring-brand-100';
         transform = 'rotate-0 scale-105 z-40'; // Pop out when active
       }
    } else if (index === 3) { // Result Card
       transform = 'rotate-[8deg] translate-x-2 translate-y-3';
       zIndex = 30;
       if (resultUrl) {
         opacity = 'opacity-100 grayscale-0';
         shadow = 'shadow-2xl shadow-brand-900/20';
       }
       if (step === AppStep.RESULT || step === AppStep.GENERATING) {
         border = 'border-brand-500 ring-4 ring-brand-100';
         transform = 'rotate-0 scale-110 z-50'; // Center stage when done
       }
    }

    return `transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) transform ${transform} ${opacity} border-2 ${border} ${shadow} bg-white rounded-2xl overflow-hidden w-28 h-36 sm:w-36 sm:h-48 md:w-44 md:h-60 relative ${zIndex}`;
  };

  return (
    <div className="flex justify-center items-center py-10 relative h-72 sm:h-96 perspective-1000">
      
      {/* Connector Line (Decor) */}
      <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent -z-0"></div>

      {/* Card 1: Face */}
      <div className={getCardStyle(1)}>
        {faceImage ? (
          <img src={faceImage.url} alt="Face" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300 p-2 text-center">
             <span className="text-3xl mb-2">👤</span>
             <span className="text-xs font-bold tracking-wider text-gray-400">人物</span>
          </div>
        )}
      </div>

      {/* Card 2: Cloth */}
      <div className={`${getCardStyle(2)} mx-[-20px] sm:mx-4`}>
         {clothImage ? (
          <img src={clothImage.url} alt="Cloth" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300 p-2 text-center">
             <span className="text-3xl mb-2">👕</span>
             <span className="text-xs font-bold tracking-wider text-gray-400">服饰</span>
          </div>
        )}
      </div>

      {/* Card 3: Result */}
      <div className={getCardStyle(3)}>
         {resultUrl ? (
          <img src={resultUrl} alt="Result" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-300 p-2 text-center">
             <span className="text-3xl mb-2">✨</span>
             <span className="text-xs font-bold tracking-wider text-gray-400">生成</span>
          </div>
        )}
        {step === AppStep.GENERATING && (
           <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
           </div>
        )}
      </div>
    </div>
  );
};

export default TopCards;