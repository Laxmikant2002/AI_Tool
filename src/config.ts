export const config = {
  gemini: {
    apiUrl: import.meta.env.VITE_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  },
  deepseek: {
    apiUrl: import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.openrouter.ai/api/v1/chat/completions',
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
  }
};

export const toolTypes = {
  conversational: {
    name: 'Conversational',
    description: 'Natural language chat and Q&A',
    examples: [
      "What's the weather like today?",
      "Tell me a joke",
      "How do I make pasta from scratch?"
    ]
  },
  creative: {
    name: 'Creative',
    description: 'Writing, storytelling, and content generation',
    examples: [
      "Write a story about a time traveler",
      "Create a poem about autumn",
      "Generate a creative recipe for a unique sandwich"
    ]
  },
  analytical: {
    name: 'Analytical',
    description: 'Analysis, summaries, and explanations',
    examples: [
      "Analyze this text: [paste text]",
      "Explain quantum computing simply",
      "Summarize the key points of machine learning"
    ]
  },
  specialized: {
    name: 'Specialized',
    description: 'Domain-specific knowledge and tasks',
    examples: [
      "Explain photosynthesis for a 5th grader",
      "List common symptoms of flu",
      "Write Python code for a calculator"
    ]
  }
}; 