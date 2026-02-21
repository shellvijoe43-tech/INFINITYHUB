import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateSaaSContent = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API key.";
  }
};

export const generateModuleResponse = async (moduleName: string, userPrompt: string) => {
  const systemInstruction = `You are an expert AI assistant for the InfinityHub SaaS platform. 
  You are currently operating the "${moduleName}" module. 
  Your goal is to provide high-quality, production-ready output based on the user's request.
  If it's a web builder, provide HTML/CSS code. If it's a logo designer, describe the visual elements.
  Always be professional and concise.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API key.";
  }
};

export const huntClients = async () => {
  const prompt = "Act as a high-end sales agent. Generate 5 potential B2B leads for a SaaS platform that offers AI content creation and marketing automation. Include company name, industry, and a short outreach pitch.";
  return await generateSaaSContent(prompt);
};
