import React from "react";
import styled from "@emotion/styled";
import { ContinueWithGoogleButton } from "@/components/continue-with-google-button";
import { UpgradeToProSplashView, ColumnImages } from "@/scaffolds/upgrade";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

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
    <Layout>
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
    </Layout>
  );
}

const Layout = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border: solid 2px rgba(255, 255, 255, 0.16);
  border-radius: 8px;
  box-shadow: 0px 4px 16px 4px rgba(255, 255, 255, 0.04);
  max-width: 860px;

  overflow: hidden;
`;
