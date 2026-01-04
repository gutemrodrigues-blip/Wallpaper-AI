import React, { useState, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import ImageDisplay from './components/ImageDisplay';
import { GenerationConfig, GeneratedImage, AspectRatio } from './types';
import { generateWallpaper } from './services/gemini';
import { STYLE_PRESETS } from './constants';

const App: React.FC = () => {
  const [config, setConfig] = useState<GenerationConfig>({
    prompt: '',
    style: STYLE_PRESETS[0].promptModifier,
    aspectRatio: AspectRatio.PORTRAIT, // Default to mobile wallpaper
  });

  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('wallpaper_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0) {
          setCurrentImage(parsed[0]);
        }
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('wallpaper_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!config.prompt) return;

    setIsGenerating(true);
    try {
      const base64Image = await generateWallpaper(config);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: base64Image,
        prompt: config.prompt,
        style: config.style,
        aspectRatio: config.aspectRatio,
        timestamp: Date.now(),
      };

      setHistory(prev => [newImage, ...prev]);
      setCurrentImage(newImage);
    } catch (error) {
      console.error("Failed to generate", error);
      alert("Ocorreu um erro ao gerar a imagem. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectHistory = (image: GeneratedImage) => {
    setCurrentImage(image);
  };

  const handleClearHistory = () => {
    if (confirm("Tem certeza que deseja limpar o histórico?")) {
      setHistory([]);
      setCurrentImage(null);
      localStorage.removeItem('wallpaper_history');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-900 text-slate-100 overflow-hidden">
      {/* Mobile/Tablet: Sidebar might be top or stacked, usually standard sidebar is better */}
      
      <ControlPanel 
        config={config} 
        setConfig={setConfig} 
        onGenerate={handleGenerate} 
        isGenerating={isGenerating} 
      />
      
      <main className="flex-1 h-full relative">
        <ImageDisplay 
          currentImage={currentImage} 
          history={history}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
        />
      </main>
    </div>
  );
};

export default App;