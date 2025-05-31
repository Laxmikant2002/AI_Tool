import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel with your project token
mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN);

export const analytics = {
  /**
   * Track a user action
   * @param {string} event - Event name
   * @param {Object} properties - Event properties
   */
  track(event, properties = {}) {
    mixpanel.track(event, {
      ...properties,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track provider usage
   * @param {string} provider - AI provider name
   * @param {boolean} success - Whether the request was successful
   */
  trackProviderUsage(provider, success) {
    this.track('provider_used', {
      provider,
      success,
      error: !success,
    });
  },

  /**
   * Track feature usage
   * @param {string} feature - Feature name
   */
  trackFeatureUsage(feature) {
    this.track('feature_used', { feature });
  },

  /**
   * Track error occurrence
   * @param {string} error - Error message
   * @param {string} context - Error context
   */
  trackError(error, context) {
    this.track('error_occurred', {
      error_message: error,
      error_context: context,
    });
  },

  /**
   * Track user session
   * @param {string} action - Session action (start/end)
   */
  trackSession(action) {
    this.track('session', { action });
  },

  /**
   * Track message metrics
   * @param {Object} metrics - Message metrics
   */
  trackMessageMetrics(metrics) {
    this.track('message_metrics', metrics);
  },
}; 