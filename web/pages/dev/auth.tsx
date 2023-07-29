import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import React from "react";

export default function AuthTest() {
  const supabase = createPagesBrowserClient();

  const onsignin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/lsd/auth/callback`,
      },
    });
  };

  return (
    <>
      <button onClick={onsignin}>Sign in</button>
    </>
  );
}
