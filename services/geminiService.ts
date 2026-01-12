
import { GoogleGenAI, Type } from "@google/genai";
import { ValidationResult } from "../types";

// Initialize AI outside the function to reuse the instance
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simple cache key helper
const getCacheKey = (player: string, club: string) => 
  `v1_player_cache_${player.toLowerCase().replace(/\s+/g, '_')}_${club.toLowerCase().replace(/\s+/g, '_')}`;

export const verifyPlayerAppearance = async (
  playerName: string,
  clubName: string
): Promise<ValidationResult> => {
  const cacheKey = getCacheKey(playerName, clubName);
  
  // Check local cache first for instant results
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      console.debug(`Cache hit for ${playerName} at ${clubName}`);
      return JSON.parse(cached);
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Player: ${playerName}, Club: ${clubName}`,
      config: {
        systemInstruction: `VALIDATOR: Check if player played for club. 
        Output JSON only. 
        Field "isValid": boolean. 
        Field "appearances": total competitive matches for THIS club. 
        Field "explanation": string (why invalid).
        Use internal knowledge if 100% certain to save time. Use search ONLY for exact numbers if unsure.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            appearances: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["isValid", "appearances"]
        }
      },
    });

    const result = JSON.parse(response.text || "{}");
    const sourceUrl = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.[0]?.web?.uri;

    let finalResult: ValidationResult;

    if (!result.isValid || typeof result.appearances !== 'number' || result.appearances === 0) {
      finalResult = { 
        isValid: false, 
        appearances: 0, 
        error: result.explanation || `Could not verify ${playerName} played for ${clubName}.` 
      };
    } else {
      finalResult = {
        isValid: true,
        appearances: result.appearances,
        sourceUrl
      };
    }

    // Save to cache if valid or clearly invalid (don't cache errors)
    if (result.isValid !== undefined) {
      localStorage.setItem(cacheKey, JSON.stringify(finalResult));
    }

    return finalResult;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      isValid: false,
      appearances: 0,
      error: "Verification service busy. Please try again."
    };
  }
};
