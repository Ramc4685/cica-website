// Import Jest DOM assertions - already includes all matchers
import '@testing-library/jest-dom';

// Configure global fetch mock
global.fetch = jest.fn();

// Mock sonner toast library
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));
