import { GoogleGenAI } from "@google/genai";
import { GenerationConfig } from "../types";

// Initialize the Gemini client
// Assuming process.env.API_KEY is available and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWallpaper = async (config: GenerationConfig): Promise<string> => {
  try {
    const fullPrompt = `${config.prompt}. ${config.style}`;
    
    const parts: any[] = [];
    
    // Add reference image if available
    if (config.referenceImage) {
      const base64Data = config.referenceImage.split(',')[1];
      const mimeType = config.referenceImage.substring(
        config.referenceImage.indexOf(':') + 1, 
        config.referenceImage.indexOf(';')
      );
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    // Add text prompt
    parts.push({ text: fullPrompt });

    // Using gemini-2.5-flash-image as the default for good speed/quality balance.
    // It supports various aspect ratios natively.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
        },
      },
    });

    // Iterate through parts to find the image data
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating wallpaper:", error);
    throw error;
  }
};