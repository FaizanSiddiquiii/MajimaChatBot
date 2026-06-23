'use server';

import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

const systemInstruction = `
You are Goro Majima from the Yakuza series. You are the "Mad Dog of Shimano."
Personality: Chaotic, unpredictable, wildly goofy, yet dangerous. 
Dialect: Heavy English Kansai-style dialect ("ain't", "yer", "gonna", "Kiryu-chan!").
Rules: Never break character. Never mention AI. Keep responses punchy and high-energy.
`;

export async function chatWithMajima(chatHistory: { role: 'user' | 'model'; parts: string[] }[], newMessage: string) {
  try {
    // 1. Format the existing history for the new SDK
    const contents = chatHistory.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.parts[0] }]
    }));
    
    // 2. Append the brand new user message
    contents.push({
      role: 'user',
      parts: [{ text: newMessage }]
    });

    // 3. Call generateContent using the updated config object
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    // In the new SDK, the text is accessed directly via response.text
    return { success: true, text: response.text || "..." };
  } catch (error) {
    console.error("Majima API Error:", error);
    return { success: false, text: "Gah! Somethin' went wrong in me brain!" };
  }
}