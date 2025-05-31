import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import Markdown from "react-markdown";
import { wsService } from "../../../services/websocket";
import { Toast } from "../../common/Toast/Toast";
import { ScrollToBottom } from "../../common/ScrollToBottom/ScrollToBottom";
import { RobotIcon, FileIcon, LoadMoreIcon, MicIcon, DownloadIcon } from "../../common/Icons";
import styles from "./Chat.module.css";

const TYPING_INDICATORS = ['dots', 'ellipsis', 'text'];

const PAGE_SIZE = 20;

const WELCOME_MESSAGE = {
  role: "assistant",
  content: "👋 Hello! I'm your AI assistant. How can I help you today?",
  timestamp: new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
};

export function Chat({ messages = [], onFileUpload, language = 'en', onQuickReply }) {
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [typingIndicatorStyle, setTypingIndicatorStyle] = useState('dots');
  const [hasVoiceSupport] = useState(() => 'webkitSpeechRecognition' in window);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef(null);

  // Paginated messages
  const displayedMessages = useMemo(() => {
    const start = Math.max(0, messages.length - (page * PAGE_SIZE));
    return messages.slice(start);
  }, [messages, page]);

  // Message groups with improved grouping logic
  const messageGroups = useMemo(() => {
    if (!displayedMessages.length) return [];
    
    return displayedMessages.reduce((groups, message, index, array) => {
      const prevMessage = array[index - 1];
      const timeDiff = prevMessage 
        ? new Date(message.timestamp) - new Date(prevMessage.timestamp)
        : 0;
      
      // Start a new group if:
      // 1. First message
      // 2. Different role from previous
      // 3. More than 5 minutes between messages
      // 4. User message (always start new group)
      if (
        !groups.length ||
        message.role !== prevMessage?.role ||
        timeDiff > 5 * 60 * 1000 ||
        message.role === "user"
      ) {
        groups.push([message]);
      } else {
        groups[groups.length - 1].push(message);
      }
      
      return groups;
    }, []);
  }, [displayedMessages]);

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    if (!messagesEndRef.current) return;

    const scroll = () => {
      const endElement = messagesEndRef.current;
      if (!endElement) return;

      const { top } = endElement.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + top,
        behavior
      });
    };

    requestAnimationFrame(scroll);
  }, []);

  const handleScroll = useCallback(() => {
    if (!chatRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);

    // Load more when scrolling to top
    if (scrollTop === 0 && messages.length > displayedMessages.length) {
      handleLoadMore();
    }
  }, [messages.length, displayedMessages.length]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      setPage(prev => prev + 1);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setToast({
          message: 'File size exceeds 5MB limit',
          type: 'error'
        });
        return;
      }

      onFileUpload(file);
    }
  };

  // Voice input handling
  const startVoiceInput = () => {
    if (!hasVoiceSupport) return;

    const recognition = new webkitSpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      wsService.send('voice_input', { content: transcript });
    };

    recognition.onerror = (event) => {
      setToast({
        message: `Voice input error: ${event.error}`,
        type: 'error'
      });
    };

    recognition.start();
  };

  // Scroll handling
  useEffect(() => {
    const chatElement = chatRef.current;
    if (chatElement) {
      chatElement.addEventListener('scroll', handleScroll);
      return () => chatElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Typing indicator handling
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setTypingIndicatorStyle(prev => {
          const currentIndex = TYPING_INDICATORS.indexOf(prev);
          return TYPING_INDICATORS[(currentIndex + 1) % TYPING_INDICATORS.length];
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  // Voice recording handling
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setRecordingTime(0);
    }
  }, [isRecording]);

  function renderTypingIndicator() {
    return (
      <div className={styles.TypingIndicator}>
        <div className={styles.TypingDot} />
        <div className={styles.TypingDot} />
        <div className={styles.TypingDot} />
      </div>
    );
  }

  function renderFileAttachment(file) {
    const isImage = file.type?.startsWith('image/');
    const isAudio = file.type?.startsWith('audio/');
    const isVideo = file.type?.startsWith('video/');

    return (
      <div className={styles.FileAttachment}>
        <FileIcon className={styles.FileIcon} />
        <div className={styles.FileInfo}>
          <div className={styles.FileName}>{file.name}</div>
          <div className={styles.FileSize}>
            {file.size ? `${Math.round(file.size / 1024)} KB` : ''}
          </div>
        </div>
        {file.url && (isImage || isAudio || isVideo) && (
          <div className={styles.FilePreview}>
            {isImage && <img src={file.url} alt={file.name} />}
            {isAudio && <audio src={file.url} controls />}
            {isVideo && <video src={file.url} controls />}
          </div>
        )}
      </div>
    );
  }

  function exportConversation() {
    const conversationText = messages.map(msg => {
      const role = msg.role === 'assistant' ? 'AI' : 'You';
      return `${role} (${msg.timestamp}):\n${msg.content}\n`;
    }).join('\n');

    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div 
      ref={chatRef}
      className={styles.Chat}
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div className={styles.Header}>
        <button
          className={styles.ExportButton}
          onClick={exportConversation}
          aria-label="Export conversation"
        >
          <DownloadIcon className={styles.ActionIcon} />
          <span>Export Chat</span>
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {isLoadingMore && (
        <div className={styles.LoadingMore}>
          <LoadMoreIcon className={styles.LoadingIcon} />
          Loading previous messages...
        </div>
      )}

      {messages.length > displayedMessages.length && !isLoadingMore && (
        <button 
          className={styles.LoadMoreButton}
          onClick={handleLoadMore}
          aria-label="Load previous messages"
        >
          <LoadMoreIcon className={styles.LoadMoreIcon} />
          Load More
        </button>
      )}

      {messageGroups.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.Group}>
          {group.map((message, index) => (
            <div 
              key={index} 
              className={styles.Message} 
              data-role={message.role}
              aria-label={`${message.role} message`}
            >
              {message.role === 'assistant' && (
                <div className={styles.Avatar}>
                  <RobotIcon className={styles.AvatarIcon} />
                </div>
              )}
              
              <div className={styles.MessageContent}>
                {message.file && renderFileAttachment(message.file)}
                {message.content ? (
                  <Markdown>{message.content}</Markdown>
                ) : (
                  message.role === 'assistant' && renderTypingIndicator()
                )}
                {message.timestamp && (
                  <div className={styles.Timestamp}>
                    {message.timestamp}
                  </div>
                )}
              </div>

              {message.role === 'user' && (
                <div className={styles.MessageActions}>
                  <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
                  />
                  <label 
                    htmlFor="file-upload"
                    className={styles.ActionButton}
                    role="button"
                    aria-label="Attach file"
                  >
                    <FileIcon className={styles.ActionIcon} />
                  </label>
                  {hasVoiceSupport && (
                    <button
                      className={`${styles.ActionButton} ${isRecording ? styles.Recording : ''}`}
                      onClick={() => setIsRecording(!isRecording)}
                      aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
                    >
                      <MicIcon className={styles.ActionIcon} />
                      {isRecording && (
                        <span className={styles.RecordingTime}>
                          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div ref={messagesEndRef} />
      
      <ScrollToBottom 
        visible={showScrollButton} 
        onClick={() => scrollToBottom()}
      />
    </div>
  );
}