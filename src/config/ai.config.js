/**
 * @typedef {'googleai' | 'deepseek'} AIProvider
 * @typedef {'smooth' | 'auto'} ScrollBehavior
 */

const defaultConfig = {  googleai: {
    model: 'gemini-2.0-flash',  // Latest model with better performance
    temperature: 0.5,           // Lower temperature for more focused responses
    maxTokens: 4096,           // Increased token limit for better context handling
    topP: 0.95,               // Slightly increased for more nuanced responses
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
  },
  provider: {
    /** @type {AIProvider} */
    default: 'googleai',
    failoverEnabled: true,
    failoverDelay: 1000,
  },
  ui: {
    typingIndicatorDelay: 500,
    /** @type {ScrollBehavior} */
    scrollBehavior: 'smooth',
    notificationDuration: 3000,
  },
};

// Environment-specific overrides
const envConfig = {
  googleai: {
    model: import.meta.env.VITE_GOOGLEAI_MODEL || defaultConfig.googleai.model,
    temperature: Number(import.meta.env.VITE_GOOGLEAI_TEMPERATURE) || defaultConfig.googleai.temperature,
    maxTokens: Number(import.meta.env.VITE_GOOGLEAI_MAX_TOKENS) || defaultConfig.googleai.maxTokens,
    topP: Number(import.meta.env.VITE_GOOGLEAI_TOP_P) || defaultConfig.googleai.topP,
    maxRetries: Number(import.meta.env.VITE_GOOGLEAI_MAX_RETRIES) || defaultConfig.googleai.maxRetries,
    retryDelay: Number(import.meta.env.VITE_GOOGLEAI_RETRY_DELAY) || defaultConfig.googleai.retryDelay,
    timeout: Number(import.meta.env.VITE_GOOGLEAI_TIMEOUT) || defaultConfig.googleai.timeout,
    streamSimulation: {
      enabled: import.meta.env.VITE_GOOGLEAI_STREAM_SIMULATION !== 'false',
      chunkSize: Number(import.meta.env.VITE_GOOGLEAI_STREAM_CHUNK_SIZE) || defaultConfig.googleai.streamSimulation.chunkSize,
      delay: Number(import.meta.env.VITE_GOOGLEAI_STREAM_DELAY) || defaultConfig.googleai.streamSimulation.delay,
    },
  },
  deepseek: {
    model: import.meta.env.VITE_DEEPSEEK_MODEL || defaultConfig.deepseek.model,
    temperature: Number(import.meta.env.VITE_DEEPSEEK_TEMPERATURE) || defaultConfig.deepseek.temperature,
    maxTokens: Number(import.meta.env.VITE_DEEPSEEK_MAX_TOKENS) || defaultConfig.deepseek.maxTokens,
    topP: Number(import.meta.env.VITE_DEEPSEEK_TOP_P) || defaultConfig.deepseek.topP,
    maxRetries: Number(import.meta.env.VITE_DEEPSEEK_MAX_RETRIES) || defaultConfig.deepseek.maxRetries,
    retryDelay: Number(import.meta.env.VITE_DEEPSEEK_RETRY_DELAY) || defaultConfig.deepseek.retryDelay,
    timeout: Number(import.meta.env.VITE_DEEPSEEK_TIMEOUT) || defaultConfig.deepseek.timeout,
  },
  provider: {
    /** @type {AIProvider} */
    default: import.meta.env.VITE_DEFAULT_AI_PROVIDER || defaultConfig.provider.default,
    failoverEnabled: import.meta.env.VITE_FAILOVER_ENABLED !== 'false',
    failoverDelay: Number(import.meta.env.VITE_FAILOVER_DELAY) || defaultConfig.provider.failoverDelay,
  },
  ui: {
    typingIndicatorDelay: Number(import.meta.env.VITE_TYPING_INDICATOR_DELAY) || defaultConfig.ui.typingIndicatorDelay,
    /** @type {ScrollBehavior} */
    scrollBehavior: import.meta.env.VITE_SCROLL_BEHAVIOR || defaultConfig.ui.scrollBehavior,
    notificationDuration: Number(import.meta.env.VITE_NOTIFICATION_DURATION) || defaultConfig.ui.notificationDuration,
  },
};

export const config = {
  ...defaultConfig,
  ...envConfig,
}; 