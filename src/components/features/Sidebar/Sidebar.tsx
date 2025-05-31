import React, { useState, useEffect } from 'react';
import { MenuIcon, SettingsIcon } from '../../common/Icons';
import { Button } from '../../common/Button';
import { AIProvider, Theme, Language } from '@/types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  currentProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
  onSettingsOpen: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentProvider,
  onProviderChange,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  isExpanded,
  onToggle,
  onSettingsOpen
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <aside className={`${styles.Sidebar} ${isExpanded ? styles.Expanded : ''}`}>
      <div className={styles.Header}>
        <Button
          variant="ghost"
          onClick={() => onToggle(!isExpanded)}
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          className={styles.ToggleButton}
        >
          <MenuIcon />
        </Button>
      </div>

      <div className={styles.Content}>
        <div className={styles.Providers}>
          <Button
            variant={currentProvider === 'googleai' ? 'primary' : 'ghost'}
            onClick={() => onProviderChange('googleai')}
            isFullWidth
          >
            Gemini AI
          </Button>
          <Button
            variant={currentProvider === 'deepseek' ? 'primary' : 'ghost'}
            onClick={() => onProviderChange('deepseek')}
            isFullWidth
          >
            Deepseek AI
          </Button>
        </div>
      </div>

      <div className={styles.Footer}>
        <Button
          variant="ghost"
          onClick={onSettingsOpen}
          aria-label="Open settings"
          className={styles.SettingsButton}
        >
          <SettingsIcon />
        </Button>
      </div>
    </aside>
  );
};
