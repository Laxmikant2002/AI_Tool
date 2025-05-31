const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.details || 'An error occurred');
  }
  return response;
}

export async function chatWithOpenAI(content, history) {
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

    return handleResponse(response).then(res => res.body);
  } catch (error) {
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }
    throw error;
  }
}

export async function chatWithGoogleAI(content) {
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

// Health check function
export async function checkServerHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
} 