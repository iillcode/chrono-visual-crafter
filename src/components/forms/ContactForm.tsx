import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import ValidatedInput from './ValidatedInput';
import AnimatedButton from '../ui/animated-button';
import GlassCard from '../ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const watchedValues = watch();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailValidationRules = [
    {
      test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      message: 'Please enter a valid email address'
    }
  ];

  return (
    <GlassCard className="max-w-md mx-auto p-6 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Get in Touch
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ValidatedInput
            label="Name"
            placeholder="Your full name"
            value={watchedValues.name || ''}
            onChange={(value) => register('name').onChange({ target: { value } })}
            required
          />
          
          <ValidatedInput
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            value={watchedValues.email || ''}
            onChange={(value) => register('email').onChange({ target: { value } })}
            validationRules={emailValidationRules}
            required
          />
          
          <ValidatedInput
            label="Subject"
            placeholder="What's this about?"
            value={watchedValues.subject || ''}
            onChange={(value) => register('subject').onChange({ target: { value } })}
            required
          />
          
          <div className="space-y-2">
            <label className="text-white font-medium">Message</label>
            <motion.textarea
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              {...register('message')}
              placeholder="Tell us more..."
              rows={4}
              className="w-full bg-white/10 border border-white/30 text-white placeholder:text-gray-400 backdrop-blur-sm rounded-md p-3 resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
            />
            {errors.message && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-400 text-sm"
              >
                {errors.message.message}
              </motion.p>
            )}
          </div>
          
          <AnimatedButton
            type="submit"
            loading={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
            animation="glow"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </AnimatedButton>
        </form>
      </motion.div>
    </GlassCard>
  );
};

export default ContactForm;