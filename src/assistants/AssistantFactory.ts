import { IAssistant } from './IAssistant';
import { config } from '../config/ai.config';

type ImportFunction = () => Promise<{
  default: {
    new (...args: any[]): IAssistant;
  };
}>;

export class AssistantFactory {
  private static instance: AssistantFactory;
  private providers: Map<string, ImportFunction>;
  private instances: Map<string, IAssistant>;
  private currentProvider: string;

  private constructor() {
    this.providers = new Map();
    this.instances = new Map();
    this.currentProvider = config.provider.default;
  }

  public static getInstance(): AssistantFactory {
    if (!AssistantFactory.instance) {
      AssistantFactory.instance = new AssistantFactory();
    }
    return AssistantFactory.instance;
  }

  public registerProvider(name: string, importFn: ImportFunction): void {
    this.providers.set(name, importFn);
  }

  public hasProvider(name: string): boolean {
    return this.providers.has(name);
  }

  public async getProvider(name?: string): Promise<IAssistant> {
    const providerName = name || this.currentProvider;

    // Return cached instance if available
    const cachedInstance = this.instances.get(providerName);
    if (cachedInstance) {
      return cachedInstance;
    }

    const importFn = this.providers.get(providerName);
    if (!importFn) {
      // If Gemini fails, try Deepseek
      if (providerName === 'googleai' && config.provider.failoverEnabled) {
        console.warn('Falling back to Deepseek AI');
        return this.getProvider('deepseek');
      }
      throw new Error(`Provider ${providerName} not found`);
    }

    try {
      const module = await importFn();
      const ProviderClass = module.default;
      const providerConfig = providerName === 'googleai' ? config.googleai : config.deepseek;
      const provider = new ProviderClass(providerConfig);
      this.instances.set(providerName, provider);
      return provider;
    } catch (error) {
      console.error(`Error initializing provider ${providerName}:`, error);
      if (config.provider.failoverEnabled && providerName === 'googleai') {
        console.warn('Falling back to Deepseek AI');
        return this.getProvider('deepseek');
      }
      throw error;
    }
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
