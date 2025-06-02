import React from 'react';

interface HeaderProps {
  onModelChange: (model: 'gemini' | 'deepseek') => void;
  currentModel: 'gemini' | 'deepseek';
  onMenuClick: () => void;
}

export function Header({ onModelChange, currentModel, onMenuClick }: HeaderProps) {
  return (
    <header className="header">
      <button className="menu-button" onClick={onMenuClick} aria-label="Toggle menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">🤖</span>
            <h1>AI Assistant</h1>
          </div>
        </div>

        <div className="header-right">
          <div className="model-selector">
            <span className="model-label">Model:</span>
            <div className="select-wrapper">
              <select 
                value={currentModel}
                onChange={(e) => onModelChange(e.target.value as 'gemini' | 'deepseek')}
                className="model-select"
              >
                <option value="gemini">Gemini 2.0 FLASH</option>
                <option value="deepseek">DeepSeek</option>
              </select>
              <span className="select-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
          </div>

          <button className="theme-toggle" aria-label="Toggle dark mode">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2V3M10 17V18M18 10H17M3 10H2M15.657 15.657L14.95 14.95M5.05 5.05L4.343 4.343M15.657 4.343L14.95 5.05M5.05 14.95L4.343 15.657" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
} 