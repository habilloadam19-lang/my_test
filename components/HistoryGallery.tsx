import React from 'react';
import { HistoryItem } from '../types';

interface HistoryGalleryProps {
  history: HistoryItem[];
}

const HistoryGallery: React.FC<HistoryGalleryProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 p-4 z-50 transition-transform duration-300">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">历史记录 Gallery</h3>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {history.map((item) => (
            <div key={item.id} className="flex-shrink-0 group relative w-20 h-20 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 cursor-pointer">
              <img src={item.resultUrl} alt="History" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a href={item.resultUrl} target="_blank" rel="noreferrer" className="text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryGallery;