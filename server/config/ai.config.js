export const config = {
  openai: {
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    maxRetries: Number(process.env.OPENAI_MAX_RETRIES) || 3,
    retryDelay: Number(process.env.OPENAI_RETRY_DELAY) || 1000,
    timeout: Number(process.env.OPENAI_TIMEOUT) || 30000,
  },
  googleai: {
    model: process.env.GOOGLEAI_MODEL || 'gemini-1.5-flash',
    maxRetries: Number(process.env.GOOGLEAI_MAX_RETRIES) || 3,
    retryDelay: Number(process.env.GOOGLEAI_RETRY_DELAY) || 1000,
    timeout: Number(process.env.GOOGLEAI_TIMEOUT) || 30000,
  }
}; 