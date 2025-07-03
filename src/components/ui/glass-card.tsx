import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  opacity?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = true,
  blur = 'xl',
  opacity = 0.1
}) => {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -2, scale: 1.02 } : undefined}
      className={cn(
        `${blurClasses[blur]} border border-white/20 shadow-2xl transition-all duration-300`,
        `bg-white/${Math.round(opacity * 100)}`,
        hover && 'hover:shadow-3xl hover:border-white/30',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;