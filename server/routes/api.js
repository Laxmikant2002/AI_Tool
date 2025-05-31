import express from 'express';
import { chatController } from '../controllers/chatController.js';
import { healthController } from '../controllers/healthController.js';

const router = express.Router();

router.post('/chat/openai', chatController.openAIChat);
router.post('/chat/googleai', chatController.googleAIChat);
router.get('/health', healthController.check);

export default router; 