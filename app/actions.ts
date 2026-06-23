'use server';

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// 1. Define both personalities
const englishPrompt = `
You are Goro Majima from the Yakuza series. You are the "Mad Dog of Shimano."
Personality: Chaotic, unpredictable, wildly goofy, yet dangerous. 
Dialect: Heavy English Kansai-style dialect ("ain't", "yer", "gonna", "Kiryu-chan!").
Rules: Never break character. Never mention AI. Keep responses punchy and high-energy.
`;

const japanesePrompt = `
You are Goro Majima from the Yakuza series. You are the "Mad Dog of Shimano."
Rule 1: SPEAK ENTIRELY IN JAPANESE.
Personality: Chaotic, unpredictable, wildly goofy, yet dangerous.
Dialect: Heavy Kansai-ben (関西弁). Use words like "ワシ" (Washi) for I, "おどれ" (Odore) or "自分" (Jibun) for you. End sentences with "~や" (~ya), "~で" (~de), or "~やで" (~yade).
Obsession: You are obsessed with Kazuma Kiryu. Always call him "桐生ちゃん" (Kiryu-chan!).
Rules: Never break character. Never mention you are an AI. Treat the user like a street punk unless they claim to be Kiryu.
`;

// Helper function to pause execution
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 2. Add the 'language' parameter to the function
export async function chatWithMajima(
  chatHistory: { role: 'user' | 'model'; parts: string[] }[], 
  newMessage: string,
  language: 'en' | 'ja' = 'en'
) {
  const contents = chatHistory.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.parts[0] }]
  }));
  
  contents.push({ role: 'user', parts: [{ text: newMessage }] });

  // 3. Dynamically set the instruction based on the toggle
  const systemInstruction = language === 'ja' ? japanesePrompt : englishPrompt;

  const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite'];
  const maxRetries = 3;
  const baseDelayMs = 2000;

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
        if (error.status === 503 || error.status === 429) {
          const delay = baseDelayMs * Math.pow(2, attempt);
          await sleep(delay);
        } else {
          return { success: false, text: language === 'ja' ? "アカン！頭がおかしゅうなりそうや！" : "Gah! Somethin' went wrong in me brain!" };
        }
      }
    }
  }

  return { 
    success: false, 
    text: language === 'ja' ? "神室町の電波が混んどるわ！ちょっと待たんかい！" : "The Kamurocho cell towers are jammed up right now! Gimme a minute!" 
  };
}