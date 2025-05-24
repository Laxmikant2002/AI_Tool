import React from 'react';
import { Chat } from './components/Chat/Chat.jsx';
import styles from './App.module.css';
import { Controls } from './components/Controls/Controls.jsx';
import {GoogleGenerativeAI} from '@google/generative-ai';

const googleai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
const gemini = googleai.getGemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
const chat = gemini.startChat({history: []});

function App() {
  const [messages, setMessages] = React.useState([]);

  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <img className={styles.Logo} src="/chat-bot.png" alt="Chat Bot Logo" />
        <h2 className={styles.Title}>AI ChatBot</h2>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>
      <Controls onSend={(content) => {
        setMessages([...messages, { role: 'user', content }]);
      }} />
  </div>
  );
}

const MESSAGES = [
{
    role: 'user',
    constext: 'Hello, how can I help you today?',
},
{
    role: 'assistant',
    content: 'I am looking for information on your services.',
},
{
    role: 'user',
    content: 'Can you tell me more about your pricing?',
},
{
    role: 'assistant',
    content: 'Sure! Our basic plan starts at $10 per month.',
},
{
    role: 'user',
    content: 'That sounds good. How do I sign up?',
},
{
    role: 'assistant',
    content: 'You can sign up on our website by clicking the "Sign Up" button.',
}
]

export default App
