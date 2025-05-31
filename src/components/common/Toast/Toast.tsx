import { useEffect } from 'react';
import styles from './Toast.module.css';

const ICONS = {
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

const AUTO_CLOSE_DELAY = 5000; // 5 seconds

export function Toast({ message, type = 'info', icon, onClose }) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, AUTO_CLOSE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [onClose]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className={`${styles.Toast} ${styles[type]}`}
      role="alert"
      aria-live="polite"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.IconContainer}>
        {icon ? (
          <span className={styles.CustomIcon}>{icon}</span>
        ) : (
          ICONS[type]
        )}
      </div>
      <p className={styles.Message}>{message}</p>
      <button 
        className={styles.CloseButton}
        onClick={onClose}
        aria-label="Close notification"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className={styles.ProgressBar} style={{ animationDuration: `${AUTO_CLOSE_DELAY}ms` }} />
    </div>
  );
} 