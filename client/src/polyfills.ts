import { Buffer } from 'buffer';

// Polyfill Buffer
window.Buffer = Buffer;

// Polyfill process
window.process = {
  env: {
    NODE_DEBUG: undefined
  }
} as any;
