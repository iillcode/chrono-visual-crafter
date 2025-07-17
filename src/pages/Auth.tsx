import React, { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center p-4">
      {/* Background effects - same as Pricing page */}
      <div className="absolute inset-0 z-0">
        <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0">
          <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-[#1FB4FF] to-sky-400"></div>
          <div className="h-[10rem] rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-[#1FB4FF]/10 to-sky-400"></div>
          <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-[#1FB4FF]/10 to-sky-400"></div>
        </div>
        <div className="absolute inset-0 z-0 bg-noise opacity-30"></div>

        {/* Additional gradients for more visual interest */}
        <div className="absolute bottom-0 left-0 h-[30rem] w-[30rem] rounded-full blur-[8rem] bg-gradient-to-tr from-purple-600/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/4 h-[20rem] w-[20rem] rounded-full blur-[7rem] bg-gradient-to-br from-cyan-500/10 to-transparent"></div>

        {/* Deep black overlay to maintain deep black background */}
        <div className="absolute inset-0 z-1 bg-black/50"></div>
      </div>

      <div className="absolute top-6 left-6 z-20">
        <Button
          variant="ghost"
          className="text-white hover:text-islandblue-300 flex items-center gap-2"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />
          Back to Home
        </Button>
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative z-10">
          {isSignUp ? (
            <SignUp
              // appearance={{
              //   elements: {
              //     formButtonPrimary:
              //       "bg-islandblue-600 hover:bg-islandblue-700 text-sm normal-case w-full",
              //     footerActionLink:
              //       "text-islandblue-400 hover:text-islandblue-300",
              //     card: "bg-transparent shadow-none",
              //     headerTitle: "hidden",
              //     headerSubtitle: "hidden",
              //     socialButtonsBlockButton:
              //       "border border-gray-700 bg-black hover:bg-islandblue-900/30 text-white",
              //     formFieldInput:
              //       "bg-black/60 border-gray-700 text-white focus:border-islandblue-400/70",
              //     formFieldLabel: "text-gray-300",
              //   },
              // }}
              afterSignUpUrl="/studio"
              routing="virtual"
            />
          ) : (
            <SignIn
              // appearance={{
              //   elements: {
              //     formButtonPrimary:
              //       "bg-islandblue-600 hover:bg-islandblue-700 text-sm normal-case w-full",
              //     footerActionLink:
              //       "text-islandblue-400 hover:text-islandblue-300",
              //     card: "bg-transparent shadow-none",
              //     headerTitle: "hidden",
              //     headerSubtitle: "hidden",
              //     socialButtonsBlockButton:
              //       "border border-gray-700 bg-black hover:bg-islandblue-900/30 text-white",
              //     formFieldInput:
              //       "bg-black/60 border-gray-700 text-white focus:border-islandblue-400/70",
              //     formFieldLabel: "text-gray-300",
              //     identityPreview: "bg-black/40 border border-gray-700",
              //   },
              // }}
              afterSignInUrl="/studio"
              routing="virtual"
            />
          )}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
