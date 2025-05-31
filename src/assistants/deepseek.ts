import { IAssistant } from './IAssistant';

export class DeepseekAI extends IAssistant {
  private apiKey: string;
  private model: string;
  private maxRetries: number;
  private retryDelay: number;

  constructor(config: any) {
    super();
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.model = config.model || 'deepseek-chat';
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  async chat(content: string, history: any[], options: any = {}) {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [...history, { role: 'user', content }],
          ...options
        })
      });

      if (!response.ok) {
        throw new Error(`Deepseek API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0].message.content,
        role: 'assistant'
      };
    } catch (error) {
      console.error('Deepseek chat error:', error);
      throw error;
    }
  }

  async *chatStream(content: string, history: any[], options: any = {}) {
    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [...history, { role: 'user', content }],
          stream: true,
          ...options
        })
      });

      if (!response.ok) {
        throw new Error(`Deepseek API error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.choices[0].delta.content) {
              yield data.choices[0].delta.content;
            }
          }
        }
      }
    } catch (error) {
      console.error('Deepseek stream error:', error);
      throw error;
    }
  }
}
