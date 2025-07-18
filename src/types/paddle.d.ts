// Type definitions for Paddle SDK extensions

interface PaddleEventData {
  name: string;
  error?: {
    message?: string;
  };
  [key: string]: unknown;
}

interface PaddleSubscriptionOptions {
  subscriptionId: string;
  effectiveFrom?: string;
  eventCallback?: (data: PaddleEventData) => void;
}

interface PaddleCheckoutOptions {
  [key: string]: unknown;
}

interface PaddleUpdateOptions {
  [key: string]: unknown;
}

declare global {
  interface Window {
    Paddle?: {
      Environment?: {
        get?: () => string;
      };
      Subscription?: {
        cancel?: (options: PaddleSubscriptionOptions) => void;
        cancelPreview?: (options: PaddleSubscriptionOptions) => void;
        update?: (options: PaddleUpdateOptions) => void;
      };
      Checkout?: {
        open?: (options: PaddleCheckoutOptions) => void;
      };
    };
  }
}

// Extend the Paddle type from @paddle/paddle-js
declare module "@paddle/paddle-js" {
  interface Paddle {
    Subscription?: {
      cancel?: (options: PaddleSubscriptionOptions) => void;
      cancelPreview?: (options: PaddleSubscriptionOptions) => void;
      update?: (options: PaddleUpdateOptions) => void;
    };
    Checkout?: {
      open?: (options: PaddleCheckoutOptions) => void;
    };
    Environment?: {
      get?: () => string;
    };
  }
}

export {};
