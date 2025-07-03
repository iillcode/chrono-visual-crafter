import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
  const navigate = useNavigate();

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
      },
      customData: {
        userId: user.id,
        ...customData
      },
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        locale: 'en',
        successUrl: `${window.location.origin}/studio?payment=success`,
      },
      eventCallback: (data: any) => {
        console.log('Paddle event:', data);
        
        if (data.name === 'checkout.completed') {
          toast({
            title: "Payment Successful!",
            description: "Your subscription has been activated. Redirecting to studio...",
          });
          
          // Wait a moment for webhook processing, then navigate
          setTimeout(() => {
            navigate('/studio?payment=success');
          }, 2000);
        }
        
        if (data.name === 'checkout.closed') {
          console.log('Checkout was closed');
        }
        
        if (data.name === 'checkout.error') {
          toast({
            title: "Payment Error",
            description: "There was an issue processing your payment. Please try again.",
            variant: "destructive"
          });
        }
      }
    });
  };

  const getSubscriptionStatus = async () => {
    if (!user) return null;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_plan, paddle_customer_id')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return {
        status: profile.subscription_status || 'free',
        plan: profile.subscription_plan || 'free',
        customerId: profile.paddle_customer_id
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