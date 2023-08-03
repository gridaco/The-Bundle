import React from "react";
import { ContinueWithGoogleButton } from "@/components/continue-with-google-button";
import { UpgradeToProSplashView, ColumnImages } from "@/scaffolds/upgrade";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { Dialog } from "@/components/dialog";

export function CBTSignin() {
  const supabase = createPagesBrowserClient();

  const onsigninclick = () => {
    // Note: thr url must be white-listed on supabase config, like, e.g.
    // - http://localhost:1960/**/*
    // - https://lsd-*.vercel.app/**/*
    const redirect = `${location.origin}/lsd/auth/callback`;
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirect,
      },
    });
  };

  return (
    <Dialog open={true}>
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
    </Dialog>
  );
}
