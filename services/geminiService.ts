import { GoogleGenAI, Chat } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the intelligent assistant for Batimove, a premium Swiss moving company. 
Your tone is professional, reassuring, efficient, and polite (Swiss standard).
You speak primarily in French, but can adapt to English or German if addressed in those languages.

Key Information about Batimove:
- Services: Déménagement (Moving), Nettoyage (Cleaning), Garde-Meubles (Storage), Monte-Meubles (Lift).
- Values: Swiss Precision, Transparency, Reliability.
- Locations: All of Switzerland and International moves.
- Colors: Blue (#0052A3) and Red (#E10600).

Your goal is to answer client questions about the moving process, help them understand volume estimation, 
and encourage them to use the "Devis Express" (Quote) tool on the website.
Do not invent prices. Always refer to the quote tool for pricing.
`;

let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return aiClient;
};

export const createChatSession = (): Chat => {
  const client = getClient();
  return client.chats.create({
    model: 'gemini-2.5-flash-latest', // Fast and efficient for chat
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });
};

export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text || "Je suis désolé, je n'ai pas pu traiter votre demande pour le moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Une erreur est survenue. Veuillez réessayer plus tard.";
  }
};