import React from 'react';

interface ExamplePrompt {
  category: string;
  icon: string;
  examples: string[];
  description: string;
  gradient: string;
}

const examplePrompts: ExamplePrompt[] = [
  {
    category: "Conversational",
    icon: "💬",
    description: "Natural dialogue and interactive responses",
    gradient: "from-cyan-500 to-blue-500",
    examples: [
      "What's the weather like today?",
      "Tell me a fun fact about space",
      "How do I make pasta from scratch?",
      "What are some good productivity tips?"
    ]
  },
  {
    category: "Creative",
    icon: "✨",
    description: "Content generation and creative tasks",
    gradient: "from-purple-500 to-pink-500",
    examples: [
      "Write a story about a friendly robot",
      "Create a poem about autumn",
      "Design a unique superhero concept",
      "Generate ideas for a sci-fi novel"
    ]
  },
  {
    category: "Analytical",
    icon: "📊",
    description: "Data analysis and problem-solving",
    gradient: "from-green-500 to-teal-500",
    examples: [
      "Explain quantum computing in simple terms",
      "Analyze the pros and cons of remote work",
      "Help me understand machine learning basics",
      "Compare different investment strategies"
    ]
  }
];

interface WelcomeProps {
  onExampleClick: (prompt: string) => void;
}

export function Welcome({ onExampleClick }: WelcomeProps) {
  return (
    <div className="welcome">
      <div className="welcome-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="welcome-header">
            <div className="avatar-container">
              <div className="avatar-glow"></div>
              <div className="avatar-icon">
                <span role="img" aria-label="AI Assistant">🤖</span>
              </div>
            </div>
            <h1>Welcome to AI Assistant</h1>
            <p className="subtitle">Your intelligent companion for conversation, creation, and analysis</p>
          </div>

          <div className="quick-start">
            <div className="instruction-section">
              <h2>Getting Started</h2>
              <p className="instruction">Choose a model and start exploring the possibilities with AI</p>
              <div className="quick-actions">
                <button className="action-button primary">
                  <span className="icon">🚀</span>
                  Start New Chat
                </button>
                <button className="action-button secondary">
                  <span className="icon">📚</span>
                  View Tutorial
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-header">
            <h2>Key Features</h2>
            <p className="section-description">Discover what our AI Assistant can do for you</p>
          </div>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🎯</span>
              </div>
              <h4>Smart Responses</h4>
              <p>Get accurate and contextual responses powered by advanced AI models</p>
            </div>
            <div className="feature">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">⚡</span>
              </div>
              <h4>Fast & Efficient</h4>
              <p>Experience quick response times and seamless interactions</p>
            </div>
            <div className="feature">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🔒</span>
              </div>
              <h4>Secure & Private</h4>
              <p>Your conversations are protected and private</p>
            </div>
            <div className="feature">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🎨</span>
              </div>
              <h4>Creative Tools</h4>
              <p>Access a wide range of creative and analytical capabilities</p>
            </div>
          </div>
        </section>

        {/* Examples Section */}
        <section className="examples-section">
          <div className="section-header">
            <h2>Try These Examples</h2>
            <p className="section-description">Explore some popular ways to interact with our AI</p>
          </div>
          <div className="examples-grid">
            {examplePrompts.map((category) => (
              <div key={category.category} className={`example-card bg-gradient-to-br ${category.gradient}`}>
                <div className="card-header">
                  <span className="category-icon" role="img" aria-label={category.category}>
                    {category.icon}
                  </span>
                  <h3>{category.category}</h3>
                </div>
                <p className="category-description">{category.description}</p>
                <div className="example-list">
                  {category.examples.map((example) => (
                    <button 
                      key={example}
                      onClick={() => onExampleClick(example)}
                      className="example-button"
                    >
                      <span className="example-text">{example}</span>
                      <span className="arrow-icon">→</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}