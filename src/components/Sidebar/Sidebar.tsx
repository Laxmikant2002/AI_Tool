import React from 'react';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const categories: Category[] = [
  {
    id: 'conversational',
    name: 'Conversational',
    description: 'Interactive dialogue and responsive interfaces',
    icon: '💬'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Content generation and creative tasks',
    icon: '✨'
  },
  {
    id: 'analytical',
    name: 'Analytical',
    description: 'Data analysis and insights',
    icon: '📊'
  },
  {
    id: 'educational',
    name: 'Educational',
    description: 'Learning and tutoring support',
    icon: '📚'
  },
  {
    id: 'specialized',
    name: 'Specialized',
    description: 'Domain-specific tools and tasks',
    icon: '🔧'
  }
];

interface SidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeCategory, onCategoryChange, isOpen, onClose }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>AI Assistant</h2>
        <button className="close-button" onClick={onClose} aria-label="Close sidebar">
          ×
        </button>
      </div>

      <nav className="category-list" role="navigation">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(category.id)}
            aria-current={activeCategory === category.id ? 'page' : undefined}
            data-tooltip={category.description}
          >
            <span className="category-icon" role="img" aria-hidden="true">
              {category.icon}
            </span>
            <div className="category-info">
              <span className="category-name">{category.name}</span>
              <span className="category-description">{category.description}</span>
            </div>
            {activeCategory === category.id && (
              <span className="active-indicator" aria-hidden="true" />
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="api-status">
          <span className="status-dot online" aria-hidden="true"></span>
          <span>APIs Online</span>
        </div>
        <button className="theme-toggle" aria-label="Toggle theme">
          <span className="icon">🌙</span>
        </button>
      </div>
    </aside>
  );
} 