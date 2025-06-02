import { useState } from 'react';
import { Chat } from './components/Chat/Chat';
import { Controls } from './components/Controls/Controls';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Welcome } from './components/Welcome/Welcome';
import { config, toolTypes } from './config';
import './index.css';

type Model = 'gemini' | 'deepseek';
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface APIError {
  status: number;
  message: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [model, setModel] = useState<Model>('gemini');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);
  const [activeCategory, setActiveCategory] = useState('conversational');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAPIError = (response: Response, model: string): never => {
    if (response.status === 429) {
      throw new Error(`Rate limit reached for ${model}. Attempting to switch models...`);
    } else if (response.status === 401) {
      throw new Error(`Invalid API key for ${model}. Please check your configuration.`);
    } else {
      throw new Error(`${model} API call failed: ${response.statusText}`);
    }
  };

  const addSystemMessage = (content: string) => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content,
      timestamp: new Date().toISOString()
    }]);
  };

  const callGeminiAPI = async (messages: Message[], systemPrompt?: string) => {
    const contents = systemPrompt 
      ? [{ role: 'system', parts: [{ text: systemPrompt }] }, ...messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        }))]
      : messages.map(msg => ({
          role: msg.role,
          parts: [{ text: msg.content }]
        }));

    const response = await fetch(config.gemini.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.gemini.apiKey}`,
      },
      body: JSON.stringify({ contents })
    });

    if (!response.ok) {
      handleAPIError(response, 'Gemini');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const callDeepSeekAPI = async (messages: Message[], systemPrompt?: string) => {
    const apiMessages = systemPrompt 
      ? [{ role: 'system', content: systemPrompt }, ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))]
      : messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

    const response = await fetch(config.deepseek.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.deepseek.apiKey}`,
        'HTTP-Referer': window.location.origin,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: apiMessages
      })
    });

    if (!response.ok) {
      handleAPIError(response, 'DeepSeek');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const tryAPI = async (
    apiCall: typeof callGeminiAPI | typeof callDeepSeekAPI,
    modelName: Model,
    messages: Message[],
    systemPrompt?: string
  ) => {
    try {
      const response = await apiCall(messages, systemPrompt);
      return response;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Rate limit')) {
        throw error;
      }
      throw new Error(`${modelName} API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSend = async (content: string) => {
    setError(null);
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const lowerContent = content.toLowerCase();
      let systemPrompt = '';
      
      if (lowerContent.startsWith('analyze') || lowerContent.startsWith('summarize')) {
        systemPrompt = 'You are an analytical assistant. Provide detailed analysis and clear explanations. Format your response in a structured way with sections and bullet points where appropriate.';
      } else if (lowerContent.startsWith('write') || lowerContent.startsWith('create') || lowerContent.includes('generate')) {
        systemPrompt = 'You are a creative assistant. Be imaginative and engaging in your responses. Focus on originality and storytelling.';
      } else if (lowerContent.includes('explain') && lowerContent.includes('for')) {
        systemPrompt = 'You are an educational assistant. Adapt your explanation to the specified audience level. Use simple analogies and clear examples.';
      } else if (lowerContent.includes('code') || lowerContent.includes('program')) {
        systemPrompt = 'You are a coding assistant. Provide well-commented, clean code with explanations. Include example usage where appropriate.';
      }

      let response: string;
      const allMessages = [...messages, userMessage];

      try {
        // Try primary model first
        response = await tryAPI(
          model === 'gemini' ? callGeminiAPI : callDeepSeekAPI,
          model,
          allMessages,
          systemPrompt
        );
      } catch (primaryError) {
        // If primary model fails, try failover
        const failoverModel = model === 'gemini' ? 'deepseek' : 'gemini';
        const failoverAPI = failoverModel === 'gemini' ? callGeminiAPI : callDeepSeekAPI;
        
        addSystemMessage(`${model} API encountered an error. Switching to ${failoverModel}...`);
        setModel(failoverModel);
        
        try {
          response = await tryAPI(failoverAPI, failoverModel, allMessages, systemPrompt);
        } catch (failoverError) {
          throw new Error('Both models failed. Please try again later.');
        }
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      setError({
        status: error instanceof Error && error.message.includes('Rate limit') ? 429 : 500,
        message: errorMessage
      });
      addSystemMessage(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (newModel: Model) => {
    setModel(newModel);
    setError(null);
  };

  const handleExampleClick = (prompt: string) => {
    handleSend(prompt);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="main-content">
        <Header 
          onModelChange={handleModelChange} 
          currentModel={model}
          onMenuClick={toggleSidebar}
        />
        <div className="main-container">
          {messages.length === 0 ? (
            <Welcome onExampleClick={handleExampleClick} />
          ) : (
            <>
              <Chat messages={messages} />
              {isLoading && <div className="loading">AI is typing...</div>}
              {error && (
                <div className={`error-message ${error.status === 429 ? 'rate-limit' : ''}`}>
                  {error.message}
                </div>
              )}
            </>
          )}
          <Controls onSend={handleSend} />
        </div>
      </main>
    </div>
  );
}

export default App;
