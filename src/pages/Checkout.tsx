import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check } from "lucide-react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { supabase } from "@/integrations/supabase/client";
import { CheckoutPlanCard } from "@/components/ui/checkout-plan-card";

interface ProductInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  billingCycle: string;
}

const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const { toast } = useToast();
  const checkoutRef = useRef<HTMLDivElement>(null);
  const [isCheckoutLoaded, setIsCheckoutLoaded] = useState(false);
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const priceId = searchParams.get("priceId");
  const planName = searchParams.get("plan") || "Premium Plan";

  // Fetch product information from Supabase
  useEffect(() => {
    const fetchProductInfo = async () => {
      if (!priceId) return;

      try {
        const { data, error } = await supabase
          .from("subscription_plans")
          .select("*")
          .eq("paddle_price_id", priceId)
          .eq("is_active", true)
          .single();

        if (error) {
          console.error("Error fetching plan:", error);
          // Fallback to URL params if database query fails
          setProductInfo({
            id: priceId,
            name: planName,
            description: `${planName} unlocks unlimited projects, advanced features, and priority support.`,
            price: 20.0,
            currency: "USD",
            billingCycle: "monthly",
            features: [
              "Unlimited Projects",
              "All Transitions",
              "HD Video Export",
              "Priority Support",
              "Advanced Features",
              "Custom Workflows",
            ],
          });
        } else {
          const features = Array.isArray(data.features)
            ? data.features
            : JSON.parse((data.features as string) || "[]");

          setProductInfo({
            id: data.paddle_price_id || priceId,
            name: data.name,
            description: data.description || `${data.name} subscription plan`,
            price: data.price,
            currency: "USD",
            billingCycle: "monthly",
            features: features,
          });
        }
      } catch (error) {
        console.error("Error fetching product info:", error);
        toast({
          title: "Error loading product",
          description:
            "Failed to load product information. Using default values.",
          variant: "destructive",
        });

        // Fallback product info
        setProductInfo({
          id: priceId,
          name: planName,
          description: `${planName} unlocks unlimited projects, advanced features, and priority support.`,
          price: 20.0,
          currency: "USD",
          billingCycle: "monthly",
          features: [
            "Unlimited Projects",
            "All Transitions",
            "HD Video Export",
            "Priority Support",
            "Advanced Features",
            "Custom Workflows",
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProductInfo();
  }, [priceId, planName, toast]);

  // Initialize Paddle with default inline checkout settings
  useEffect(() => {
    const initPaddle = async () => {
      try {
        // Validate environment variables before initialization
        const environment = import.meta.env.VITE_PADDLE_ENVIRONMENT;
        const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;

        if (!token) {
          console.error("Paddle client token is missing");
          toast({
            title: "Configuration Error",
            description:
              "Payment system is not properly configured. Please contact support.",
            variant: "destructive",
          });
          return;
        }

        if (!environment || !["sandbox", "production"].includes(environment)) {
          console.error("Invalid Paddle environment:", environment);
          toast({
            title: "Configuration Error",
            description:
              "Payment system environment is not properly configured.",
            variant: "destructive",
          });
          return;
        }

        console.log("Initializing Paddle with environment:", environment);

        // Initialize Paddle with default inline checkout settings
        const paddleInstance = await initializePaddle({
          environment:
            (import.meta.env.VITE_PADDLE_ENVIRONMENT as
              | "sandbox"
              | "production") || "sandbox",
          token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN || "",
        });

        if (paddleInstance) {
          setPaddle(paddleInstance);
          setIsLoaded(true);
          console.log(
            "Paddle initialized successfully for checkout with inline settings"
          );
        } else {
          throw new Error("Failed to initialize Paddle instance");
        }
      } catch (error) {
        console.error("Failed to initialize Paddle SDK:", error);
        toast({
          title: "Payment System Error",
          description:
            "Failed to load payment system. Please refresh the page or contact support.",
          variant: "destructive",
        });
      }
    };

    initPaddle();
  }, [toast]);

  // Validate checkout parameters
  useEffect(() => {
    if (!priceId) {
      toast({
        title: "Invalid Checkout",
        description: "No price ID provided. Redirecting to pricing page.",
        variant: "destructive",
      });
      navigate("/pricing");
      return;
    }

    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with checkout.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
  }, [priceId, isSignedIn, navigate, toast]);

  // Initialize checkout when everything is ready
  useEffect(() => {
    if (!isLoaded || !paddle || !priceId || !user || !productInfo) {
      return;
    }

    // Additional security validations
    if (!user.primaryEmailAddress?.emailAddress) {
      toast({
        title: "Email Required",
        description: "A valid email address is required for checkout.",
        variant: "destructive",
      });
      return;
    }

    // Validate priceId format (basic validation)
    if (!priceId.match(/^(pri_|pro_)/)) {
      console.error("Invalid price ID format:", priceId);
      toast({
        title: "Invalid Product",
        description: "The selected product is not valid. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const performCheckoutInit = () => {
      console.log("Initializing inline checkout with:", {
        priceId,
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
      });

      try {
        // Get current domain for success URL
        const currentDomain = window.location.origin;
        const successUrl = `${currentDomain}/studio?payment=success`;

        const checkoutOptions = {
          items: [{ priceId }],
          customer: {
            email: user.primaryEmailAddress?.emailAddress,
          },
          settings: {
            displayMode: "inline" as const,
            theme: "light" as const,
            locale: "en",
            frameTarget: "checkout-container",
            frameInitialHeight: 450,
            frameStyle:
              "width: 100%; min-width: 312px; background-color: transparent; border: none;",
            successUrl: successUrl,
          },
          customData: {
            userId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            full_name: user.fullName || "Unknown User",
            timestamp: new Date().toISOString(),
            planName: productInfo.name,
          },
          eventCallback: (data: any) => {
            console.log("Paddle checkout event:", data.name, data);

            // Security: Validate event data
            if (!data || typeof data.name !== "string") {
              console.warn("Invalid event data received from Paddle");
              return;
            }

            switch (data.name) {
              case "checkout.loaded":
                setIsCheckoutLoaded(true);
                console.log("Checkout loaded successfully");
                break;

              case "checkout.completed":
                console.log("Payment completed successfully");
                toast({
                  title: "Payment Successful!",
                  description:
                    "Your subscription has been activated. Redirecting to studio...",
                });

                // Force navigation to studio with success parameter
                setTimeout(() => {
                  window.location.href = "/studio?payment=success";
                }, 1500);
                break;

              case "checkout.closed":
                console.log("Checkout was closed by user");
                break;

              case "checkout.error":
                console.error("Checkout error:", data);
                toast({
                  title: "Payment Error",
                  description:
                    data.error?.message ||
                    "There was an issue processing your payment. Please try again.",
                  variant: "destructive",
                });
                break;

              default:
                console.log("Unhandled checkout event:", data.name);
            }
          },
        };

        // Open checkout
        paddle.Checkout.open(checkoutOptions);
      } catch (error) {
        console.error("Error initializing checkout:", error);
        toast({
          title: "Checkout Error",
          description: "Failed to initialize checkout. Please try again.",
          variant: "destructive",
        });
      }
    };

    performCheckoutInit();
  }, [isLoaded, paddle, priceId, user, toast, navigate, productInfo]);

  if (!priceId || !isSignedIn) {
    return null;
  }

  if (loading || !productInfo) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Checkout Form (White Background, Scrollable) */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="max-w-lg mx-auto px-8 py-12 min-h-screen ">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Contact information
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          {/* Checkout Container */}
          <div className="bg-white rounded-lg">
            <div className="checkout-container" ref={checkoutRef}></div>
          </div>

          {/* Security Notice */}
          <div className="text-xs text-gray-500 text-center mt-6">
            🔒 Your payment information is secure and encrypted
          </div>

          {/* Additional Info */}
          <div className="text-sm text-gray-500 space-y-2 mt-8">
            <p>
              By subscribing, you authorize {productInfo.name} to charge you
              according to the terms until you cancel.
            </p>
            <p className="flex items-center gap-1">
              Powered by
              <span className="font-medium">Paddle</span> • Terms • Privacy
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Product Info (Dark Background with Blue Shade, Fixed) */}
      <div className="flex-1 relative overflow-hidden bg-black fixed right-0 top-0 h-screen">
        {/* Background effects from Pricing page */}
        <div className="absolute inset-0 z-0">
          <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0">
            <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-[#1FB4FF] to-sky-400"></div>
            <div className="h-[10rem] rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-[#1FB4FF]/10 to-sky-400"></div>
            <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-[#1FB4FF]/10 to-sky-400"></div>
          </div>
          <div className="absolute inset-0 z-0 bg-noise opacity-30"></div>

          {/* Additional gradients for more visual interest */}
          <div className="absolute bottom-0 left-0 h-[30rem] w-[30rem] rounded-full blur-[8rem] bg-gradient-to-tr from-purple-600/10 to-transparent"></div>
          <div className="absolute top-1/2 left-1/4 h-[20rem] w-[20rem] rounded-full blur-[7rem] bg-gradient-to-br from-cyan-500/10 to-transparent"></div>

          {/* Deep black overlay to maintain deep black background */}
          <div className="absolute inset-0 z-1 bg-black/50"></div>
        </div>

        {/* Product Content */}
        <div className="relative z-10 max-w-lg mx-auto px-8 py-12 h-full flex flex-col justify-center">
          {/* Company Logo and Name */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-lg"></div>
            </div>
            <h1 className="text-2xl font-bold text-white">Studio Counter</h1>
            <p className="text-white/60 text-sm">
              Professional Animation Tools
            </p>
          </div>

          {/* Product Card - New Design */}
          <CheckoutPlanCard
            name={productInfo.name}
            description={productInfo.description}
            price={productInfo.price}
            features={productInfo.features}
            isPopular={productInfo.name === "Pro"}
            className="mb-6"
          />

          {/* Billing Summary */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${productInfo.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Enter address to calculate</span>
              </div>
              <div className="flex justify-between font-medium text-white pt-2 border-t border-white/20">
                <span>Total due today</span>
                <span>${productInfo.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
