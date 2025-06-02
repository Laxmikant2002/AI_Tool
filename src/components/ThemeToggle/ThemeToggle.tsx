import React from 'react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button 
      className="theme-toggle"
      onClick={onToggle}
      data-tooltip={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <span className="theme-icon">
        {isDark ? '🌙' : '☀️'}
      </span>
      <span className="theme-label">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
} 