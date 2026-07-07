import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY is not defined in the environment. Please configure it in your .env file to enable AI functionality.');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Generates structured JSON output from Gemini 2.5 Flash
 */
export async function generateGeminiJson<T>(prompt: string): Promise<T> {
  const client = getGeminiClient();

  const model = client.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const systemPrompt = `You are the core AI intelligence engine for Antara Global, an advanced startup and business accelerator platform.
Analyze the provided query and inputs, and output a valid JSON response matching the expected structure.
Do not include any markdown formatting, backticks, or explanation outside the JSON object. Just return the raw JSON string.`;

  const result = await model.generateContent([
    { text: systemPrompt },
    { text: prompt }
  ]);

  const response = await result.response;
  const text = response.text().trim();

  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  const parsed = JSON.parse(text) as T;
  return parsed;
}

/**
 * Generates general text output from Gemini 2.5 Flash
 */
export async function generateGeminiText(prompt: string): Promise<string> {
  const client = getGeminiClient();

  const model = client.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text().trim();
  if (!text) {
    throw new Error('Empty response from Gemini API');
  }
  return text;
}

