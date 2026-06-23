const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

// Try reading .env.local manually
const envPath = './.env.local';
let key = process.env.GEMINI_API_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/GEMINI_API_KEY\s*=\s*(.*)/);
  if (match && match[1]) {
    key = match[1].trim().replace(/['"]/g, ''); // strip quotes
  }
}

console.log("API Key Source:", fs.existsSync(envPath) ? ".env.local file" : "process.env");
console.log("API Key:", key ? "FOUND (starts with: " + key.substring(0, 5) + "...)" : "MISSING");

const ai = new GoogleGenAI(key ? { apiKey: key } : {});

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Hello',
    });
    console.log("Success! Response:", response.text);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}

test();
