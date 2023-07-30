import React from "react";
import { ContinueWithGoogleButton } from "@/components/continue-with-google-button";
import { UpgradeToProSplashView, ColumnImages } from "@/scaffold/upgrade";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export function CBTSignin() {
  const supabase = createPagesBrowserClient();

  const onsigninclick = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/lsd/auth/callback`,
      },
    });
  };

  return (
    <UpgradeToProSplashView
      hero={
        <ColumnImages
          src={[
            "/lsd/pro/hero-columns/01.png",
            "/lsd/pro/hero-columns/02.png",
            "/lsd/pro/hero-columns/03.png",
            "/lsd/pro/hero-columns/04.png",
            "/lsd/pro/hero-columns/05.png",
            "/lsd/pro/hero-columns/06.png",
          ]}
        />
      }
    >
      <>
        <h1>LSD Closed Beta</h1>
        <p>
          Welcome to LSD Closed Beta. Please sign in with Google to continue.
        </p>
        <ContinueWithGoogleButton onClick={onsigninclick} />
      </>
    </UpgradeToProSplashView>
  );
}
