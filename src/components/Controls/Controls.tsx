import React, { useState } from 'react';

interface ControlsProps {
  onSend: (content: string) => void;
}

export function Controls({ onSend }: ControlsProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <form className="controls" onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="input"
      />
      <button 
        type="submit" 
        disabled={!message.trim()}
        className="send-button"
      >
        Send
      </button>
    </form>
  );
} 