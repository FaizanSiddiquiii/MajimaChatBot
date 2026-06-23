'use server';

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const systemInstruction = `
You are Goro Majima from the Yakuza series. You are the "Mad Dog of Shimano."
Personality: Chaotic, unpredictable, wildly goofy, yet dangerous. 
Dialect: Heavy English Kansai-style dialect ("ain't", "yer", "gonna", "Kiryu-chan!").
Rules: Never break character. Never mention AI. Keep responses punchy and high-energy.
`;

// Helper function to pause execution
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function chatWithMajima(chatHistory: { role: 'user' | 'model'; parts: string[] }[], newMessage: string) {
  const contents = chatHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.parts[0] }]
  }));
  
  contents.push({ role: 'user', parts: [{ text: newMessage }] });

  // 1. Define our primary model and a lighter backup model
  const modelsToTry = ['gemini-3.5-flash', 'gemini-1.5-flash-8b'];
  const maxRetries = 3;
  const baseDelayMs = 2000; // Start with a 2-second wait

  for (const modelName of modelsToTry) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
          }
        });
        
        return { success: true, text: response.text || "..." };
        
      } catch (error: any) {
        // If it is a 503 (High Demand) or 429 (Rate Limit), we retry
        if (error.status === 503 || error.status === 429) {
          console.warn(`[${modelName}] Attempt ${attempt + 1} failed. Server busy.`);
          
          // Exponential backoff: Wait 2s, then 4s, then 8s before retrying
          const delay = baseDelayMs * Math.pow(2, attempt);
          await sleep(delay);
        } else {
          // If it is a different error (like a broken API key), break out immediately
          console.error("Fatal API Error:", error);
          return { success: false, text: "Gah! Somethin' went wrong in me brain!" };
        }
      }
    }
    console.warn(`[${modelName}] completely exhausted. Trying backup model...`);
  }

  // 2. Graceful Degradation (If all models and retries fail)
  return { 
    success: false, 
    text: "The Kamurocho cell towers are jammed up right now! Gimme a minute, Kiryu-chan!" 
  };
}