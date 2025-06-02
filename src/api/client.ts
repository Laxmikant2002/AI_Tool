import { Message } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface APIResponse {
  error?: string;
  details?: string;
  data?: any;
}

async function handleResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    const error = await response.json() as APIResponse;
    throw new Error(error.error || error.details || 'An error occurred');
  }
  return response;
}

export async function chatWithOpenAI(content: string, history: Message[]): Promise<ReadableStream<Uint8Array> | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/openai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        content: content?.trim(), 
        history: Array.isArray(history) ? history : [] 
      }),
    });

    return (await handleResponse(response)).body;
  } catch (error) {
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }
    throw error;
  }
}

export interface GoogleAIResponse {
  content: string;
  error?: string;
}

export async function chatWithGoogleAI(content: string): Promise<GoogleAIResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/googleai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: content?.trim() }),
    });

    return handleResponse(response).then(res => res.json());
  } catch (error) {
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }
    throw error;
  }
}
