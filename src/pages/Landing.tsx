import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlassCard from '@/components/ui/glass-card';
import AuthButton from '@/components/auth/AuthButton';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Play, Zap, Palette, Download, Users, Star, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  const handleGetStarted = () => {
    if (isSignedIn) {
      navigate('/studio');
    } else {
      navigate('/auth');
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "20+ Transition Effects",
      description: "From smooth slides to dramatic flips, create stunning counter animations"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Professional Designs",
      description: "Neon glows, gradients, fire effects and more built-in designs"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Ready",
      description: "Download as high-quality videos or optimized GIFs"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      content: "This tool saved me hours of work. The transitions are absolutely stunning!",
      rating: 5
    },
    {
      name: "Mark Johnson",
      role: "Video Editor",
      content: "Perfect for countdown timers in my projects. Love the professional quality.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white overflow-y-auto">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center p-6 backdrop-blur-xl bg-white/5 border-b border-white/10"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-bold text-white"
        >
          Timer Studio
        </motion.div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Features
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:text-gray-300"
            onClick={() => navigate('/pricing')}
          >
            Pricing
          </Button>
          <AuthButton mode="signin" variant="outline" className="border-white text-white hover:bg-white hover:text-black" />
        </div>
      </motion.nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1">
              Professional Studio
            </Badge>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent"
          >
            Counter Studio Pro
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            Create stunning animated counters with professional transitions, effects, and designs. 
            Perfect for videos, presentations, and social media content.
          </motion.p>
          
          {/* Demo Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-12"
          >
            <GlassCard className="max-w-md mx-auto p-8 rounded-2xl">
              <p className="text-sm text-gray-400 mb-4">Live Demo</p>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  textShadow: [
                    '0 0 10px rgba(59, 130, 246, 0.5)',
                    '0 0 20px rgba(59, 130, 246, 0.8)',
                    '0 0 10px rgba(59, 130, 246, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl font-bold font-orbitron text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text"
              >
                100
              </motion.div>
              <p className="text-sm text-gray-400 mt-4">Auto-counting preview</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => navigate('/pricing')}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg rounded-full transition-all duration-300"
              >
                View Pricing
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.2, duration: 0.6 }}
            >
              <GlassCard className="p-6 text-center h-full">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center mb-12">What Creators Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + index * 0.3, duration: 0.6 }}
              >
                <GlassCard className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2.2 + index * 0.3 + i * 0.1 }}
                      >
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.8 }}
        >
          <GlassCard className="text-center p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing Counters?</h2>
            <p className="text-gray-300 mb-8 text-lg">Join thousands of creators using Counter Studio Pro</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300"
                >
                  Get Started Free
                </Button>
              </motion.div>
              
              <AuthButton 
                mode="signin"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-full"
              />
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;