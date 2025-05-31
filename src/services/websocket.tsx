class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
    this.listeners = new Map();
    this.isConnecting = false;
  }

  connect() {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      console.log('Attempting WebSocket connection...');
      this.ws = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:3000');
      
      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.emit('connection', { status: 'connected' });
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.isConnecting = false;
        this.emit('connection', { status: 'disconnected' });
        this.reconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        this.emit('error', { 
          message: error.message || 'WebSocket connection failed',
          details: error
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit(data.type, data.payload);
        } catch (error) {
          console.error('Invalid message format:', error);
          this.emit('error', { message: 'Invalid message format' });
        }
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.isConnecting = false;
      this.emit('error', { message: error.message });
      this.reconnect();
    }
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.emit('error', { message: 'Max reconnection attempts reached' });
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimeout = setTimeout(() => {
      this.emit('reconnecting', { 
        attempt: this.reconnectAttempts, 
        nextAttemptIn: delay,
        maxAttempts: this.maxReconnectAttempts
      });
      this.connect();
    }, delay);
  }

  send(type, payload = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected, cannot send message');
      this.emit('error', { message: 'WebSocket is not connected' });
      return;
    }

    try {
      this.ws.send(JSON.stringify({ type, payload }));
    } catch (error) {
      console.error('Failed to send message:', error);
      this.emit('error', { message: error.message });
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.listeners.clear();
    this.isConnecting = false;
  }
}

export const wsService = new WebSocketService(); 