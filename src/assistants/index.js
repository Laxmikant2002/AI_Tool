import { Assistant as OpenAIAssistant } from "./openai";
import { Assistant as GoogleAIAssistant } from "./googleai";

export class AIProvider {
  #openAIAssistant;
  #googleAIAssistant;
  #activeProvider = "openai";
  #failoverEnabled = true;

  constructor() {
    this.#openAIAssistant = new OpenAIAssistant();
    this.#googleAIAssistant = new GoogleAIAssistant();
  }

  async chat(content, history) {
    try {
      if (this.#activeProvider === "openai") {
        return await this.#openAIAssistant.chat(content, history);
      } else {
        return await this.#googleAIAssistant.chat(content);
      }
    } catch (error) {
      if (this.#failoverEnabled && this.#activeProvider === "openai" && error.message.includes("quota")) {
        console.log("Switching to Google AI due to OpenAI quota limit");
        this.#activeProvider = "googleai";
        return await this.#googleAIAssistant.chat(content);
      }
      throw error;
    }
  }
  async *chatStream(content, history) {
    try {
      if (this.#activeProvider === "openai") {
        try {
          for await (const chunk of this.#openAIAssistant.chatStream(content, history)) {
            yield chunk;
          }
        } catch (openaiError) {
          console.error(`openai error:`, openaiError);
          
          // Switch to Google AI if OpenAI fails with rate limit or quota error
          if (this.#failoverEnabled && 
              (openaiError.message.includes("quota") || 
               openaiError.message.includes("429") || 
               openaiError.response?.status === 429)) {
            
            console.log("🔄 Switching to Google AI due to OpenAI unavailability");
            this.#activeProvider = "googleai";
            
            // Try with Google AI instead
            const response = await this.#googleAIAssistant.chat(content);
            yield `[Switched to Google AI] ${response}`;
            return;
          }
          
          // Re-throw if not handled
          throw openaiError;
        }
      } else {
        // Google AI doesn't support streaming in the same way
        const response = await this.#googleAIAssistant.chat(content);
        yield response;
      }
    } catch (error) {
      console.error(`${this.#activeProvider} provider error:`, error);
      throw error;
    }
  }

  get provider() {
    return this.#activeProvider;
  }

  setProvider(provider) {
    if (provider === "openai" || provider === "googleai") {
      this.#activeProvider = provider;
    }
  }
}
