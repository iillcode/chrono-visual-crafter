import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Paddle: any;
  }
}

interface PaddleContextType {
  isLoaded: boolean;
  openCheckout: (priceId: string, customData?: any) => void;
  getSubscriptionStatus: () => Promise<any>;
}

const PaddleContext = createContext<PaddleContextType | undefined>(undefined);

export const usePaddle = () => {
  const context = useContext(PaddleContext);
  if (!context) {
    throw new Error('usePaddle must be used within a PaddleProvider');
  }
  return context;
};

interface PaddleProviderProps {
  children: React.ReactNode;
}

const PaddleProvider: React.FC<PaddleProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const loadPaddle = () => {
      if (window.Paddle) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      script.onload = () => {
        if (window.Paddle) {
          window.Paddle.Environment.set(
            import.meta.env.VITE_PADDLE_ENVIRONMENT || 'sandbox'
          );
          window.Paddle.Setup({
            token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
          });
          setIsLoaded(true);
        }
      };
      script.onerror = () => {
        console.error('Failed to load Paddle SDK');
        toast({
          title: "Payment System Error",
          description: "Failed to load payment system. Please refresh the page.",
          variant: "destructive"
        });
      };
      document.head.appendChild(script);
    };

    loadPaddle();
  }, [toast]);

  const openCheckout = (priceId: string, customData?: any) => {
    if (!isLoaded || !window.Paddle) {
      toast({
        title: "Payment System Not Ready",
        description: "Please wait for the payment system to load.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with payment.",
        variant: "destructive"
      });
      return;
    }

    window.Paddle.Checkout.open({
      items: [{ priceId }],
      customer: {
        email: user.primaryEmailAddress?.emailAddress,
        id: user.id,
      },
      customData: {
        userId: user.id,
        ...customData
      },
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        locale: 'en',
      }
    });
  };

  const getSubscriptionStatus = async () => {
    if (!user) return null;

    try {
      // This would typically call your backend API to get subscription status
      // For now, we'll return a mock response
      return {
        status: 'active',
        plan: 'free',
        nextBillingDate: null
      };
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      return null;
    }
  };

  const value = {
    isLoaded,
    openCheckout,
    getSubscriptionStatus
  };

  return (
    <PaddleContext.Provider value={value}>
      {children}
    </PaddleContext.Provider>
  );
};

export default PaddleProvider;