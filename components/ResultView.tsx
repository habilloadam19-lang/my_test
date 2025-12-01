import React from 'react';

interface ResultViewProps {
  resultUrl: string;
  onReset: () => void;
  onSave?: () => void; // Optional if we want explicit save, though auto-save is implemented
}

const ResultView: React.FC<ResultViewProps> = ({ resultUrl, onReset }) => {
  return (
    <div className="max-w-md mx-auto p-6 text-center animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">换装完成! 🎉</h2>
      <p className="text-gray-500 mb-8">这是为你生成的全身试穿效果。</p>
      
      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <a 
          href={resultUrl} 
          download={`nano-style-${Date.now()}.png`}
          className="flex-1 bg-brand-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all flex justify-center items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          下载图片
        </a>
        <button 
          onClick={onReset}
          className="flex-1 bg-white text-gray-700 border border-gray-200 py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-all"
        >
          再试一次
        </button>
      </div>
    </div>
  );
};

export default ResultView;