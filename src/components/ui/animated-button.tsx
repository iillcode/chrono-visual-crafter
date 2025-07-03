import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  animation?: 'scale' | 'bounce' | 'pulse' | 'glow';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  loading = false,
  animation = 'scale',
  disabled,
  ...props
}) => {
  const animations = {
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 }
    },
    bounce: {
      whileHover: { y: -2 },
      whileTap: { y: 0 }
    },
    pulse: {
      whileHover: { scale: [1, 1.05, 1] },
      transition: { duration: 0.3, repeat: Infinity }
    },
    glow: {
      whileHover: { 
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
        scale: 1.02
      }
    }
  };

  return (
    <motion.div
      {...animations[animation]}
      className="inline-block"
    >
      <Button
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          loading && 'cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          </motion.div>
        )}
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;