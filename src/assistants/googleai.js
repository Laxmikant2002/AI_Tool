import { chatWithGoogleAI } from '../api/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class Assistant {
  #chat;

  constructor(model = "gemini-1.5-flash") {
    const gemini = googleai.getGenerativeModel({ model });
    this.#chat = gemini.startChat({ history: [] });
  }

  async chat(content) {
    try {
      const result = await chatWithGoogleAI(content);
      return result.content;
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content) {
    try {
      const result = await chatWithGoogleAI(content);
      yield result.content;
    } catch (error) {
      throw error;
    }
  }
}