import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Zap, Palette, Download, Users, Star } from 'lucide-react';
import AuthPage from './AuthPage';
import PricingPage from './PricingPage';
import CheckoutPage from './CheckoutPage';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [demoCounter, setDemoCounter] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoCounter(prev => (prev >= 100 ? 0 : prev + 1));
    }, 50);

    return () => clearInterval(interval);
  }, []);

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
      <nav className="flex justify-between items-center p-6">
        <div className="text-2xl font-bold text-white">
          Timer Studio
        </div>
        <div className="space-x-4">
          <Button variant="ghost" className="text-white hover:text-gray-300">
            Features
          </Button>
          <Button 
            variant="ghost" 
            className="text-white hover:text-gray-300"
            onClick={() => setShowPricing(true)}
          >
            Pricing
          </Button>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-black"
            onClick={() => setShowAuth(true)}
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-1">
            Professional Studio
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
            Counter Studio Pro
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Create stunning animated counters with professional transitions, effects, and designs. 
            Perfect for videos, presentations, and social media content.
          </p>
          
          {/* Demo Counter */}
          <div className="mb-12">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 max-w-md mx-auto">
              <p className="text-sm text-gray-400 mb-4">Live Demo</p>
              <div className="text-6xl font-bold font-orbitron text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text animate-pulse">
                {demoCounter}
              </div>
              <p className="text-sm text-gray-400 mt-4">Auto-counting preview</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Button>
            <Button 
              onClick={() => setShowPricing(true)}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
            >
              View Pricing
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-900/30 border-gray-700/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What Creators Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900/30 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-2xl border border-gray-700/50 backdrop-blur-sm p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing Counters?</h2>
          <p className="text-gray-300 mb-8 text-lg">Join thousands of creators using Counter Studio Pro</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
            </Button>
            <Button 
              onClick={() => setShowAuth(true)}
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Sign In to Pro
            </Button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && (
        <AuthPage onClose={() => setShowAuth(false)} />
      )}

      {/* Pricing Modal */}
      {showPricing && !showCheckout && (
        <PricingPage 
          onClose={() => setShowPricing(false)}
          onSelectPlan={(plan) => {
            setSelectedPlan(plan);
            if (plan.price > 0) {
              setShowCheckout(true);
            } else {
              setShowPricing(false);
              onGetStarted();
            }
          }}
        />
      )}

      {/* Checkout Modal */}
      {showCheckout && selectedPlan && (
        <CheckoutPage 
          plan={selectedPlan}
          onBack={() => {
            setShowCheckout(false);
            setSelectedPlan(null);
          }}
          onClose={() => {
            setShowCheckout(false);
            setShowPricing(false);
            setSelectedPlan(null);
          }}
        />
      )}
    </div>
  );
};

export default LandingPage;