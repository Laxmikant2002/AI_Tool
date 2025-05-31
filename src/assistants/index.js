import { AssistantFactory } from './AssistantFactory';
import { config } from '../config/ai.config';

/**
 * Main AI provider class that manages different AI assistants
 */
export class AIProvider {
  #factory;
  #activeProvider;
  #failoverEnabled;

  constructor() {
    this.#factory = new AssistantFactory();
    this.#activeProvider = config.provider.default;
    this.#failoverEnabled = config.provider.failoverEnabled;

    // Register available providers
    this.#factory.registerProvider('openai', () => import('./openai'));
    this.#factory.registerProvider('googleai', () => import('./googleai'));
  }

  /**
   * Sends a chat message to the active AI provider
   * @param {string} content - Message content
   * @param {Array} history - Chat history
   * @returns {Promise<string>} The assistant's response
   */
  async chat(content, history) {
    try {
      const provider = await this.#factory.getProvider(this.#activeProvider);
      return await provider.chat(content, history);
    } catch (error) {
      if (this.#shouldFailover(error)) {
        console.log(`Switching to Google AI due to ${this.#activeProvider} unavailability`);
        this.#activeProvider = 'googleai';
        const fallbackProvider = await this.#factory.getProvider('googleai');
        return await fallbackProvider.chat(content, history);
      }
      throw error;
    }
  }

  /**
   * Streams a chat response from the active AI provider
   * @param {string} content - Message content
   * @param {Array} history - Chat history
   * @returns {AsyncGenerator<string>} Response stream
   */
  async *chatStream(content, history) {
    try {
      const provider = await this.#factory.getProvider(this.#activeProvider);
      for await (const chunk of provider.chatStream(content, history)) {
        yield chunk;
      }
    } catch (error) {
      if (this.#shouldFailover(error)) {
        console.log(`Switching to Google AI due to ${this.#activeProvider} unavailability`);
        this.#activeProvider = 'googleai';
        const fallbackProvider = await this.#factory.getProvider('googleai');
        const response = await fallbackProvider.chat(content, history);
        yield `[Switched to Google AI] ${response}`;
        return;
      }
      throw error;
    }
  }

  /**
   * Gets the current active provider name
   */
  get provider() {
    return this.#activeProvider;
  }

  /**
   * Sets the active provider
   * @param {string} provider - Provider name
   */
  setProvider(provider) {
    if (provider === 'openai' || provider === 'googleai') {
      this.#activeProvider = provider;
    }
  }

  /**
   * Checks if failover should be attempted
   * @private
   */
  #shouldFailover(error) {
    return this.#failoverEnabled && 
           this.#activeProvider === 'openai' && 
           (error.message.includes('quota') || 
            error.message.includes('429') || 
            error.response?.status === 429);
  }
}
