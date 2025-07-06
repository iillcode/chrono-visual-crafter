import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import AuthButton from "@/components/auth/AuthButton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UserMenu from "../user/UserMenu";

interface SiteHeaderProps {
  className?: string;
  transparent?: boolean;
  showThemeToggle?: boolean;
  showAuthButton?: boolean;
  showNavLinks?: boolean;
}

export function SiteHeader({
  className,
  transparent = false,
  showThemeToggle = true,
  showAuthButton = true,
  showNavLinks = true,
}: SiteHeaderProps) {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold sm:inline-block">Countable</span>
          </a>
        </div>

        <div className="flex items-center space-x-4">
          {showNavLinks && (
            <Button
              variant="ghost"
              className="px-0 hover:bg-transparent hover:text-foreground"
              onClick={() => navigate("/studio")}
            >
              Go to Studio
            </Button>
          )}
          <ThemeToggle />
          {isSignedIn ? (
            <UserMenu />
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
