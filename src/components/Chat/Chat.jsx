import { useRef, useEffect, useMemo } from "react";
import Markdown from "react-markdown";
import styles from "./Chat.module.css";

const WELCOME_MESSAGE_GROUP = [
  {
    role: "assistant",
    content: "👋 Hello! I'm your AI assistant. How can I help you today?",
  },
];

export function Chat({ messages }) {
  const messagesEndRef = useRef(null);
  const messagesGroups = useMemo(
    () =>
      messages.reduce((groups, message) => {
        if (message.role === "user") groups.push([]);
        groups[groups.length - 1].push(message);
        return groups;
      }, []),
    [messages]
  );
  useEffect(() => {
    // Always scroll to the bottom when messages change
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "end" 
      });
    };
    
    scrollToBottom();
    // Additional timeout to ensure scroll works after content renders
    const timeoutId = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  return (
    <div className={styles.Chat}>
      {[WELCOME_MESSAGE_GROUP, ...messagesGroups].map(
        (messages, groupIndex) => (
          // Group
          <div key={groupIndex} className={styles.Group}>
            {messages.map(({ role, content }, index) => (
              // Message
              <div 
                key={index} 
                className={`${styles.Message} ${!content && role === "assistant" ? styles.Typing : ""}`} 
                data-role={role}
              >
                <Markdown>{content || (role === "assistant" ? "..." : "")}</Markdown>
              </div>
            ))}
          </div>
        )
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}