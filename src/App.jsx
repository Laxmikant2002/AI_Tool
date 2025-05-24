import React from 'react';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.App}>
    <header className={styles.Header}>
    <img className={styles.Logo} src="/chat-bot.png" alt="Chat Bot Logo" />
    <h2 className={styles.Title}>AI ChatBot</h2>
    </header>
    <div className={styles.Container}></div>
  </div>
  );
}

export default App
