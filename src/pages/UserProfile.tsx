import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useClerkAuth } from "@/hooks/useClerkAuth";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Crown,
  Settings,
  LogOut,
  ShieldCheck,
  Calendar,
  Activity,
  ChevronRight,
  CreditCard,
  MinusCircle,
  Clock,
  Video,
  Image,
  Check,
  Bell,
  Lock,
  Mail,
  Home,
  LineChart,
  CreditCard as BillingIcon,
  ShieldAlert,
  X,
} from "lucide-react";
import { StudioBackground } from "@/components/ui/studio-background";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Interface for subscription details
interface SubscriptionDetails {
  current_period_end?: string;
  next_invoice_date?: string;
  cancel_at_period_end?: boolean;
  status?: string;
  plan?: string;
}

const UserProfile = ({ open, onOpenChange }: UserProfileProps) => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useClerkAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("overview");
  const [subscriptionDetails, setSubscriptionDetails] =
    useState<SubscriptionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch subscription details from Supabase
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // "subscription_details" is not a typed table in your Supabase types, so use "user_subscriptions" instead
        const { data, error } = await supabase
          .from("user_subscriptions")
          .select(
            "current_period_end"
          )
          .eq("user_id", user.id)
          .single();
        console.log(data, "data");
        if (error) throw error;
        setSubscriptionDetails(data as SubscriptionDetails);
      } catch (error) {
        console.error("Error fetching subscription details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open && user) {
      fetchSubscriptionDetails();
    }
  }, [user, open]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  // Determine subscription tier for styling
  const isPro = (profile?.subscription_plan || "")
    .toLowerCase()
    .includes("pro");
  const isTeam = (profile?.subscription_plan || "")
    .toLowerCase()
    .includes("team");

  // Set gradient based on subscription
  let gradientStyle = "from-gray-400/20 to-gray-500/20";
  let accentColor = "gray";

  if (isPro) {
    gradientStyle = "from-indigo-500/20 to-blue-600/20";
    accentColor = "indigo";
  } else if (isTeam) {
    gradientStyle = "from-amber-500/20 to-orange-600/20";
    accentColor = "amber";
  }

  // Credits calculations (free plan only)
  const INITIAL_CREDITS = 50;
  const remainingCredits =
    profile?.subscription_plan === "pro"
      ? null
      : typeof profile?.credits === "number"
      ? profile.credits
      : 0;
  const usedCredits =
    profile?.subscription_plan === "pro"
      ? null
      : INITIAL_CREDITS - (remainingCredits ?? 0);

  // Navigation items (removed help tab)
  const navItems = [
    { id: "overview", label: "Overview", icon: <Home className="w-4 h-4" /> },
    { id: "usage", label: "Usage", icon: <LineChart className="w-4 h-4" /> },
    {
      id: "billing",
      label: "Billing",
      icon: <BillingIcon className="w-4 h-4" />,
    },
    {
      id: "security",
      label: "Security",
      icon: <ShieldAlert className="w-4 h-4" />,
    },
  ];

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 h-[85vh] max-h-[700px] overflow-hidden bg-[#101010]">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r border-white/[0.08] flex flex-col bg-[#101010] backdrop-blur-sm">
            {/* User info */}
            <div className="p-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-medium text-white truncate">
                    {user.fullName || "User"}
                  </h3>
                  <p className="text-xs text-white/50 truncate">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4">
              <ul className="space-y-1 px-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm transition-colors",
                        activeTab === item.id
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      )}
                      onClick={() => setActiveTab(item.id)}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Sign Out Button */}
            <div className="p-4 border-t border-white/[0.08]">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Content Area - Fixed scrolling issue */}
          <div className="flex-1 overflow-y-auto relative bg-[#101010] custom-scrollbar">
            {/* Close button */}
            <DialogClose className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
              {/* <X className="w-4 h-4" /> */}
            </DialogClose>

            <div className="p-6 relative z-10">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">
                    Account Overview
                  </h2>

                  {/* Account Information */}
                  <Card className="bg-[#151515] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <User className="w-5 h-5 mr-2 text-gray-400" />
                        Account Details
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-[#181818] border border-white/[0.08]">
                          <label className="text-xs text-white/40">
                            Full Name
                          </label>
                          <p className="text-white mt-1">
                            {user.fullName || "Not provided"}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-[#181818] border border-white/[0.08]">
                          <label className="text-xs text-white/40">Email</label>
                          <p className="text-white mt-1">
                            {user.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-[#181818] border border-white/[0.08]">
                          <label className="text-xs text-white/40">
                            Member Since
                          </label>
                          <p className="text-white mt-1 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-white/40" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-[#181818] border border-white/[0.08]">
                          <label className="text-xs text-white/40">
                            Last Login
                          </label>
                          <p className="text-white mt-1 flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-white/40" />
                            {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subscription Info */}
                  <Card className="bg-[#151515] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <Crown
                          className={cn(
                            "w-5 h-5 mr-2",
                            isPro
                              ? "text-indigo-400"
                              : isTeam
                              ? "text-amber-400"
                              : "text-gray-400"
                          )}
                        />
                        Current Plan
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-[#181818] border border-white/[0.08]">
                        <div>
                          <h3 className="font-medium text-white">
                            {(profile?.subscription_plan || "Free")
                              .charAt(0)
                              .toUpperCase() +
                              (profile?.subscription_plan || "Free").slice(
                                1
                              )}{" "}
                            Plan
                          </h3>
                          <p className="text-sm text-white/50">
                            {profile?.subscription_plan === "Free"
                              ? "Limited features"
                              : "Full access to all features"}
                          </p>
                        </div>
                        <Button
                          onClick={() => navigate("/pricing")}
                          className="bg-[#2c2c2c] hover:bg-[#3a3a3a] text-white border-none"
                        >
                          {profile?.subscription_plan === "Free"
                            ? "Upgrade Plan"
                            : "Manage Plan"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Usage Tab */}
              {activeTab === "usage" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">
                    Usage Statistics
                  </h2>

                  <Card className="bg-[#151515] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <Activity className="w-5 h-5 mr-2 text-gray-400" />
                        Credits Usage
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <StatItem
                          icon={<CreditCard className="w-5 h-5" />}
                          value={
                            profile?.subscription_plan === "pro"
                              ? "Unlimited"
                              : profile?.credits?.toString() ?? "0"
                          }
                          label="Credits Remaining"
                          color="emerald"
                        />
                        <StatItem
                          icon={<MinusCircle className="w-5 h-5" />}
                          value={
                            profile?.subscription_plan === "pro"
                              ? "N/A"
                              : usedCredits?.toString() ?? "0"
                          }
                          label="Credits Used"
                          color="amber"
                        />
                      </div>

                      {profile?.subscription_plan !== "pro" && (
                        <div className="mt-4">
                          <div className="h-2 bg-[#202020] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{
                                width: `${
                                  ((remainingCredits ?? 0) / INITIAL_CREDITS) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-white/50">
                            <span>0</span>
                            <span>{INITIAL_CREDITS}</span>
                          </div>
                        </div>
                      )}

                      <div className="mt-6">
                        <Button
                          onClick={() => setActiveTab("billing")}
                          className="w-full bg-[#2c2c2c] hover:bg-[#3a3a3a] text-white"
                        >
                          {profile?.subscription_plan === "Free"
                            ? "Get More Credits"
                            : "Manage Subscription"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">
                    Billing & Payments
                  </h2>

                  <Card className="bg-[#151515] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <BillingIcon className="w-5 h-5 mr-2 text-gray-400" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      {profile?.subscription_plan !== "Free" ? (
                        <div className="p-3 rounded-lg bg-[#181818] border border-white/[0.08]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-[#202020] flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-sm font-medium text-white">
                                  Visa ending in 4242
                                </h3>
                                <p className="text-xs text-white/40">
                                  Expires 12/25
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                            >
                              Update
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-[#181818] border border-white/[0.08]">
                          <p className="text-white/60">
                            No payment method on file
                          </p>
                          <Button className="mt-3 bg-[#2c2c2c] hover:bg-[#3a3a3a] text-white">
                            Add Payment Method
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Subscription Details from Supabase */}
                  <Card className="bg-[#151515] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <Crown className="w-5 h-5 mr-2 text-gray-400" />
                        Subscription Details
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      {isLoading ? (
                        <div className="p-6 text-center">
                          <p className="text-white/60">
                            Loading subscription details...
                          </p>
                        </div>
                      ) : profile?.subscription_plan !== "Free" ? (
                        <div className="space-y-4">
                          <div className="p-3 rounded-lg bg-[#181818] border border-white/[0.08] flex justify-between">
                            <div>
                              <label className="text-xs text-white/40">
                                Current Period Ends
                              </label>
                              <p className="text-white mt-1">
                                {formatDate(
                                  subscriptionDetails?.current_period_end
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <label className="text-xs text-white/40">
                                Status
                              </label>
                              <p className="text-white mt-1">
                                {subscriptionDetails?.status || "Active"}
                              </p>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-[#181818] border border-white/[0.08] flex justify-between">
                            <div>
                              <label className="text-xs text-white/40">
                                Next Invoice Date
                              </label>
                              <p className="text-white mt-1">
                                {formatDate(
                                  subscriptionDetails?.next_invoice_date
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <label className="text-xs text-white/40">
                                Auto-Renewal
                              </label>
                              <p className="text-white mt-1">
                                {subscriptionDetails?.cancel_at_period_end
                                  ? "Off"
                                  : "On"}
                              </p>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-[#181818] border border-white/[0.08]">
                            <label className="text-xs text-white/40">
                              Plan
                            </label>
                            <p className="text-white mt-1">
                              {subscriptionDetails?.plan ||
                                profile?.subscription_plan ||
                                "Pro Plan"}
                            </p>
                          </div>

                          <div className="flex justify-end mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-white/20 bg-white/5 hover:bg-white/10 text-white mr-2"
                            >
                              {subscriptionDetails?.cancel_at_period_end
                                ? "Resume Subscription"
                                : "Cancel Subscription"}
                            </Button>
                            <Button
                              size="sm"
                              className="bg-[#2c2c2c] hover:bg-[#3a3a3a] text-white"
                            >
                              Change Plan
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-white/60 mb-4">
                            No subscription details found
                          </p>
                          <Button className="bg-[#2c2c2c] hover:bg-[#3a3a3a] text-white">
                            Upgrade to Pro
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-[#151515] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <Activity className="w-5 h-5 mr-2 text-gray-400" />
                        Payment History
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      {profile?.subscription_plan !== "Free" ? (
                        <div className="space-y-4">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-white/10">
                                  <th className="text-left py-2 text-xs font-medium text-white/50">
                                    Invoice
                                  </th>
                                  <th className="text-left py-2 text-xs font-medium text-white/50">
                                    Date
                                  </th>
                                  <th className="text-left py-2 text-xs font-medium text-white/50">
                                    Plan
                                  </th>
                                  <th className="text-left py-2 text-xs font-medium text-white/50">
                                    Amount
                                  </th>
                                  <th className="text-left py-2 text-xs font-medium text-white/50">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* This would be populated from Supabase */}
                                <tr className="border-b border-white/5">
                                  <td className="py-3 text-sm text-white/80">
                                    INV-001
                                  </td>
                                  <td className="py-3 text-sm text-white/80">
                                    {new Date().toLocaleDateString()}
                                  </td>
                                  <td className="py-3 text-sm text-white/80">
                                    {profile?.subscription_plan} Plan
                                  </td>
                                  <td className="py-3 text-sm text-white/80">
                                    $19.99
                                  </td>
                                  <td className="py-3">
                                    <span className="text-xs bg-emerald-500/20 text-emerald-400 py-1 px-2 rounded-full">
                                      Paid
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-white/60 mb-4">
                            No payment history found
                          </p>
                          <Button className="bg-[#2c2c2c] hover:bg-[#3a3a3a] text-white">
                            Upgrade to Pro
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">
                    Security Settings
                  </h2>

                  <Card className="bg-[#151515] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <ShieldCheck className="w-5 h-5 mr-2 text-gray-400" />
                        Account Security
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-[#181818] border border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#202020] flex items-center justify-center">
                              <Lock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-white">
                                Two-Factor Authentication
                              </h3>
                              <p className="text-xs text-white/40">
                                Add an extra layer of security
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                          >
                            Enable
                          </Button>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-lg bg-[#181818] border border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#202020] flex items-center justify-center">
                              <Bell className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-white">
                                Login Notifications
                              </h3>
                              <p className="text-xs text-white/40">
                                Get notified of new logins
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                          >
                            Configure
                          </Button>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-lg bg-[#181818] border border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#202020] flex items-center justify-center">
                              <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-white">
                                Recovery Email
                              </h3>
                              <p className="text-xs text-white/40">
                                Set a backup email address
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: "indigo" | "blue" | "violet" | "rose" | "amber" | "emerald";
}

const StatItem = ({ icon, value, label, color }: StatItemProps) => {
  const colorMap = {
    indigo: "from-[#202020] to-[#181818] border-white/10 text-white",
    blue: "from-[#202020] to-[#181818] border-white/10 text-white",
    violet: "from-[#202020] to-[#181818] border-white/10 text-white",
    rose: "from-[#202020] to-[#181818] border-white/10 text-white",
    amber: "from-[#202020] to-[#181818] border-white/10 text-white",
    emerald: "from-[#202020] to-[#181818] border-white/10 text-white",
  };

  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-gradient-to-br border",
        "relative overflow-hidden",
        colorMap[color]
      )}
    >
      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/5" />
      <div className="flex flex-col items-center md:items-start">
        <div className="mb-2 text-gray-400">{icon}</div>
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-xs text-white/50 mt-1">{label}</span>
      </div>
    </div>
  );
};

// Add custom scrollbar styles to index.css:
// .custom-scrollbar::-webkit-scrollbar {
//   width: 8px;
// }
// .custom-scrollbar::-webkit-scrollbar-track {
//   background: #101010;
// }
// .custom-scrollbar::-webkit-scrollbar-thumb {
//   background: #333;
//   border-radius: 4px;
// }
// .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//   background: #444;
// }

export default UserProfile;
