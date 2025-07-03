import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useClerkAuth } from '@/hooks/useClerkAuth';
import GlassCard from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Crown, Settings, LogOut } from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useClerkAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-center"
        >
          <p>Please sign in to view your profile.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:text-gray-300 p-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <GlassCard className="p-8 rounded-2xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User'}
                  className="w-24 h-24 rounded-full border-4 border-white/20"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white/20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
              </motion.div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.fullName || 'User'}
                </h1>
                <p className="text-gray-300 mb-4">{user.primaryEmailAddress?.emailAddress}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    {profile?.subscription_plan || 'Free'} Plan
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-300 border border-green-500/30">
                    Active Member
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Account Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Account Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-sm">Full Name</label>
                  <p className="text-white">{user.fullName || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <p className="text-white">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Member Since</label>
                  <p className="text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Subscription
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-sm">Current Plan</label>
                  <p className="text-white font-medium">
                    {profile?.subscription_plan || 'Free'} Plan
                  </p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <p className="text-green-400">
                    {profile?.subscription_status || 'Active'}
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/pricing')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Upgrade Plan
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Usage Statistics */}
          <GlassCard className="p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Usage Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">12</div>
                <div className="text-gray-400 text-sm">Counters Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">8</div>
                <div className="text-gray-400 text-sm">Videos Exported</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">24</div>
                <div className="text-gray-400 text-sm">Hours Recorded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">5</div>
                <div className="text-gray-400 text-sm">GIFs Generated</div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;