import React from 'react';
import AuthPage from '@/components/AuthPage';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <AuthPage onClose={() => navigate('/')} />
  );
};

export default Auth;