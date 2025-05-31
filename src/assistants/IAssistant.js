/**
 * @typedef {Object} ChatOptions
 * @property {AbortSignal} [signal] - AbortController signal for timeout handling
 */

/**
 * Interface for AI chat providers
 * @interface
 */
export class IAssistant {
  /**
   * Sends a chat message and returns the response
   * @param {string} content - The message content
   * @param {Array<Object>} [history] - Previous chat history
   * @param {ChatOptions} [options] - Additional options
   * @returns {Promise<string>} The assistant's response
   */
  async chat(content, history, options) {
    throw new Error('chat() must be implemented');
  }

  /**
   * Streams a chat response chunk by chunk
   * @param {string} content - The message content
   * @param {Array<Object>} [history] - Previous chat history
   * @param {ChatOptions} [options] - Additional options
   * @returns {AsyncGenerator<string>} A generator yielding response chunks
   */
  async *chatStream(content, history, options) {
    throw new Error('chatStream() must be implemented');
  }
} 