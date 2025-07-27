"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

export function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/confirm`,
      },
    });
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="w-full flex items-center gap-2"
    >
      <FaGoogle />
      <span>Login with Google</span>
    </Button>
  );
}
  