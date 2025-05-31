import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Define the WebKit Speech Recognition interface
interface WebKitSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
}

declare global {
  // Declare global variables
  var webkitSpeechRecognition: new () => WebKitSpeechRecognition;
  
  // Override built-in types with our mock implementations
  var ResizeObserver: {
    new(callback: ResizeObserverCallback): ResizeObserver;
    prototype: ResizeObserver;
  };
  
  var IntersectionObserver: {
    new(callback: IntersectionObserverCallback, options?: IntersectionObserverInit): IntersectionObserver;
    prototype: IntersectionObserver;
  };

  var WebSocket: {
    new(url: string | URL, protocols?: string | string[]): WebSocket;
    prototype: WebSocket;
    readonly CONNECTING: 0;
    readonly OPEN: 1;
    readonly CLOSING: 2;
    readonly CLOSED: 3;
  };

  interface Window {
    webkitSpeechRecognition: new () => WebKitSpeechRecognition;
  }
}

// Define DOMRect for mocking getBoundingClientRect
interface MockDOMRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
  x?: number;
  y?: number;
}

// Types for our mocks
type BinaryType = 'blob' | 'arraybuffer';

// Mock WebSocket
class MockWebSocket implements WebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;

  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;

  binaryType: BinaryType = 'blob';
  bufferedAmount = 0;
  extensions = '';
  protocol = '';
  readyState = MockWebSocket.CONNECTING;
  url = '';

  onclose: ((this: WebSocket, ev: CloseEvent) => any) | null = null;
  onerror: ((this: WebSocket, ev: Event) => any) | null = null;
  onmessage: ((this: WebSocket, ev: MessageEvent) => any) | null = null;
  onopen: ((this: WebSocket, ev: Event) => any) | null = null;

  constructor(_url: string | URL, _protocols?: string | string[]) {
    this.url = typeof _url === 'string' ? _url : _url.toString();
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen?.call(this, new Event('open'));
    }, 0);
  }

  close(_code?: number, _reason?: string): void {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.call(this, new CloseEvent('close'));
  }

  send(_data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    // Mock implementation - do nothing
  }

  addEventListener(_type: string, _listener: EventListenerOrEventListenerObject): void {
    // Mock implementation - do nothing
  }

  removeEventListener(_type: string, _listener: EventListenerOrEventListenerObject): void {
    // Mock implementation - do nothing
  }

  dispatchEvent(_event: Event): boolean { 
    return true;
  }
}

// Mock SpeechRecognition
class MockSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;

  constructor() {
    this.continuous = false;
    this.interimResults = false;
  }

  start(): void {
    // Mock implementation - do nothing
  }

  stop(): void {
    // Mock implementation - do nothing
  }
}

// Mock ResizeObserver
class MockResizeObserver implements ResizeObserver {
  observe(_target: Element, _options?: ResizeObserverOptions): void {
    // Mock implementation - do nothing
  }

  unobserve(_target: Element): void {
    // Mock implementation - do nothing
  }

  disconnect(): void {
    // Mock implementation - do nothing
  }
}

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: ReadonlyArray<number> = [0];

  #callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.#callback = callback;
  }

  observe(_target: Element): void {
    // Call callback with empty entries array and this observer
    this.#callback([], this);
  }

  unobserve(_target: Element): void {
    // Mock implementation - do nothing
  }

  disconnect(): void {
    // Mock implementation - do nothing
  }

  takeRecords(): IntersectionObserverEntry[] { 
    return [];
  }
}

// Set up mock implementations
const mockWebSocket = MockWebSocket as unknown as typeof WebSocket;
const mockSpeechRecognition = MockSpeechRecognition as unknown as typeof webkitSpeechRecognition;
const mockResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
const mockIntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Apply mocks to global object
global.WebSocket = mockWebSocket;
global.webkitSpeechRecognition = mockSpeechRecognition;
global.ResizeObserver = mockResizeObserver;
global.IntersectionObserver = mockIntersectionObserver;

// Mock scrolling behavior
const mockScrollTo = jest.fn();
const mockGetBoundingClientRect = jest.fn(() => ({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  toJSON: () => ({})
}));

// Apply mocks to window and Element prototype
Object.defineProperty(window, 'scrollTo', { value: mockScrollTo, writable: true });
Object.defineProperty(Element.prototype, 'getBoundingClientRect', { value: mockGetBoundingClientRect, writable: true });
Object.defineProperty(Element.prototype, 'scrollTo', { value: mockScrollTo, writable: true });

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  setTimeout(() => callback(Date.now()), 0);
  return 0; // Return a dummy animation frame ID
};

// Mock element.scrollTo
Element.prototype.scrollTo = jest.fn();

// Mock window.scrollY
Object.defineProperty(window, 'scrollY', {
  writable: true,
  value: 0,
});