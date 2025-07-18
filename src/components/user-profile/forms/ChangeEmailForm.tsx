import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface ChangeEmailFormProps {
  profile: any;
  onProfileUpdate: (updates: any) => void;
}

export const ChangeEmailForm: React.FC<ChangeEmailFormProps> = ({
  profile,
  onProfileUpdate,
}) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isChanging, setIsChanging] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  const handleChangeEmail = async () => {
    if (!user || !newEmail) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsChanging(true);
    try {
      // Check if session reverification is needed
      try {
        // Create new email address in Clerk
        const emailAddress = await user.createEmailAddress({
          email: newEmail,
        });

        // Send verification email
        await emailAddress.prepareVerification({
          strategy: "email_code",
        });

        setVerificationSent(true);
        toast({
          title: "Verification Email Sent",
          description: `A verification email has been sent to ${newEmail}. Please check your inbox and verify the email.`,
        });
      } catch (error: any) {
        if (error.errors?.[0]?.code === "session_reverification_required") {
          // Handle session reverification requirement
          toast({
            title: "Additional Verification Required",
            description:
              "For security reasons, please sign out and sign back in before changing your email address.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error("Error changing email:", error);
      toast({
        title: "Email Change Failed",
        description:
          error.errors?.[0]?.message ||
          "Failed to change email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChanging(false);
    }
  };

  const handleVerifyEmail = async (code: string) => {
    if (!user) return;

    try {
      // Find the email address that needs verification
      const emailAddress = user.emailAddresses.find(
        (email) =>
          email.emailAddress === newEmail && !email.verification?.status
      );

      if (!emailAddress) {
        toast({
          title: "Email Not Found",
          description: "Could not find the email address to verify.",
          variant: "destructive",
        });
        return;
      }

      // Verify the email with the code
      await emailAddress.attemptVerification({
        code,
      });

      // Set as primary email
      await user.update({
        primaryEmailAddressId: emailAddress.id,
      });

      // Update Supabase profile using the updateProfile function from hook
      const result = await onProfileUpdate({
        email: newEmail,
        updated_at: new Date().toISOString(),
      });

      if (result?.error) {
        console.error("Error updating profile email:", result.error);
        toast({
          title: "Database Update Failed",
          description:
            "Email verified but failed to update profile. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Email Changed Successfully",
        description: "Your email address has been updated and verified.",
      });

      setVerificationSent(false);
      setNewEmail("");
    } catch (error: any) {
      console.error("Error verifying email:", error);
      toast({
        title: "Verification Failed",
        description:
          error.errors?.[0]?.message ||
          "Failed to verify email. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-[#151515] border border-white/[0.08] shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center text-white">
          <Mail className="w-5 h-5 mr-2 text-gray-400" />
          Change Email Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-white/80">Current Email</Label>
          <div className="p-3 rounded-lg bg-[#181818] border border-white/[0.08] text-white/60">
            {user?.primaryEmailAddress?.emailAddress}
          </div>
        </div>

        {!verificationSent ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="newEmail" className="text-white/80">
                New Email Address
              </Label>
              <Input
                id="newEmail"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-[#181818] border-white/[0.08] text-white"
                placeholder="Enter your new email address"
              />
            </div>

            <Alert className="bg-yellow-500/10 border-yellow-500/20">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-200">
                You will receive a verification email at the new address. You
                must verify it before the change takes effect.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleChangeEmail}
              disabled={isChanging || !newEmail}
              className="w-full bg-[#2BA6FF] hover:bg-[#2BA6FF]/90 text-white"
            >
              {isChanging ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending Verification...
                </>
              ) : (
                "Change Email Address"
              )}
            </Button>
          </>
        ) : (
          <EmailVerificationForm
            newEmail={newEmail}
            onVerify={handleVerifyEmail}
            onCancel={() => {
              setVerificationSent(false);
              setNewEmail("");
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

interface EmailVerificationFormProps {
  newEmail: string;
  onVerify: (code: string) => void;
  onCancel: () => void;
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  newEmail,
  onVerify,
  onCancel,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!verificationCode) return;

    setIsVerifying(true);
    try {
      await onVerify(verificationCode);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-blue-500/10 border-blue-500/20">
        <Mail className="h-4 w-4 text-blue-400" />
        <AlertDescription className="text-blue-200">
          A verification code has been sent to <strong>{newEmail}</strong>.
          Please enter the code below.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="verificationCode" className="text-white/80">
          Verification Code
        </Label>
        <Input
          id="verificationCode"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          className="bg-[#181818] border-white/[0.08] text-white"
          placeholder="Enter verification code"
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleVerify}
          disabled={isVerifying || !verificationCode}
          className="flex-1 bg-[#2BA6FF] hover:bg-[#2BA6FF]/90 text-white"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify Email"
          )}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="border-white/[0.08] text-white/80 hover:bg-white/5"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
