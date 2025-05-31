/**
 * Factory class for creating AI assistant instances
 */
export class AssistantFactory {
  #providers;
  #instances;

  constructor() {
    this.#providers = new Map();
    this.#instances = new Map();
  }

  /**
   * Register a provider module
   * @param {string} name - Provider name
   * @param {Function} importFn - Dynamic import function
   */
  registerProvider(name, importFn) {
    this.#providers.set(name, importFn);
  }

  /**
   * Get a provider instance
   * @param {string} name - Provider name
   * @returns {Promise<IAssistant>} Provider instance
   */
  async getProvider(name) {
    if (this.#instances.has(name)) {
      return this.#instances.get(name);
    }

    const importFn = this.#providers.get(name);
    if (!importFn) {
      throw new Error(`Provider ${name} not registered`);
    }

    try {
      const module = await importFn();
      const instance = new module.Assistant();
      this.#instances.set(name, instance);
      return instance;
    } catch (error) {
      throw new Error(`Failed to load provider ${name}: ${error.message}`);
    }
  }

  /**
   * Clear all provider instances
   */
  clearInstances() {
    this.#instances.clear();
  }
} 