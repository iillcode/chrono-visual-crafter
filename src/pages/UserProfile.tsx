import React from 'react';
import UserManagement from '@/components/UserManagement';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
        <UserManagement onClose={() => navigate('/')} />
      </div>
    </div>
  );
};

export default UserProfile;