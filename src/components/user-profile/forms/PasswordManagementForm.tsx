import React, { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Extend Window interface for Clerk
declare global {
  interface Window {
    Clerk?: {
      client: {
        signIn: {
          create: (params: {
            strategy: string;
            identifier: string;
          }) => Promise<any>;
        };
      };
    };
  }
}

export const PasswordManagementForm: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [isChanging, setIsChanging] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid:
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar,
      errors: [
        ...(password.length < minLength
          ? [`At least ${minLength} characters`]
          : []),
        ...(!hasUpperCase ? ["One uppercase letter"] : []),
        ...(!hasLowerCase ? ["One lowercase letter"] : []),
        ...(!hasNumbers ? ["One number"] : []),
        ...(!hasSpecialChar ? ["One special character"] : []),
      ],
    };
  };

  const handleChangePassword = async () => {
    if (!user) return;

    const { isValid, errors } = validatePassword(passwordData.newPassword);

    if (!isValid) {
      toast({
        title: "Password Requirements Not Met",
        description: `Password must have: ${errors.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "New password and confirmation password must match.",
        variant: "destructive",
      });
      return;
    }

    setIsChanging(true);
    try {
      await user.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });

      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowChangePassword(false);
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast({
        title: "Password Change Failed",
        description:
          error.errors?.[0]?.message ||
          "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChanging(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast({
        title: "No Email Found",
        description: "No email address found for password reset.",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);

    // For password reset, the best approach is to sign out and redirect to login
    // This is because Clerk's password reset is designed to work from the sign-in flow
    toast({
      title: "Redirecting to Password Reset",
      description:
        "You will be signed out and redirected to the login page where you can reset your password.",
    });

    // Sign out the user and redirect to auth page
    setTimeout(async () => {
      try {
        await signOut();
        // Redirect to auth page with a hint to use forgot password
        window.location.href = "/auth?reset=true";
      } catch (error) {
        console.error("Error during sign out:", error);
        toast({
          title: "Sign Out Failed",
          description:
            "Please manually sign out and use the 'Forgot Password' link on the login page.",
          variant: "destructive",
        });
      } finally {
        setIsResetting(false);
      }
    }, 1500);
  };

  const passwordValidation = validatePassword(passwordData.newPassword);

  return (
    <Card className="bg-[#151515] border border-white/[0.08] shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center text-white">
          <Lock className="w-5 h-5 mr-2 text-gray-400" />
          Password Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showChangePassword ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setShowChangePassword(true)}
                className="flex-1 bg-[#2BA6FF] hover:bg-[#2BA6FF]/90 text-white"
              >
                Change Password
              </Button>
              <Button
                onClick={handleForgotPassword}
                disabled={isResetting}
                variant="outline"
                className="flex-1 border-white/[0.08] text-white/80 hover:bg-white/5"
              >
                {isResetting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Forgot Password"
                )}
              </Button>
            </div>

            <Alert className="bg-blue-500/10 border-blue-500/20">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200">
                Use "Forgot Password" to receive a secure reset link via email,
                or "Change Password" if you know your current password.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-white/80">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                className="bg-[#181818] border-white/[0.08] text-white"
                placeholder="Enter your current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white/80">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
                className="bg-[#181818] border-white/[0.08] text-white"
                placeholder="Enter your new password"
              />
              {passwordData.newPassword && (
                <div className="space-y-1">
                  {passwordValidation.errors.map((error, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <AlertCircle className="w-3 h-3 text-red-400" />
                      <span className="text-red-400">{error}</span>
                    </div>
                  ))}
                  {passwordValidation.isValid && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">
                        Password meets all requirements
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/80">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="bg-[#181818] border-white/[0.08] text-white"
                placeholder="Confirm your new password"
              />
              {passwordData.confirmPassword &&
                passwordData.newPassword !== passwordData.confirmPassword && (
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-3 h-3 text-red-400" />
                    <span className="text-red-400">Passwords don't match</span>
                  </div>
                )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleChangePassword}
                disabled={
                  isChanging ||
                  !passwordData.currentPassword ||
                  !passwordValidation.isValid ||
                  passwordData.newPassword !== passwordData.confirmPassword
                }
                className="flex-1 bg-[#2BA6FF] hover:bg-[#2BA6FF]/90 text-white"
              >
                {isChanging ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
              <Button
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                variant="outline"
                className="border-white/[0.08] text-white/80 hover:bg-white/5"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
