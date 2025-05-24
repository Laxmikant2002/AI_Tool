# AI Chatbot

A modern React-based AI chatbot application that leverages OpenAI and Google AI for intelligent conversations.

![AI Chatbot Screenshot](./public/chat-bot.png)

## Features

- 🤖 Dual AI provider support (OpenAI & Google AI)
- 🔄 Automatic fallback when one provider is unavailable
- 💬 Real-time streaming responses
- ✨ Markdown support in messages
- 📱 Responsive design for all devices
- 🌙 Clean, modern UI

## Technologies Used

- React with Hooks
- Vite for fast development
- OpenAI API integration
- Google AI API integration
- CSS Modules for styling
- React Markdown for message formatting

## Getting Started

### Prerequisites

- Node.js v14+ and npm
- OpenAI API Key
- Google AI API Key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Laxmikant2002/AI-ChatBot.git
cd AI-ChatBot
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env.local file in the root directory and add your API keys:
```
VITE_OPEN_AI_API_KEY=your_openai_key_here
VITE_GOOGLE_AI_API_KEY=your_google_ai_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

This application can be deployed to Vercel:

1. Push your code to GitHub
2. Create a new project on Vercel and import your GitHub repository
3. Add the environment variables in Vercel project settings
4. Deploy!

## How It Works

- The application starts by using OpenAI for chat responses
- If OpenAI is unavailable (due to rate limiting or quota issues), it automatically switches to Google AI
- All messages are rendered with Markdown support
- The UI provides visual feedback during loading and streaming states

## Project Structure

```
/
├── public/             # Public static files
├── src/
│   ├── assistants/     # AI provider implementations
│   │   ├── index.js    # Main AIProvider class
│   │   ├── openai.js   # OpenAI implementation
│   │   └── googleai.js # Google AI implementation
│   ├── components/
│   │   ├── Chat/       # Chat UI component
│   │   ├── Controls/   # Input controls component
│   │   └── Loader/     # Loading indicator component
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── .env.local          # Local environment variables (not committed)
└── README.md           # Project documentation
```

## License

MIT

## Author

Laxmikant Shinde  
GitHub: [@Laxmikant2002](https://github.com/Laxmikant2002)

---

Feel free to contribute to this project by submitting issues or pull requests!