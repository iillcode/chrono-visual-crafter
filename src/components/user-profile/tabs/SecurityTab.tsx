import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, Bell, Mail } from "lucide-react";
import { UpdateProfileForm } from "../forms/UpdateProfileForm";
import { ChangeEmailForm } from "../forms/ChangeEmailForm";
import { PasswordManagementForm } from "../forms/PasswordManagementForm";

interface SecurityTabProps {
  user: any;
  profile: any;
  onProfileUpdate?: (updates: any) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  user,
  profile,
  onProfileUpdate = () => {},
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Account & Security</h2>

      {/* Profile Information Form */}
      <UpdateProfileForm profile={profile} onProfileUpdate={onProfileUpdate} />

      {/* Change Email Form */}
      <ChangeEmailForm profile={profile} onProfileUpdate={onProfileUpdate} />

      {/* Password Management Form */}
      <PasswordManagementForm />

      {/* Additional Security Options */}
      <Card className="bg-[#151515] border border-white/[0.08] shadow-lg backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-xl font-semibold flex items-center text-white">
            <ShieldCheck className="w-5 h-5 mr-2 text-gray-400" />
            Additional Security
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10 pt-0">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg bg-[#181818] border border-white/[0.08] gap-3">
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
                className="border-[#2BA6FF]/30 bg-[#2BA6FF]/10 hover:bg-[#2BA6FF]/20 text-[#2BA6FF] w-full sm:w-auto"
                onClick={() => {
                  // TODO: Implement 2FA setup
                  alert("Two-Factor Authentication setup coming soon!");
                }}
              >
                Enable
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg bg-[#181818] border border-white/[0.08] gap-3">
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
                className="border-[#2BA6FF]/30 bg-[#2BA6FF]/10 hover:bg-[#2BA6FF]/20 text-[#2BA6FF] w-full sm:w-auto"
                onClick={() => {
                  // TODO: Implement login notifications
                  alert("Login notifications configuration coming soon!");
                }}
              >
                Configure
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 rounded-lg bg-[#181818] border border-white/[0.08] gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#202020] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">
                    Recovery Email
                  </h3>
                  <p className="text-xs text-white/40">
                    Backup email for account recovery
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[#2BA6FF]/30 bg-[#2BA6FF]/10 hover:bg-[#2BA6FF]/20 text-[#2BA6FF] w-full sm:w-auto"
                onClick={() => {
                  // TODO: Implement recovery email setup
                  alert("Recovery email setup coming soon!");
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
