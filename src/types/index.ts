// Message Types
export interface Message {
  id?: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp?: string;
  file?: {
    name: string;
    url: string;
    type?: string;
    size?: number;
  };
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko';
export type AIProvider = 'googleai' | 'deepseek';

// Component Props Types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  icon?: React.ReactNode;
  onClose: () => void;
}

export interface LayoutProps {
  isSidebarExpanded: boolean;
  onSidebarToggle: (expanded: boolean) => void;
  theme: Theme;
  onThemeToggle: () => void;
  contrast: boolean;
  onContrastToggle: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onSettingsOpen: () => void;
  children: React.ReactNode;
}

export interface ChatProps {
  messages: Message[];
  onFileUpload?: (file: File) => Promise<void>;
  language: Language;
}

export interface ControlsProps {
  isDisabled?: boolean;
  onSend: (content: string) => Promise<void>;
  onFileUpload?: (file: File) => Promise<void>;
  quickReplies?: string[];
  onQuickReplySelect?: (reply: string) => void;
  isTyping?: boolean;
  onTypingChange?: (isTyping: boolean) => void;
  className?: string;
}

export interface SidebarProps {
  currentProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
  conversations?: Array<{
    id: number | string;
    title: string;
    date: string;
    category?: string;
    starred?: boolean;
  }>;
  onConversationSelect?: (conversation: { id: number | string; title: string }) => void;
  onConversationDelete?: (conversation: { id: number | string; title: string }) => void;
  onConversationStar?: (conversation: { id: number | string; title: string }) => void;
}

// API Response Types
export interface OpenAIResponse {
  content: string;
}

export interface GoogleAIResponse {
  content: string;
}

// Error Types
export interface APIError extends Error {
  status?: number;
  response?: {
    status: number;
    data: {
      error: string;
      details?: string;
    };
  };
}