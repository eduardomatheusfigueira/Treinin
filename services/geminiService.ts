
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSkillTips = async (skillName: string): Promise<string> => {
  try {
    const prompt = `
      Você é um treinador especialista em patinação inline.
      Forneça um guia conciso e útil para aprender a seguinte habilidade de patinação inline: "${skillName}".
      Estruture sua resposta em três seções com títulos claros em português do Brasil:
      
      ### Detalhes da Técnica
      Descreva os passos chave e o posicionamento do corpo para executar o movimento corretamente.
      
      ### Erros Comuns
      Liste 2-3 erros comuns que iniciantes cometem e como evitá-los.
      
      ### Exercícios Práticos
      Sugira 2-3 exercícios específicos para ajudar a dominar esta habilidade.
      
      Mantenha a linguagem encorajadora, fácil de entender e em português do Brasil.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching skill tips from Gemini API:", error);
    return "Não foi possível buscar as dicas da IA. Por favor, verifique o console para mais detalhes.";
  }
};