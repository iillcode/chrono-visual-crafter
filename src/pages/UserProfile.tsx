import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import { usePaddle } from "@/components/payments/PaddleProvider";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Crown,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  Settings,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ open, onOpenChange }) => {
  const { user, profile, updateProfile, refreshProfile } = useClerkAuth();
  const { subscription, cancelSubscriptionAPI, refreshSubscriptionStatus } = usePaddle();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.fullName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
  });

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        email: formData.email,
      });

      if (error) {
        toast({
          title: "Update Failed",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        await refreshProfile();
      }
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.subscriptionId) {
      toast({
        title: "No Active Subscription",
        description: "You don't have an active subscription to cancel.",
        variant: "destructive",
      });
      return;
    }

    setIsCancelling(true);
    try {
      const success = await cancelSubscriptionAPI(subscription.subscriptionId);
      if (success) {
        await refreshSubscriptionStatus();
        setShowCancelDialog(false);
      }
    } catch (error) {
      console.error("Cancellation error:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const isPro = (profile?.subscription_plan || "").toLowerCase().includes("pro");
  const isTeam = (profile?.subscription_plan || "").toLowerCase().includes("team");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <User className="w-5 h-5" />
              User Profile
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Manage your account settings and subscription.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/[0.03] border border-white/[0.08]">
              <TabsTrigger value="profile" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                Profile
              </TabsTrigger>
              <TabsTrigger value="subscription" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                Subscription
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-white/[0.03] border border-white/[0.08]">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={user?.imageUrl}
                        alt={user?.fullName || "User"}
                        className="w-16 h-16 rounded-full border-2 border-white/20"
                      />
                      {(isPro || isTeam) && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                          <Crown className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{user?.fullName}</h3>
                      <p className="text-white/60 text-sm">{user?.primaryEmailAddress?.emailAddress}</p>
                      <Badge className={cn(
                        "mt-1",
                        isPro || isTeam 
                          ? "bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-400 border-amber-500/30"
                          : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                      )}>
                        {profile?.subscription_plan || "Free"} Plan
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">Full Name</Label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="bg-white/[0.03] border-white/[0.08] text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Email Address</Label>
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-white/[0.03] border-white/[0.08] text-white"
                        disabled
                      />
                      <p className="text-xs text-white/40">Email changes must be made through your authentication provider.</p>
                    </div>

                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              <Card className="bg-white/[0.03] border border-white/[0.08]">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Current Plan</p>
                      <p className="text-white/60 text-sm">{profile?.subscription_plan || "Free"}</p>
                    </div>
                    <Badge className={cn(
                      isPro || isTeam 
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                    )}>
                      {subscription?.status || "Free"}
                    </Badge>
                  </div>

                  {profile?.subscription_plan !== "free" && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">Credits Remaining</span>
                        <span className="text-white">
                          {profile?.credits === null ? "Unlimited" : profile?.credits || 0}
                        </span>
                      </div>
                      
                      {subscription?.status === "active" && (
                        <Button
                          onClick={() => setShowCancelDialog(true)}
                          variant="outline"
                          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          Cancel Subscription
                        </Button>
                      )}
                    </div>
                  )}

                  {profile?.subscription_plan === "free" && (
                    <div className="text-center py-4">
                      <p className="text-white/60 text-sm mb-4">
                        Upgrade to Pro for unlimited exports and advanced features.
                      </p>
                      <Button
                        onClick={() => {
                          onOpenChange(false);
                          window.location.href = "/pricing";
                        }}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                      >
                        Upgrade to Pro
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="bg-white/[0.03] border border-white/[0.08]">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Account Status</p>
                        <p className="text-white/60 text-sm">Your account is secure and verified</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Two-Factor Authentication</p>
                        <p className="text-white/60 text-sm">Managed through your authentication provider</p>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        External
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-white">API Key</Label>
                        <Button
                          onClick={() => setShowApiKey(!showApiKey)}
                          variant="ghost"
                          size="sm"
                          className="text-white/60 hover:text-white"
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      <Input
                        value={showApiKey ? user?.id || "No API key available" : "••••••••••••••••"}
                        readOnly
                        className="bg-white/[0.03] border-white/[0.08] text-white font-mono text-sm"
                      />
                      <p className="text-xs text-white/40">
                        Use this API key for programmatic access to your account.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/[0.08]">
                      <div className="flex items-center gap-2 text-white/60">
                        <Activity className="w-4 h-4" />
                        <span className="text-sm">Last login: {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
          <DialogHeader>
            
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Are you sure you want to cancel your subscription? You'll lose access to Pro features at the end of your billing period.
            </DialogDescription>
          
          </DialogHeader>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              className="flex-1 border-white/20 bg-white/5 hover:bg-white/10 text-white"
            >
              Keep Subscription
            </Button>
            <Button
              onClick={handleCancel
              Subscription}
              disabled={isCancelling}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isCancelling ? "Cancelling..." : "Cancel Subscription"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfile;