export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  aspectRatio: string;
  timestamp: number;
}

export interface GenerationConfig {
  prompt: string;
  style: string;
  aspectRatio: string;
  referenceImage?: string | null;
}

export enum AspectRatio {
  SQUARE = "1:1",
  PORTRAIT = "9:16",
  LANDSCAPE = "16:9",
  Wide = "4:3",
  Tall = "3:4"
}

export interface StylePreset {
  id: string;
  label: string;
  promptModifier: string;
}