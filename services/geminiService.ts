
import { GoogleGenAI, Type } from "@google/genai";
import { ValidationResult } from "../types";

export const verifyPlayerAppearance = async (
  playerName: string,
  clubName: string
): Promise<ValidationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Player: ${playerName}, Club: ${clubName}`,
      config: {
        systemInstruction: `You are a high-speed football statistics validator. 
        Determine if the player played for the specified English club and provide their TOTAL competitive appearances (League, FA Cup, League Cup, Europe). 
        Prioritize speed. Use internal knowledge if certain; use googleSearch ONLY if precise numbers for that specific club are unknown.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for faster data retrieval
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { 
              type: Type.BOOLEAN, 
              description: "True if the player made at least 1 competitive appearance for the club." 
            },
            appearances: { 
              type: Type.INTEGER, 
              description: "The total number of competitive appearances for this specific club." 
            },
            explanation: { 
              type: Type.STRING, 
              description: "A short reason if invalid." 
            }
          },
          required: ["isValid", "appearances"]
        }
      },
    });

    const result = JSON.parse(response.text || "{}");
    
    // Extract grounding URLs for accuracy verification
    const sourceUrl = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.[0]?.web?.uri;

    if (!result.isValid || !result.appearances || result.appearances === 0) {
      return { 
        isValid: false, 
        appearances: 0, 
        error: result.explanation || `Could not verify ${playerName} played for ${clubName}.` 
      };
    }

    return {
      isValid: true,
      appearances: result.appearances,
      sourceUrl
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      isValid: false,
      appearances: 0,
      error: "Error verifying player. Please try again."
    };
  }
};
