import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { motion } from "framer-motion";
import { usePaddle } from "./PaddleProvider";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: string;
    features: string[];
    popular?: boolean;
    paddlePriceId?: string;
  };
  className?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, className = "" }) => {
  const { openCheckout } = usePaddle();
  const { isSignedIn } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (plan.price === 0) {
      toast({
        title: "Free Plan Active",
        description:
          "You're already on the free plan! Redirecting to studio...",
      });
      navigate("/studio");
      return;
    }

    if (!plan.paddlePriceId) {
      toast({
        title: "Coming Soon",
        description: "This plan will be available soon!",
      });
      return;
    }

    openCheckout(plan.paddlePriceId, {
      planId: plan.id,
      planName: plan.name,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={className}
    >
      <Card
        className={cn(
          "relative h-full backdrop-blur-xl border shadow-2xl transition-all duration-300",
          "bg-white/5 border-white/10 hover:bg-white/10",
          "overflow-hidden",
          plan.popular ? "ring-2 ring-cyan-400 ring-opacity-50" : ""
        )}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 -z-10">
          {plan.popular ? (
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-60" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-40" />
          )}
        </div>

        {plan.popular && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -top-3 left-1/2 transform -translate-x-1/2"
          >
            <Badge className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-3 py-1 shadow-lg">
              <Star className="w-3 h-3 mr-1" />
              Most Popular
            </Badge>
          </motion.div>
        )}

        <CardHeader className="text-center space-y-4 pb-6">
          <CardTitle className="text-2xl font-bold text-white">
            {plan.name}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {plan.description}
          </CardDescription>

          <div className="space-y-2">
            <div className="text-4xl font-bold text-white">
              ${plan.price}
              {plan.price > 0 && (
                <span className="text-lg font-normal text-gray-300">
                  /{plan.interval}
                </span>
              )}
            </div>
            {plan.price === 0 && (
              <div className="text-sm text-gray-400">Forever free</div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleSubscribe}
              className={cn(
                "w-full font-medium py-3 px-4 rounded-full transition-all duration-200 transform hover:scale-105",
                plan.price === 0
                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  : plan.popular
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white"
              )}
            >
              {plan.price === 0 ? "Get Started" : "Subscribe Now"}
            </Button>
          </motion.div>

          <div className="space-y-3">
            <h4 className="font-semibold text-white">Features included:</h4>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center text-gray-300"
                >
                  <Check className="w-4 h-4 text-cyan-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PricingCard;
