import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/ai.config.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const googleai = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const gemini = googleai.getGenerativeModel({ model: config.googleai.model });

export const chatController = {
  async openAIChat(req, res) {
    try {
      const { content, history } = req.body;
      
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'Message content is required' });
      }

      const stream = await openai.chat.completions.create({
        model: config.openai.model,
        messages: [...(history || []), { content: content.trim(), role: 'user' }],
        stream: true,
      });

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.end();
    } catch (error) {
      console.error('OpenAI Error:', error);
      const statusCode = error.status || 500;
      const message = error.status === 429 ? 
        'Too many requests, please try again later' : 
        'Failed to process OpenAI request';
      
      res.status(statusCode).json({ 
        error: message,
        details: error.message 
      });
    }
  },

  async googleAIChat(req, res) {
    try {
      const { content } = req.body;
      
      if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'Message content is required' });
      }

      const chat = gemini.startChat();
      const result = await chat.sendMessage(content.trim());
      const response = await result.response;
      
      res.json({ content: response.text() });
    } catch (error) {
      console.error('Google AI Error:', error);
      const statusCode = error.status || 500;
      res.status(statusCode).json({ 
        error: 'Failed to process Google AI request',
        details: error.message 
      });
    }
  }
}; 