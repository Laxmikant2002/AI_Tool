import { chatWithGoogleAI, GoogleAIResponse } from '../api/client';
import { IAssistant, ChatOptions } from './IAssistant';
import { Message } from '@/types';
import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

export class GoogleAIAssistant implements IAssistant {
  #chat: ChatSession;

  constructor(model: string = "gemini-1.5-flash") {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
    const generativeModel: GenerativeModel = genAI.getGenerativeModel({ model });
    this.#chat = generativeModel.startChat({ history: [] });
  }

  async chat(content: string, history?: Message[], options?: ChatOptions): Promise<string> {
    try {
      const result: GoogleAIResponse = await chatWithGoogleAI(content);
      return result.content;
    } catch (error) {
      throw error;
    }
  }

  async *chatStream(content: string, history?: Message[], options?: ChatOptions): AsyncGenerator<string> {
    try {
      const result: GoogleAIResponse = await chatWithGoogleAI(content);
      yield result.content;
    } catch (error) {
      throw error;
    }
  }
}
