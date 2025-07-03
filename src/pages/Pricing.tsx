import React, { useState } from 'react';
import PricingPage from '@/components/PricingPage';
import CheckoutPage from '@/components/CheckoutPage';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    if (plan.price > 0) {
      setShowCheckout(true);
    } else {
      navigate('/studio');
    }
  };

  if (showCheckout && selectedPlan) {
    return (
      <CheckoutPage 
        plan={selectedPlan}
        onBack={() => {
          setShowCheckout(false);
          setSelectedPlan(null);
        }}
        onClose={() => navigate('/')}
      />
    );
  }

  return (
    <PricingPage 
      onClose={() => navigate('/')}
      onSelectPlan={handleSelectPlan}
    />
  );
};

export default Pricing;