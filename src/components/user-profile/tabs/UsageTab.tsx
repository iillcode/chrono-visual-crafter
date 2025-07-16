import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Zap,
  Crown,
  AlertCircle,
  LineChart,
  Video,
  Image,
  Activity,
} from "lucide-react";

interface UsageTabProps {
  profile: any;
  onNavigate: (path: string) => void;
}

export const UsageTab: React.FC<UsageTabProps> = ({ profile, onNavigate }) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-white truncate">
          Usage & Analytics
        </h2>
        <div className="text-sm text-white/50 truncate">
          Current billing period
        </div>
      </div>

      {/* Credits Overview */}
      <Card className="bg-[#151515] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-lg font-semibold flex items-center text-white">
            <Zap className="w-5 h-5 mr-2 text-yellow-400" />
            Credits Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 pt-0">
          {profile?.subscription_plan === "pro" ||
          profile?.subscription_plan === "Pro" ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <Crown className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Unlimited Access
              </h3>
              <p className="text-white/60 mb-4">
                You have unlimited credits with your Pro subscription
              </p>
              <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30">
                Pro Plan Active
              </Badge>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Credit Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 rounded-lg bg-[#181818] border border-white/[0.08] text-center min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400 mb-1">
                    {remainingCredits ?? 0}
                  </div>
                  <div className="text-xs text-white/50 truncate">
                    Credits Remaining
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-[#181818] border border-white/[0.08] text-center min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-orange-400 mb-1">
                    {usedCredits ?? 0}
                  </div>
                  <div className="text-xs text-white/50 truncate">
                    Credits Used
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-[#181818] border border-white/[0.08] text-center min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">
                    {INITIAL_CREDITS}
                  </div>
                  <div className="text-xs text-white/50 truncate">
                    Total Credits
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Usage Progress</span>
                  <span className="text-white">
                    {Math.round(((usedCredits ?? 0) / INITIAL_CREDITS) * 100)}%
                  </span>
                </div>
                <div className="h-3 bg-[#202020] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-300"
                    style={{
                      width: `${((usedCredits ?? 0) / INITIAL_CREDITS) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span className="truncate">0 credits used</span>
                  <span className="truncate">
                    {INITIAL_CREDITS} credits total
                  </span>
                </div>
              </div>

              {/* Usage Warning */}
              {(remainingCredits ?? 0) <= 10 && (
                <Alert className="border-orange-500/30 bg-orange-500/10">
                  <AlertCircle className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <AlertDescription className="text-orange-300 text-sm break-words">
                    You're running low on credits. Consider upgrading to Pro for
                    unlimited access.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Button */}
              <div className="pt-4 border-t border-white/[0.08]">
                <Button
                  onClick={() => onNavigate("/pricing")}
                  className="w-full bg-[#2BA6FF]/60 hover:bg-[#2BA6FF]/80 text-white text-sm"
                >
                  <Crown className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    Upgrade to Pro for Unlimited Credits
                  </span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Breakdown */}
     
    </div>
  );
};
