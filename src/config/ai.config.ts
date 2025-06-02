import { AIProvider, ScrollBehavior } from '@/types';

interface RateLimit {
  requestsPerMinute: number;
  requestsPerDay: number;
}

interface StreamConfig {
  enabled: boolean;
  chunkSize: number;
  delay: number;
}

interface ProviderConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  maxRetries: number;
  retryDelay: number;
  timeout: number;
  rateLimit: RateLimit;
  streamSimulation?: StreamConfig;
}

interface Config {
  googleai: ProviderConfig;
  deepseek: ProviderConfig;
  provider: {
    default: AIProvider;
    fallback: AIProvider;
    failoverEnabled: boolean;
  };
  chat: {
    maxMessages: number;
    maxLength: number;
    scrollBehavior: ScrollBehavior;
  };
}

export const config: Config = {
  googleai: {
    model: 'gemini-2.0-flash',  // Latest model with better performance
    temperature: 0.5,           // Lower temperature for more focused responses
    maxTokens: 4096,           // Increased token limit for better context handling
    topP: 0.95,                // Slightly increased for more nuanced responses
    maxRetries: 3,
    retryDelay: 1000,         // milliseconds
    timeout: 15000,           // Reduced timeout since Flash is optimized for speed
    rateLimit: {
      requestsPerMinute: 15,  // Free tier limit
      requestsPerDay: 1500    // Free tier daily limit
    },
    streamSimulation: {
      enabled: true,
      chunkSize: 20,         // Increased chunk size for faster streaming
      delay: 25,            // Reduced delay for faster streaming (milliseconds)
    },
  },
  deepseek: {
    model: 'deepseek-chat',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000,
    rateLimit: {
      requestsPerMinute: 10,
      requestsPerDay: 1000
    }
  },
  provider: {
    default: 'googleai',
    fallback: 'deepseek',
    failoverEnabled: true
  },
  chat: {
    maxMessages: 50,
    maxLength: 2000,
    scrollBehavior: 'smooth'
  }
};
