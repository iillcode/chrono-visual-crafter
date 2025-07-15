// Landing page specific types
export interface AnimationVariant {
  x?: number[];
  y?: number[];
  scale?: number[];
  opacity?: number[];
  rotate?: number[];
}

export interface AnimationVariants {
  [key: string]: AnimationVariant;
}

export interface LoadingState {
  loading: boolean;
  error?: string | null;
}

export interface PricingHookReturn extends LoadingState {
  plans: PricingCardProps[];
  refetch: () => Promise<void>;
}

// Re-export commonly used types
export type { PricingCardProps } from "@/components/ui/animated-glassy-pricing";
export type { BentoItem } from "@/components/ui/bento-grid";
