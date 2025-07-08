import React, { useState } from "react";
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
  HelpCircle,
} from "lucide-react";
import { StudioBackground } from "@/components/ui/studio-background";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

interface UserProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserProfile = ({ open, onOpenChange }: UserProfileProps) => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useClerkAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("overview");

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
      : INITIAL_CREDITS - remainingCredits;

  // Navigation items
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
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle className="w-4 h-4" />,
    },
  ];

  // Mock payment history data (would be fetched from backend in real implementation)
  const paymentHistory = [
    {
      id: "INV-001",
      date: "2023-10-01",
      amount: "$19.99",
      status: "Paid",
      plan: "Pro Plan (Monthly)",
    },
    {
      id: "INV-002",
      date: "2023-09-01",
      amount: "$19.99",
      status: "Paid",
      plan: "Pro Plan (Monthly)",
    },
    {
      id: "INV-003",
      date: "2023-08-01",
      amount: "$19.99",
      status: "Paid",
      plan: "Pro Plan (Monthly)",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0 h-[85vh] max-h-[700px] overflow-hidden bg-black">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r border-white/[0.08] flex flex-col bg-black/50 backdrop-blur-sm">
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

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto relative bg-black">
            <StudioBackground intensity="low" />

            <div className="p-6 relative z-10">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">
                    Account Overview
                  </h2>

                  {/* Account Information */}
                  <Card className="bg-white/[0.03] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-40" />

                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <User className="w-5 h-5 mr-2 text-indigo-400" />
                        Account Details
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <label className="text-xs text-white/40">
                            Full Name
                          </label>
                          <p className="text-white mt-1">
                            {user.fullName || "Not provided"}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <label className="text-xs text-white/40">Email</label>
                          <p className="text-white mt-1">
                            {user.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <label className="text-xs text-white/40">
                            Member Since
                          </label>
                          <p className="text-white mt-1 flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-white/40" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
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
                  <Card className="bg-white/[0.03] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-40",
                        `from-${accentColor}-500/10 to-transparent`
                      )}
                    />

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
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
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
                          className={cn(
                            "text-white shadow-lg",
                            "bg-gradient-to-r",
                            isPro
                              ? "from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 shadow-indigo-500/25"
                              : isTeam
                              ? "from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/25"
                              : "from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                          )}
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

                  <Card className="bg-white/[0.03] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-40" />

                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <Activity className="w-5 h-5 mr-2 text-violet-400" />
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
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{
                                width: `${
                                  (remainingCredits / INITIAL_CREDITS) * 100
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
                          className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white"
                        >
                          {profile?.subscription_plan === "Free"
                            ? "Get More Credits"
                            : "Manage Subscription"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Additional usage stats could go here */}
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === "billing" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">
                    Billing & Payments
                  </h2>

                  <Card className="bg-white/[0.03] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-40" />

                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <BillingIcon className="w-5 h-5 mr-2 text-blue-400" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      {profile?.subscription_plan !== "Free" ? (
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
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
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <p className="text-white/60">
                            No payment method on file
                          </p>
                          <Button className="mt-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white">
                            Add Payment Method
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-white/[0.03] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-40" />

                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <Activity className="w-5 h-5 mr-2 text-blue-400" />
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
                                {paymentHistory.map((payment) => (
                                  <tr
                                    key={payment.id}
                                    className="border-b border-white/5"
                                  >
                                    <td className="py-3 text-sm text-white/80">
                                      {payment.id}
                                    </td>
                                    <td className="py-3 text-sm text-white/80">
                                      {payment.date}
                                    </td>
                                    <td className="py-3 text-sm text-white/80">
                                      {payment.plan}
                                    </td>
                                    <td className="py-3 text-sm text-white/80">
                                      {payment.amount}
                                    </td>
                                    <td className="py-3">
                                      <span className="text-xs bg-emerald-500/20 text-emerald-400 py-1 px-2 rounded-full">
                                        {payment.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="pt-3 border-t border-white/10">
                            <p className="text-sm text-white/70">
                              Your subscription will automatically renew on{" "}
                              {new Date(
                                Date.now() + 30 * 24 * 60 * 60 * 1000
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <p className="text-white/60 mb-4">
                            No payment history found
                          </p>
                          <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white">
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

                  <Card className="bg-white/[0.03] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-40" />

                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <ShieldCheck className="w-5 h-5 mr-2 text-rose-400" />
                        Account Security
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                              <Lock className="w-5 h-5 text-rose-400" />
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

                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                              <Bell className="w-5 h-5 text-rose-400" />
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

                        <div className="flex justify-between items-center p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                              <Mail className="w-5 h-5 text-rose-400" />
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

              {/* Help Tab */}
              {activeTab === "help" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">
                    Help & Support
                  </h2>

                  <Card className="bg-white/[0.03] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-40" />

                    <CardHeader className="pb-3 relative z-10">
                      <CardTitle className="text-xl font-semibold flex items-center text-white">
                        <HelpCircle className="w-5 h-5 mr-2 text-purple-400" />
                        Support Options
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 pt-0">
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <h3 className="font-medium text-white mb-1">
                            Documentation
                          </h3>
                          <p className="text-sm text-white/60 mb-3">
                            Browse our documentation for guides and API
                            references
                          </p>
                          <Button
                            variant="outline"
                            className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                          >
                            View Docs
                          </Button>
                        </div>

                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <h3 className="font-medium text-white mb-1">
                            Contact Support
                          </h3>
                          <p className="text-sm text-white/60 mb-3">
                            Get help from our support team
                          </p>
                          <Button
                            variant="outline"
                            className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                          >
                            Contact Us
                          </Button>
                        </div>

                        <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                          <h3 className="font-medium text-white mb-1">
                            Frequently Asked Questions
                          </h3>
                          <p className="text-sm text-white/60 mb-3">
                            Find answers to common questions
                          </p>
                          <Button
                            variant="outline"
                            className="border-white/20 bg-white/5 hover:bg-white/10 text-white"
                          >
                            View FAQs
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
    indigo:
      "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 text-indigo-400",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400",
    violet:
      "from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-400",
    rose: "from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400",
    amber:
      "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400",
    emerald:
      "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400",
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
        <div className="mb-2">{icon}</div>
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-xs text-white/50 mt-1">{label}</span>
      </div>
    </div>
  );
};

export default UserProfile;
