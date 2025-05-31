/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_GOOGLE_AI_API_KEY: string;

  // AI Provider Settings
  readonly VITE_DEFAULT_AI_PROVIDER: 'googleai' | 'deepseek';
  readonly VITE_FALLBACK_AI_PROVIDER: 'googleai' | 'deepseek';
  readonly VITE_GOOGLEAI_MODEL?: string;
  readonly VITE_GOOGLEAI_MAX_RETRIES?: string;
  readonly VITE_GOOGLEAI_RETRY_DELAY?: string;
  readonly VITE_GOOGLEAI_TIMEOUT?: string;
  readonly VITE_GOOGLEAI_STREAM_SIMULATION?: string;
  readonly VITE_GOOGLEAI_STREAM_CHUNK_SIZE?: string;
  readonly VITE_GOOGLEAI_STREAM_DELAY?: string;

  // Provider Failover Configuration
  readonly VITE_FAILOVER_ENABLED?: string;
  readonly VITE_FAILOVER_DELAY?: string;

  // UI Configuration
  readonly VITE_TYPING_INDICATOR_DELAY?: string;
  readonly VITE_SCROLL_BEHAVIOR?: 'auto' | 'smooth';
  readonly VITE_NOTIFICATION_DURATION?: string;

  // Environment
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}