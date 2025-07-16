import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();

    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && sessionData?.user) {
      const user = sessionData.user;

      const { error: insertError } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        avatar_url: user.user_metadata?.avatar_url,
      });

      if (insertError) {
        console.error("Failed to insert user:", insertError);
        return redirect("/auth/error");
      }

      return redirect(next);
    }
  }

  return redirect("/auth/error");
}
