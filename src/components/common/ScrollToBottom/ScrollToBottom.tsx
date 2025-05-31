import styles from './ScrollToBottom.module.css';

export function ScrollToBottom({ onClick, visible }) {
  if (!visible) return null;

  return (
    <button
      className={styles.ScrollToBottom}
      onClick={onClick}
      aria-label="Scroll to bottom"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className={styles.Icon}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </button>
  );
} 