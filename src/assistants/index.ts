import { AssistantFactory } from './AssistantFactory';
import { config } from '../config/ai.config';
import { Message, AIProvider as AIProviderType } from '@/types';
import { ChatOptions } from './IAssistant';

/**
 * Main AI provider class that manages different AI assistants
 */
export class AIProvider {
  #factory: AssistantFactory;
  #activeProvider: AIProviderType;
  #failoverEnabled: boolean;

  constructor() {
    this.#factory = AssistantFactory.getInstance();
    this.#activeProvider = config.provider.default;
    this.#failoverEnabled = config.provider.failoverEnabled;

    // Register available providers
    this.#factory.registerProvider('googleai', async () => {
      const { GoogleAIAssistant: Assistant } = await import('./googleai');
      return { default: Assistant };
    });

    this.#factory.registerProvider('deepseek', async () => {
      const { DeepseekAI: Assistant } = await import('./deepseek');
      return { default: Assistant };
    });
  }

  /**
   * Sends a chat message to the active AI provider
   * @param content - Message content
   * @param history - Chat history
   * @param options - Additional options
   * @returns The assistant's response
   */
  async chat(content: string, history?: Message[], options?: ChatOptions): Promise<string> {
    try {
      const provider = await this.#factory.getProvider(this.#activeProvider);
      return await provider.chat(content, history, options);
    } catch (error) {
      if (this.#failoverEnabled && this.#activeProvider !== config.provider.fallback) {
        console.warn(`Failed to use ${this.#activeProvider}, falling back to ${config.provider.fallback}`);
        this.#activeProvider = config.provider.fallback;
        return this.chat(content, history, options);
      }
      throw error;
    }
  }

  /**
   * Streams chat responses from the active AI provider
   * @param content - Message content
   * @param history - Chat history
   * @param options - Additional options
   * @returns A generator yielding response chunks
   */
  async *chatStream(content: string, history?: Message[], options?: ChatOptions): AsyncGenerator<string> {
    try {
      const provider = await this.#factory.getProvider(this.#activeProvider);
      yield* provider.chatStream(content, history, options);
    } catch (error) {
      if (this.#failoverEnabled && this.#activeProvider !== config.provider.fallback) {
        console.warn(`Failed to use ${this.#activeProvider}, falling back to ${config.provider.fallback}`);
        this.#activeProvider = config.provider.fallback;
        yield* this.chatStream(content, history, options);
      } else {
        throw error;
      }
    }
  }

  /**
   * Changes the active AI provider
   * @param provider - The provider name to switch to
   */
  setProvider(provider: AIProviderType): void {
    if (!this.#factory.hasProvider(provider)) {
      throw new Error(`Provider ${provider} not available`);
    }
    this.#activeProvider = provider;
  }

  /**
   * Gets the current active provider
   * @returns The active provider name
   */
  getActiveProvider(): AIProviderType {
    return this.#activeProvider;
  }
}
