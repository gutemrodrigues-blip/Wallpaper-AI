import React, { useState, useRef, useEffect } from 'react';
import { ASPECT_RATIO_OPTIONS, STYLE_PRESETS } from '../constants';
import { AspectRatio, GenerationConfig } from '../types';
import { Wand2, Image as ImageIcon, Smartphone, Monitor, Square, Tablet, Upload, X, Type, Download as InstallIcon } from 'lucide-react';

interface ControlPanelProps {
  config: GenerationConfig;
  setConfig: React.Dispatch<React.SetStateAction<GenerationConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig, onGenerate, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setConfig(prev => ({ ...prev, prompt: e.target.value }));
  };

  const handleStyleSelect = (modifier: string) => {
    setConfig(prev => ({ ...prev, style: modifier }));
  };

  const handleRatioSelect = (ratio: string) => {
    setConfig(prev => ({ ...prev, aspectRatio: ratio }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({ ...prev, referenceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setConfig(prev => ({ ...prev, referenceImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTabChange = (tab: 'text' | 'image') => {
    setActiveTab(tab);
    if (tab === 'text') {
      handleRemoveImage();
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Monitor': return <Monitor size={16} />;
      case 'Smartphone': return <Smartphone size={16} />;
      case 'Square': return <Square size={16} />;
      case 'Tablet': return <Tablet size={16} />;
      default: return <ImageIcon size={16} />;
    }
  };

  return (
    <div className="w-full lg:w-96 bg-slate-800 p-6 flex flex-col h-full overflow-y-auto border-r border-slate-700 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Wand2 className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Wallpaper AI
          </h1>
        </div>
        {deferredPrompt && (
          <button 
            onClick={handleInstallClick}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-indigo-400 transition-colors"
            title="Instalar App"
          >
            <InstallIcon size={20} />
          </button>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="bg-slate-900/50 p-1 rounded-xl flex gap-1 mb-6 border border-slate-700">
        <button
          onClick={() => handleTabChange('text')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'text' 
              ? 'bg-slate-700 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Type size={16} />
          Texto
        </button>
        <button
          onClick={() => handleTabChange('image')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            activeTab === 'image' 
              ? 'bg-slate-700 text-white shadow-sm' 
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <ImageIcon size={16} />
          Imagem
        </button>
      </div>

      <div className="space-y-6 flex-1">
        
        {/* Image Upload Section (Only in Image Tab) */}
        {activeTab === 'image' && (
          <div className="space-y-2 animate-fadeIn">
            <label className="text-sm font-medium text-slate-300">Imagem de Referência</label>
            {!config.referenceImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-slate-700/30 transition-all group"
              >
                <Upload className="text-slate-500 group-hover:text-indigo-400 mb-2" size={24} />
                <span className="text-xs text-slate-400 group-hover:text-slate-300">Clique para upload</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="relative w-full h-32 rounded-xl overflow-hidden group border border-slate-600">
                <img src={config.referenceImage} alt="Reference" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                <button 
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/80 rounded-full text-white transition-colors backdrop-blur-sm"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <p className="text-[10px] text-slate-500">
              A IA usará esta imagem como base para gerar o wallpaper.
            </p>
          </div>
        )}

        {/* Prompt Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">
            {activeTab === 'image' ? 'Instruções Adicionais' : 'Descreva seu Wallpaper'}
          </label>
          <textarea
            value={config.prompt}
            onChange={handlePromptChange}
            placeholder={activeTab === 'image' 
              ? "Ex: Melhore a qualidade, adicione neon, estilo cyberpunk..." 
              : "Ex: Uma cidade futurista flutuando nas nuvens ao pôr do sol..."}
            className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm"
          />
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Formato</label>
          <div className="grid grid-cols-2 gap-2">
            {ASPECT_RATIO_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleRatioSelect(option.value)}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                  config.aspectRatio === option.value
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {getIcon(option.icon)}
                <span className="text-xs font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Styles */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Estilo Artístico</label>
          <div className="grid grid-cols-2 gap-2">
            {STYLE_PRESETS.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleSelect(style.promptModifier)}
                className={`p-2 text-xs rounded-lg border text-left transition-all truncate ${
                  config.style === style.promptModifier
                    ? 'bg-indigo-900/50 border-indigo-500 text-indigo-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-slate-700">
        <button
          onClick={onGenerate}
          disabled={isGenerating || (!config.prompt.trim() && !config.referenceImage)}
          className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
            isGenerating || (!config.prompt.trim() && !config.referenceImage)
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Processando...
            </>
          ) : (
            <>
              <Wand2 size={20} />
              {activeTab === 'image' ? 'Transformar' : 'Gerar Wallpaper'}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;