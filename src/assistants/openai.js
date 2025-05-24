import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class Assistant {
  #model;
  #retryCount = 0;
  #maxRetries = 3;
  #retryDelay = 1000; // Start with 1 second delay
  constructor(model = "gpt-3.5-turbo") {
    this.#model = model;
  }

  async chat(content, history) {
    try {
      const result = await this.#makeRequest(content, history);
      this.#retryCount = 0; // Reset counter on success
      return result;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      if (error.response?.status === 429) {
        throw new Error("The AI is currently busy. Please wait a moment and try again.");
      } else {
        throw new Error("Sorry, I couldn't process your request. Please try again!");
      }
    }
  }

  async #makeRequest(content, history) {
    try {
      const result = await openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
      });
      return result.choices[0].message.content;
    } catch (error) {
      if (error.response?.status === 429 && this.#retryCount < this.#maxRetries) {
        this.#retryCount++;
        const delay = this.#retryDelay * Math.pow(2, this.#retryCount - 1); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.#makeRequest(content, history);
      }
      throw error;
    }
  }

  async *chatStream(content, history) {
    try {
      const result = await openai.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        stream: true,
      });

      for await (const chunk of result) {
        yield chunk.choices[0]?.delta?.content || "";
      }    } catch (error) {
      console.error('OpenAI Stream Error:', error);
      if (error.response?.status === 429) {
        const errorMessage = error.message?.includes('quota') 
          ? "API quota exceeded. Please check your OpenAI API key billing status."
          : "The AI is currently busy. Please wait a moment and try again.";
        throw new Error(errorMessage);
      }
      throw error;
    }
  }
}