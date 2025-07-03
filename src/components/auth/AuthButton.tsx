import React from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { User, LogIn, UserPlus } from 'lucide-react';

interface AuthButtonProps {
  mode?: 'signin' | 'signup' | 'user';
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

const AuthButton: React.FC<AuthButtonProps> = ({ 
  mode = 'signin', 
  className = '',
  variant = 'default'
}) => {
  const { isSignedIn, user } = useUser();

  if (isSignedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        <UserButton 
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8 rounded-full border-2 border-white/20 hover:border-white/40 transition-colors',
              userButtonPopoverCard: 'backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl',
              userButtonPopoverActionButton: 'text-white hover:bg-white/10',
              userButtonPopoverActionButtonText: 'text-white',
              userButtonPopoverFooter: 'hidden'
            }
          }}
        />
      </motion.div>
    );
  }

  if (mode === 'signup') {
    return (
      <SignUpButton mode="modal">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button variant={variant} className={className}>
            <UserPlus className="w-4 h-4 mr-2" />
            Sign Up
          </Button>
        </motion.div>
      </SignUpButton>
    );
  }

  return (
    <SignInButton mode="modal">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button variant={variant} className={className}>
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </motion.div>
    </SignInButton>
  );
};

export default AuthButton;