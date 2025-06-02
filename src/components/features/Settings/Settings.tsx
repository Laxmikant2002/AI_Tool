import { useEffect } from 'react';
import { SettingsIcon } from '../../common/Icons';
import { Theme, Language, AIProvider } from '@/types';
import styles from './Settings.module.css';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function Settings({
  isOpen,
  onClose,
  currentProvider,
  onProviderChange,
  theme,
  onThemeChange,
  language,
  onLanguageChange
}: SettingsProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.Backdrop} onClick={onClose} />
      <div 
        className={styles.Settings}
        role="dialog"
        aria-labelledby="settings-title"
        aria-modal="true"
      >
        <header className={styles.Header}>
          <SettingsIcon className={styles.Icon} />
          <h2 id="settings-title" className={styles.Title}>Settings</h2>
          <button 
            className={styles.CloseButton}
            onClick={onClose}
            aria-label="Close settings"
          >
            ×
          </button>
        </header>

        <div className={styles.Content}>
          <div className={styles.Section}>
            <h3 className={styles.SectionTitle}>AI Provider</h3>
            <select
              value={currentProvider}
              onChange={(e) => onProviderChange(e.target.value as AIProvider)}
              className={styles.Select}
            >
              <option value="openai">OpenAI</option>
              <option value="googleai">Google AI</option>
            </select>
          </div>

          <div className={styles.Section}>
            <h3 className={styles.SectionTitle}>Theme</h3>
            <select
              value={theme}
              onChange={(e) => onThemeChange(e.target.value as Theme)}
              className={styles.Select}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          <div className={styles.Section}>
            <h3 className={styles.SectionTitle}>Language</h3>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className={styles.Select}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="ru">Русский</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
            </select>
          </div>

          <div className={styles.Section}>
            <h3 className={styles.SectionTitle}>About</h3>
            <p className={styles.Description}>
              AI Chatbot is a modern chat interface powered by OpenAI and Google AI.
              Built with React and designed for a seamless conversational experience.
            </p>
            <p className={styles.Version}>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
}