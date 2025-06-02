import React from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ChatProps {
  messages: Message[];
}

export function Chat({ messages }: ChatProps) {
  return (
    <div className="chat">
      {messages.map((message, index) => (
        <div 
          key={index}
          className={`message ${message.role}`}
        >
          <div className="content">{message.content}</div>
          {message.timestamp && (
            <div className="timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 