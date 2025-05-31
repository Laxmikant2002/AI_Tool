# React AI Chatbot

A modern, accessible, and performant AI chatbot built with React and WebSocket.

## Features

- 🤖 Multiple AI Provider Support (OpenAI, Google AI)
- 🎨 Modern UI with Dark/Light Mode
- ♿ Accessibility Features
- 🌐 Internationalization Support
- 📱 Responsive Design
- 🔄 Real-time Updates via WebSocket
- 🎯 High Performance & Optimization
- 📊 Analytics Integration

## Tech Stack

- **Frontend**: React, Vite
- **Backend**: Express, WebSocket
- **AI Integration**: OpenAI API, Google AI API
- **Testing**: Jest, Testing Library
- **Documentation**: JSDoc
- **Code Quality**: ESLint, Prettier

## Project Structure

```
src/
├── api/              # API client and utilities
├── assistants/       # AI provider implementations
├── components/       # React components
│   ├── common/      # Reusable components
│   └── features/    # Feature-specific components
├── config/          # Configuration files
└── services/        # Core services (WebSocket, Analytics)

server/
├── controllers/     # Request handlers
├── middleware/      # Express middleware
└── routes/         # API routes
```

## Getting Started

1. **Installation**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Development**
   ```bash
   npm run dev        # Start frontend
   npm run server     # Start backend
   # or
   npm start         # Start both
   ```

4. **Testing**
   ```bash
   npm test          # Run tests
   npm run coverage  # Check coverage
   ```

## Code Style Guide

- Use functional components with hooks
- Follow React best practices
- Implement proper error handling
- Write comprehensive tests
- Document complex logic
- Use TypeScript/JSDoc for type safety

## Performance Optimization

- Code splitting and lazy loading
- Memoization of expensive computations
- Efficient re-rendering strategies
- Asset optimization
- Caching strategies

## Accessibility

- ARIA labels and roles
- Keyboard navigation
- High contrast mode
- Screen reader support
- Focus management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Contact

For questions or support, please open an issue.