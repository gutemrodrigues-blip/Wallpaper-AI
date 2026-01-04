import React, { useState } from 'react';
import { GeneratedImage, AspectRatio } from '../types';
import { Download, Maximize2, Clock, Trash2 } from 'lucide-react';

interface ImageDisplayProps {
  currentImage: GeneratedImage | null;
  history: GeneratedImage[];
  onSelectHistory: (image: GeneratedImage) => void;
  onClearHistory: () => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ currentImage, history, onSelectHistory, onClearHistory }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = (url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `gemini-wallpaper-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getContainerAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case AspectRatio.PORTRAIT: return 'max-w-[360px] aspect-[9/16]';
      case AspectRatio.LANDSCAPE: return 'max-w-[800px] aspect-[16/9]';
      case AspectRatio.SQUARE: return 'max-w-[600px] aspect-square';
      case AspectRatio.Wide: return 'max-w-[700px] aspect-[4/3]';
      default: return 'max-w-full aspect-video';
    }
  };

  if (!currentImage && history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-500 h-full">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Maximize2 size={48} className="opacity-50" />
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-slate-300">Comece a Criar</h2>
        <p className="max-w-md text-center">Use o painel lateral para descrever sua ideia e gere wallpapers únicos com a IA do Google Gemini.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Main Preview Area */}
      <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center bg-[#0b1120] relative">
        {currentImage ? (
          <div 
            className={`relative group rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ${getContainerAspectRatioClass(currentImage.aspectRatio)} w-full`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img 
              src={currentImage.url} 
              alt={currentImage.prompt} 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Actions */}
            <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-4 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <button 
                onClick={() => handleDownload(currentImage.url, currentImage.id)}
                className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-indigo-50 transition-colors transform hover:scale-105"
              >
                <Download size={20} />
                Baixar 
              </button>
            </div>
            
            {/* Prompt Badge */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-sm line-clamp-2">{currentImage.prompt}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-500">
            <p>Selecione uma imagem do histórico para visualizar.</p>
          </div>
        )}
      </div>

      {/* History Strip */}
      {history.length > 0 && (
        <div className="h-48 bg-slate-800/50 border-t border-slate-700 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 px-2">
             <div className="flex items-center gap-2 text-slate-400">
                <Clock size={16} />
                <span className="text-sm font-medium">Recentes</span>
             </div>
             <button 
                onClick={onClearHistory}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-400/10 transition-colors"
             >
               <Trash2 size={12} /> Limpar
             </button>
          </div>
          
          <div className="flex-1 overflow-x-auto flex gap-4 pb-2 px-2 custom-scrollbar">
            {history.map((img) => (
              <button
                key={img.id}
                onClick={() => onSelectHistory(img)}
                className={`flex-shrink-0 relative rounded-lg overflow-hidden border-2 transition-all w-32 ${
                  currentImage?.id === img.id ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-transparent hover:border-slate-500'
                }`}
              >
                 <div className="w-full h-full bg-slate-700">
                   <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                 </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;