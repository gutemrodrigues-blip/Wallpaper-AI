import { AspectRatio, StylePreset } from './types';

export const STYLE_PRESETS: StylePreset[] = [
  { 
    id: 'none', 
    label: 'Nenhum', 
    promptModifier: '' 
  },
  { 
    id: 'realistic', 
    label: 'Fotorealista', 
    promptModifier: 'photorealistic, 8k resolution, highly detailed, cinematic lighting, unreal engine 5 render, sharp focus' 
  },
  { 
    id: 'cyberpunk', 
    label: 'Cyberpunk', 
    promptModifier: 'cyberpunk style, neon lights, futuristic city, high tech, synthwave, dark atmosphere, glowing details' 
  },
  { 
    id: 'anime', 
    label: 'Anime', 
    promptModifier: 'anime style, studio ghibli inspired, vibrant colors, detailed background, cel shaded, makoto shinkai style' 
  },
  { 
    id: 'minimalist', 
    label: 'Minimalista', 
    promptModifier: 'minimalist, flat design, vector art, simple shapes, clean lines, pastel colors, soft lighting' 
  },
  { 
    id: 'fantasy', 
    label: 'Fantasia', 
    promptModifier: 'fantasy art, magical atmosphere, ethereal, dreamlike, digital painting, intricate details, rpg style' 
  },
  { 
    id: 'abstract', 
    label: 'Abstrato', 
    promptModifier: 'abstract art, fluid shapes, geometric patterns, colorful, modern art, digital chaos, texture' 
  },
  { 
    id: 'vaporwave', 
    label: 'Vaporwave', 
    promptModifier: 'vaporwave aesthetic, retro 80s, glitch art, purple and pink gradients, statue, palm trees' 
  }
];

export const ASPECT_RATIO_OPTIONS = [
  { value: AspectRatio.LANDSCAPE, label: 'Desktop (16:9)', icon: 'Monitor' },
  { value: AspectRatio.PORTRAIT, label: 'Mobile (9:16)', icon: 'Smartphone' },
  { value: AspectRatio.SQUARE, label: 'Quadrado (1:1)', icon: 'Square' },
  { value: AspectRatio.Wide, label: 'Tablet (4:3)', icon: 'Tablet' },
];