import { IAssistant } from './IAssistant';
import { GoogleAI } from './googleai';
import { DeepseekAI } from './deepseek';
import config from '../config/ai.config';

export class AssistantFactory {
  private static instance: AssistantFactory;
  private providers: Map<string, any>;
  private currentProvider: string;

  private constructor() {
    this.providers = new Map();
    this.currentProvider = config.provider.default;
    
    // Register providers
    this.providers.set('googleai', new GoogleAI(config.googleai));
    this.providers.set('deepseek', new DeepseekAI(config.deepseek));
  }

  public static getInstance(): AssistantFactory {
    if (!AssistantFactory.instance) {
      AssistantFactory.instance = new AssistantFactory();
    }
    return AssistantFactory.instance;
  }

  public async getProvider(name?: string): Promise<IAssistant> {
    const providerName = name || this.currentProvider;
    const provider = this.providers.get(providerName);

    if (!provider) {
      // If Gemini fails, try Deepseek
      if (providerName === 'googleai') {
        console.warn('Falling back to Deepseek AI');
        return this.getProvider('deepseek');
      }
      throw new Error(`Provider ${providerName} not found`);
    }

    return provider;
  }

  public setDefaultProvider(name: string): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider ${name} not found`);
    }
    this.currentProvider = name;
  }

  public getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
