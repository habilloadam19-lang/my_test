import React from 'react';
import { ImageAsset } from '../types';
import { fileToBase64 } from '../services/geminiService';

interface StepSelectionProps {
  title: string;
  description: string;
  items: ImageAsset[];
  onSelect: (item: ImageAsset) => void;
  onUpload: (fileBase64: string) => void;
  loading?: boolean;
}

const StepSelection: React.FC<StepSelectionProps> = ({ 
  title, description, items, onSelect, onUpload, loading 
}) => {
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        onUpload(base64);
      } catch (err) {
        console.error("File reading error", err);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in-up">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Upload Button */}
        <label className="cursor-pointer group relative flex flex-col items-center justify-center aspect-[3/4] rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-500 hover:bg-brand-50 transition-colors">
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={loading} />
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-2 group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
          <span className="text-sm font-medium text-gray-500 group-hover:text-brand-600">上传图片</span>
        </label>

        {/* Presets */}
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            disabled={loading}
            className="relative aspect-[3/4] rounded-xl overflow-hidden group focus:outline-none focus:ring-4 focus:ring-brand-500/30 transition-all hover:shadow-lg"
          >
            <img src={item.url} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
               <span className="text-white text-xs font-medium truncate w-full text-left">{item.label || 'Preset'}</span>
            </div>
            {item.type === 'generated' && (
               <div className="absolute top-2 right-2 bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">AI Generated</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepSelection;