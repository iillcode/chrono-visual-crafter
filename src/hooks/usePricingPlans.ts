import React from "react";
import { PricingCardProps } from "@/components/ui/animated-glassy-pricing";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePricingPlans = () => {
  const { toast } = useToast();
  const [plans, setPlans] = React.useState<PricingCardProps[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchPlans = React.useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (error) throw error;

      const filtered = data.filter((plan) =>
        ["Free", "Pro"].includes(plan.name)
      );

      const formattedPlans = filtered.map((plan, index) => {
        const features = Array.isArray(plan.features)
          ? plan.features
          : JSON.parse((plan.features as string) || "[]");

        return {
          planName: plan.name,
          description: plan.description || "",
          price: plan.price.toString(),
          features: features,
          buttonText: plan.name === "Free" ? "Get Started" : "Subscribe Now",
          isPopular: index === 1, // Make the Pro plan popular
          buttonVariant: (plan.name === "Free" ? "secondary" : "primary") as
            | "secondary"
            | "primary",
          paddlePriceId: plan.paddle_price_id || undefined,
        };
      });

      setPlans(formattedPlans);
    } catch (error: any) {
      toast({
        title: "Error loading plans",
        description: error.message,
        variant: "destructive",
      });

      // Set empty plans array if database fails
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, refetch: fetchPlans };
};
