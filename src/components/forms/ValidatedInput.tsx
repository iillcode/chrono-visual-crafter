import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

interface ValidatedInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  validationRules?: ValidationRule[];
  required?: boolean;
  className?: string;
  showPasswordToggle?: boolean;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  validationRules = [],
  required = false,
  className = '',
  showPasswordToggle = false
}) => {
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  const inputType = showPasswordToggle && showPassword ? 'text' : type;

  useEffect(() => {
    if (!touched && !value) return;

    const newErrors: string[] = [];
    
    if (required && !value.trim()) {
      newErrors.push(`${label} is required`);
    }

    validationRules.forEach(rule => {
      if (value && !rule.test(value)) {
        newErrors.push(rule.message);
      }
    });

    setErrors(newErrors);
    setIsValid(newErrors.length === 0 && value.trim() !== '');
  }, [value, touched, required, label, validationRules]);

  const handleBlur = () => {
    setFocused(false);
    setTouched(true);
  };

  const getInputStatus = () => {
    if (!touched && !value) return 'default';
    if (errors.length > 0) return 'error';
    if (isValid) return 'success';
    return 'default';
  };

  const status = getInputStatus();

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-white font-medium">{label}</Label>
      
      <div className="relative">
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          className={cn(
            'bg-white/10 border-white/30 text-white placeholder:text-gray-400 backdrop-blur-sm transition-all duration-300 pr-10',
            focused && 'border-blue-400 ring-2 ring-blue-400/20',
            status === 'error' && 'border-red-400 ring-2 ring-red-400/20',
            status === 'success' && 'border-green-400 ring-2 ring-green-400/20'
          )}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          
          <AnimatePresence>
            {touched && value && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {status === 'success' && (
                  <Check className="w-4 h-4 text-green-400" />
                )}
                {status === 'error' && (
                  <X className="w-4 h-4 text-red-400" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {touched && errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-1"
          >
            {errors.map((error, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-red-400 text-sm flex items-center"
              >
                <X className="w-3 h-3 mr-1" />
                {error}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password strength indicator for password fields */}
      {type === 'password' && value && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex space-x-1">
            {[1, 2, 3, 4].map((level) => {
              const strength = getPasswordStrength(value);
              return (
                <div
                  key={level}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-300',
                    strength >= level ? getStrengthColor(strength) : 'bg-gray-600'
                  )}
                />
              );
            })}
          </div>
          <p className="text-xs text-gray-400">
            Password strength: {getStrengthText(getPasswordStrength(value))}
          </p>
        </motion.div>
      )}
    </div>
  );
};

const getPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return Math.min(strength, 4);
};

const getStrengthColor = (strength: number): string => {
  switch (strength) {
    case 1: return 'bg-red-500';
    case 2: return 'bg-orange-500';
    case 3: return 'bg-yellow-500';
    case 4: return 'bg-green-500';
    default: return 'bg-gray-600';
  }
};

const getStrengthText = (strength: number): string => {
  switch (strength) {
    case 1: return 'Very Weak';
    case 2: return 'Weak';
    case 3: return 'Good';
    case 4: return 'Strong';
    default: return 'Too Short';
  }
};

export default ValidatedInput;