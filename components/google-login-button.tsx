"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { toast } from "sonner";

export function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}//auth/confirm`,
        },
      });

      if (error) {
        console.error("Error during Google login:", error);
        toast.error(`Login failed: ${error.message || "An unexpected error occurred."}`);
      }
    } catch (err) {
      console.error("Unexpected error during Google login:", err);
      toast.error("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="w-full flex items-center gap-2"
      disabled={isLoading}
    >
      {isLoading ? "Logging in..." : <><FaGoogle /><span>Login with Google</span></>}
    </Button>
  );
}