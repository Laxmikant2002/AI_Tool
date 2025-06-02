import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { 
  SendIcon, 
  FileIcon, 
  MicIcon, 
  EmojiIcon, 
  SuggestIcon,
  LoadingIcon 
} from '../../common/Icons';
import { Button } from '../../common/Button/Button';
import { useInView } from '@/hooks/useInView';
import { analytics } from '@/services/analytics';
import styles from './Controls.module.css';
import { ControlsProps } from '@/types';

const MAX_LENGTH = 2000;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'image/*',
  'audio/*',
  'video/*',
  '.pdf',
  '.doc',
  '.docx',
  '.txt'
] as const;

const SMART_SUGGESTIONS = [
  'Tell me more about that',
  'Can you explain why?',
  'What are the next steps?',
  'How does this work?',
  'Can you give an example?',
  'What are the alternatives?',
  'What are the pros and cons?',
  'What are the best practices?'
];

export function Controls({ 
  isDisabled = false, 
  onSend, 
  onFileUpload,
  quickReplies = [],
  onQuickReplySelect,
  isTyping = false,
  onTypingChange,
  className
}: ControlsProps) {
  // State
  const [content, setContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(SMART_SUGGESTIONS);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const isInView = useInView(controlsRef);

  // Memoized values
  const filteredSuggestions = useMemo(() => {
    if (!content) return SMART_SUGGESTIONS;
    return SMART_SUGGESTIONS.filter(s => 
      s.toLowerCase().includes(content.toLowerCase())
    );
  }, [content]);

  const charCountClass = useMemo(() => {
    if (charCount > MAX_LENGTH * 0.9) return styles.Error;
    if (charCount > MAX_LENGTH * 0.8) return styles.Warning;
    return '';
  }, [charCount]);

  // Effects
  useEffect(() => {
    function handleGlobalClick(e: MouseEvent) {
      if (controlsRef.current && !controlsRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
        setShowSuggestions(false);
      }
    }

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else if (mediaRecorder.current?.state === 'recording') {
      stopRecording();
    }

    return () => {
      if (mediaRecorder.current?.state === 'recording') {
        mediaRecorder.current.stop();
      }
    };
  }, [isRecording]);

  // Handlers
  const handleSubmit = useCallback(async (event?: React.FormEvent) => {
    event?.preventDefault();
    
    if (!content.trim() || isDisabled) return;

    try {
      analytics.track('message_sent', { length: content.length });
      await onSend(content.trim());
      setContent('');
      setShowSuggestions(false);
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [content, isDisabled, onSend]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    // Enter to send (without shift)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
    // Slash for suggestions
    else if (event.key === '/' && !content) {
      event.preventDefault();
      setShowSuggestions(true);
    }
    // Escape to close pickers
    else if (event.key === 'Escape') {
      setShowEmojiPicker(false);
      setShowSuggestions(false);
    }
  }, [content, handleSubmit]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value;
    
    if (newContent.length <= MAX_LENGTH) {
      setContent(newContent);
      setCharCount(newContent.length);

      // Handle typing indicator
      if (onTypingChange) {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        onTypingChange(true);
        
        typingTimeoutRef.current = setTimeout(() => {
          onTypingChange(false);
        }, 1000);
      }

      // Show suggestions when typing
      if (newContent.length > 0) {
        const filtered = SMART_SUGGESTIONS.filter(s => 
          s.toLowerCase().includes(newContent.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
      }
    }
  }, [onTypingChange]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onFileUpload) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 5MB limit');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress((e.loaded / e.total) * 100);
      }
    };

    reader.onload = async () => {
      try {
        await onFileUpload(file);
      } catch (error) {
        console.error('Failed to upload file:', error);
        alert('Failed to upload file');
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.readAsArrayBuffer(file);
  }, [onFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files[0];
    if (file && onFileUpload) {
      // Create a properly structured synthetic event
      const syntheticEvent = {
        target: {
          files: [file],
          value: '',
          name: fileInputRef.current?.name ?? '',
        },
        currentTarget: fileInputRef.current,
        preventDefault: () => {},
        stopPropagation: () => {},
        bubbles: true,
        cancelable: true,
        timeStamp: Date.now(),
        type: 'change',
        isTrusted: true,
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleFileSelect(syntheticEvent);
    }
  }, [handleFileSelect, onFileUpload]);

  const handleEmojiSelect = useCallback((emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  }, []);

  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setContent(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  }, []);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      recordedChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(recordedChunks.current, { type: 'audio/webm' });
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
        if (onFileUpload) onFileUpload(file);
      };

      mediaRecorder.current.start();

      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  }

  function stopRecording() {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setRecordingTime(0);
    }
  }

  return (
    <div 
      ref={controlsRef}
      className={`${styles.Controls} ${isDragging ? styles.Dragging : ''} ${className || ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {quickReplies.length > 0 && (
        <div 
          className={styles.QuickReplies}
          role="toolbar"
          aria-label="Quick reply options"
        >
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              variant="secondary"
              size="sm"
              onClick={() => onQuickReplySelect?.(reply)}
              disabled={isDisabled}
              className={styles.QuickReply}
            >
              {reply}
            </Button>
          ))}
        </div>
      )}

      <form 
        className={styles.Form} 
        onSubmit={handleSubmit}
        aria-label="Message input form"
      >
        <div className={styles.InputWrapper}>
          <TextareaAutosize
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Press / for suggestions)"
            disabled={isDisabled}
            className={styles.Input}
            minRows={1}
            maxRows={5}
            aria-label="Message input"
            aria-describedby="char-count"
          />
          
          <div className={styles.ActionButtons}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={isDisabled}
              aria-label="Open emoji picker"
              aria-expanded={showEmojiPicker}
              className={styles.ActionButton}
            >
              <EmojiIcon className={styles.ActionIcon} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isDisabled || isUploading}
              aria-label="Attach file"
              className={styles.ActionButton}
            >
              {isUploading ? (
                <div className={styles.UploadProgress}>
                  <LoadingIcon className={styles.LoadingIcon} />
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
              ) : (
                <FileIcon className={styles.ActionIcon} />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRecording(!isRecording)}
              disabled={isDisabled}
              aria-label={isRecording ? 'Stop recording' : 'Start voice recording'}
              className={`${styles.ActionButton} ${isRecording ? styles.Recording : ''}`}
            >
              <MicIcon className={styles.ActionIcon} />
              {isRecording && (
                <span className={styles.RecordingTime}>
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </span>
              )}
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="icon"
              disabled={!content.trim() || isDisabled}
              aria-label="Send message"
              className={`${styles.ActionButton} ${styles.SendButton}`}
            >
              <SendIcon className={styles.ActionIcon} />
            </Button>
          </div>

          <span 
            id="char-count"
            className={`${styles.CharCount} ${charCountClass}`}
            aria-live="polite"
          >
            {charCount}/{MAX_LENGTH}
          </span>
        </div>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        accept={ALLOWED_FILE_TYPES.join(',')}
        aria-hidden="true"
      />

      {isDragging && (
        <div 
          className={styles.DropOverlay}
          role="presentation"
        >
          <FileIcon className={styles.DropIcon} />
          <span>Drop file here</span>
        </div>
      )}

      {showEmojiPicker && (
        <div 
          className={styles.EmojiPicker}
          role="dialog"
          aria-label="Emoji picker"
        >
          <div 
            className={styles.EmojiGrid}
            role="grid"
          >
            {'😀 😊 😎 🤔 😂 👍 ❤️ 🎉 👋 🔥 ✨ 💡 📎 🗂️ 📅'.split(' ').map((emoji, i) => (
              <button
                key={i}
                className={styles.EmojiButton}
                onClick={() => handleEmojiSelect(emoji)}
                aria-label={`Insert ${emoji} emoji`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div 
          className={styles.Suggestions}
          role="listbox"
          aria-label="Message suggestions"
        >
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className={styles.SuggestionButton}
              onClick={() => handleSuggestionSelect(suggestion)}
              role="option"
            >
              <SuggestIcon className={styles.SuggestionIcon} />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}