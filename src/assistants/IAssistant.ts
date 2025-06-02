import { Message } from '@/types';

export interface ChatOptions {
  signal?: AbortSignal;
}

/**
 * Interface for AI chat providers
 */
export abstract class IAssistant {
  /**
   * Sends a chat message and returns the response
   * @param content - The message content
   * @param history - Previous chat history
   * @param options - Additional options
   * @returns The assistant's response
   */
  abstract chat(content: string, history?: Message[], options?: ChatOptions): Promise<string>;

  /**
   * Streams a chat response chunk by chunk
   * @param content - The message content
   * @param history - Previous chat history
   * @param options - Additional options
   * @returns A generator yielding response chunks
   */
  abstract chatStream(content: string, history?: Message[], options?: ChatOptions): AsyncGenerator<string>;
}
