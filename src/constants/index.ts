// Type definitions
export type Theme = 'light' | 'dark' | 'system';
export type AIProvider = 'googleai' | 'deepseek';
export type ScrollBehavior = 'auto' | 'smooth';

// API Constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

// AI Model Constants
export const AI_PROVIDERS = {
  GOOGLE: 'googleai',
  DEEPSEEK: 'deepseek'
} as const;

export const AI_MODELS = {
  GOOGLE: 'gemini-2.0-flash',
  DEEPSEEK: 'deepseek-chat'
} as const;

export const AI_RATE_LIMITS = {
  GOOGLE: {
    RPM: 15,      // Requests per minute (free tier)
    RPD: 1500     // Requests per day (free tier)
  },
  DEEPSEEK: {
    RPM: 10,      // Example rate limit
    RPD: 1000     // Example rate limit
  }
} as const;

// File Upload Constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/*',      // All image types
  'audio/*',      // All audio types
  'video/*',      // All video types
  '.pdf',         // PDF documents
  '.doc',         // Word documents
  '.docx',        // Word documents (modern)
  '.txt',         // Text files
  '.json',        // JSON files
  '.csv',         // CSV files
  '.md'           // Markdown files
] as const;

// Message Constants
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_CONTEXT_LENGTH = 32768; // Maximum context window
export const AUTO_CLOSE_DELAY = 3000;    // 3 seconds
export const TYPING_INDICATOR_DELAY = 500; // 0.5 seconds

// WebSocket Constants
export const WS_RECONNECT_ATTEMPTS = 3;
export const WS_RECONNECT_DELAY = 2000;   // 2 seconds
export const WS_PING_INTERVAL = 30000;    // 30 seconds

// Theme Constants
export const THEMES: Theme[] = ['light', 'dark', 'system'];
export const LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko'] as const;

// Animation Constants
export const ANIMATION_DURATION = 200;     // Faster animations
export const TRANSITION_DURATION = 150;    // Faster transitions

// Breakpoints (in pixels)
export const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  CONTRAST: 'contrast',
  LANGUAGE: 'language',
  CURRENT_PROVIDER: 'currentProvider',
  HISTORY: 'chatHistory',
  SETTINGS: 'userSettings'
} as const;

// Message Types
export const ROLES = ['user', 'assistant', 'system'] as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  API_ERROR: 'An error occurred while processing your request. Please try again.',
  RATE_LIMIT: 'Rate limit exceeded. Please try again later.',
  TOKEN_LIMIT: 'Message exceeds maximum token limit'
} as const;