// Type definitions for Jest to resolve TypeScript errors

import '@testing-library/jest-dom';

// Extend the global namespace to include the jest-dom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveBeenCalledWith(expected: any): R;
      toHaveBeenCalledTimes(count: number): R;
    }
  }

  // Add fetch to the global namespace
  interface Window {
    fetch: jest.Mock;
  }

  // Add expect helper functions
  namespace jest {
    interface Expect {
      any(constructor: any): any;
      objectContaining(obj: any): any;
      stringContaining(str: string): any;
    }
  }
}
