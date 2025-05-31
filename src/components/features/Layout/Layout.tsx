import { useEffect } from 'react';
import { MenuIcon, RobotIcon, SettingsIcon, SunIcon, MoonIcon, TranslateIcon, ContrastIcon } from '../../common/Icons';
import { Button } from '../../common/Button';
import styles from './Layout.module.css';

/**
 * Main layout component that handles the application structure
 * @param {Object} props - Component props
 * @param {boolean} props.isSidebarExpanded - Whether the sidebar is expanded
 * @param {function} props.onSidebarToggle - Callback when sidebar is toggled
 * @param {string} props.theme - Current theme (light/dark)
 * @param {function} props.onThemeToggle - Callback when theme is toggled
 * @param {boolean} props.contrast - Whether high contrast mode is enabled
 * @param {function} props.onContrastToggle - Callback when contrast is toggled
 * @param {string} props.language - Current language
 * @param {function} props.onLanguageChange - Callback when language is changed
 * @param {function} props.onSettingsOpen - Callback when settings is opened
 * @param {React.ReactNode} props.children - Child components
 */
export function Layout({
  isSidebarExpanded,
  onSidebarToggle,
  theme,
  onThemeToggle,
  contrast,
  onContrastToggle,
  language,
  onLanguageChange,
  onSettingsOpen,
  children
}) {
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && isSidebarExpanded) {
        onSidebarToggle(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarExpanded, onSidebarToggle]);

  return (
    <div className={styles.Layout}>
      <header className={styles.Header}>
        <div className={styles.HeaderLeft}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSidebarToggle(!isSidebarExpanded)}
            ariaLabel="Toggle sidebar"
            leftIcon={<MenuIcon />}
          />
          <RobotIcon className={styles.Logo} />
          <h1 className={styles.Title}>AI Chatbot</h1>
        </div>

        <div className={styles.HeaderRight}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onThemeToggle}
            ariaLabel="Toggle theme"
            leftIcon={theme === 'light' ? <MoonIcon /> : <SunIcon />}
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onContrastToggle}
            ariaLabel="Toggle high contrast"
            leftIcon={<ContrastIcon />}
          >
            High contrast
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsOpen}
            ariaLabel="Open settings"
            leftIcon={<SettingsIcon />}
          >
            Settings
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange(language === 'en' ? 'es' : 'en')}
            ariaLabel="Change language"
            leftIcon={<TranslateIcon />}
          >
            {language.toUpperCase()}
          </Button>
        </div>
      </header>

      <main className={`${styles.Main} ${isSidebarExpanded ? styles.SidebarExpanded : ''}`}>
        {children}
      </main>
    </div>
  );
} 