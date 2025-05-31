import { useState, useEffect, useRef } from 'react';
import { 
  RobotIcon, 
  SearchIcon, 
  SettingsIcon, 
  DeleteIcon, 
  StarIcon, 
  FolderIcon,
  ChevronIcon 
} from '../../common/Icons';
import { Button } from '../../common/Button';
import styles from './Sidebar.module.css';

const CATEGORIES = ['All', 'Favorites', 'Work', 'Personal', 'Archive'];

export function Sidebar({ 
  currentProvider,
  onProviderChange,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  isCollapsed,
  onToggle,
  conversations = [],
  onConversationSelect,
  onConversationDelete,
  onConversationStar
}) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSettings, setShowSettings] = useState(false);
  const searchRef = useRef(null);
  const sidebarRef = useRef(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e) {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      // Cmd/Ctrl + B to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        onToggle();
      }
      // Escape to collapse sidebar on mobile
      if (e.key === 'Escape' && window.innerWidth <= 768) {
        onToggle(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    function handleClickOutside(e) {
      if (window.innerWidth <= 768 && 
          sidebarRef.current && 
          !sidebarRef.current.contains(e.target)) {
        onToggle(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onToggle]);

  // Filter conversations based on search and category
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
                          (selectedCategory === 'Favorites' && conv.starred) ||
                          conv.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  function handleConversationClick(conv) {
    setSelectedConversation(conv.id);
    onConversationSelect?.(conv);
    if (window.innerWidth <= 768) {
      onToggle(false);
    }
  }

  function handleConversationStar(e, conv) {
    e.stopPropagation();
    onConversationStar?.(conv);
  }

  function handleConversationDelete(e, conv) {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      onConversationDelete?.(conv);
    }
  }

  return (
    <aside 
      ref={sidebarRef}
      className={`${styles.Sidebar} ${isCollapsed ? styles.Collapsed : ''}`}
      aria-expanded={!isCollapsed}
    >
      <div className={styles.Header}>
        <RobotIcon className={styles.Logo} />
        {!isCollapsed && <h1 className={styles.Title}>AI Chatbot</h1>}
        <button 
          className={styles.ToggleButton}
          onClick={() => onToggle()}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronIcon className={styles.ToggleIcon} />
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className={styles.Search}>
            <SearchIcon className={styles.SearchIcon} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search conversations... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.SearchInput}
            />
          </div>

          <div className={styles.Categories}>
            {CATEGORIES.map(category => (
              <button
                key={category}
                className={`${styles.CategoryButton} ${selectedCategory === category ? styles.Active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <FolderIcon className={styles.CategoryIcon} />
                {category}
                <span className={styles.CategoryCount}>
                  {filteredConversations.filter(conv => 
                    category === 'All' || 
                    (category === 'Favorites' && conv.starred) ||
                    conv.category === category
                  ).length}
                </span>
              </button>
            ))}
          </div>

          <div className={styles.Content}>
            <div className={styles.Section}>
              <div className={styles.SectionHeader}>
                <h2 className={styles.SectionTitle}>Conversations</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  aria-label="Toggle settings"
                >
                  <SettingsIcon className={styles.SectionIcon} />
                </Button>
              </div>

              {showSettings && (
                <div className={styles.Settings}>
                  <div className={styles.SettingGroup}>
                    <label htmlFor="provider">AI Provider</label>
                    <select
                      id="provider"
                      value={currentProvider}
                      onChange={(e) => onProviderChange(e.target.value)}
                      className={styles.Select}
                    >
                      <option value="openai">OpenAI</option>
                      <option value="googleai">Google AI</option>
                    </select>
                  </div>

                  <div className={styles.SettingGroup}>
                    <label htmlFor="theme">Theme</label>
                    <select
                      id="theme"
                      value={theme}
                      onChange={(e) => onThemeChange(e.target.value)}
                      className={styles.Select}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div className={styles.SettingGroup}>
                    <label htmlFor="language">Language</label>
                    <select
                      id="language"
                      value={language}
                      onChange={(e) => onLanguageChange(e.target.value)}
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
                </div>
              )}

              {filteredConversations.length > 0 ? (
                <ul className={styles.ConversationList}>
                  {filteredConversations.map((conv) => (
                    <li 
                      key={conv.id}
                      className={`${styles.ConversationItem} ${selectedConversation === conv.id ? styles.Selected : ''}`}
                      onClick={() => handleConversationClick(conv)}
                    >
                      <div className={styles.ConversationContent}>
                        <span className={styles.ConversationTitle}>{conv.title}</span>
                        <span className={styles.ConversationDate}>{conv.date}</span>
                      </div>
                      <div className={styles.ConversationActions}>
                        <button
                          className={`${styles.ActionButton} ${conv.starred ? styles.Starred : ''}`}
                          onClick={(e) => handleConversationStar(e, conv)}
                          aria-label={conv.starred ? "Unstar conversation" : "Star conversation"}
                        >
                          <StarIcon className={styles.ActionIcon} />
                        </button>
                        <button
                          className={styles.ActionButton}
                          onClick={(e) => handleConversationDelete(e, conv)}
                          aria-label="Delete conversation"
                        >
                          <DeleteIcon className={styles.ActionIcon} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={styles.EmptyState}>
                  <RobotIcon className={styles.EmptyIcon} />
                  <p>No conversations found</p>
                  {searchQuery && (
                    <button 
                      className={styles.ClearSearch}
                      onClick={() => setSearchQuery('')}
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </aside>
  );
}