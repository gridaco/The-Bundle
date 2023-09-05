"use client";
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Dela_Gothic_One } from "next/font/google";
import { ContinueWithGoogleButton } from "@/components/continue-with-google-button";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

const delta_gothic_one = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const useHost = () => {
  const [host, setHost] = useState<string>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.origin);
    }
  }, []);

  return host;
};

export default function SigninPage() {
  const supabase = createPagesBrowserClient();
  const host = useHost();

  const redirect = `${host}/bundle/auth/callback`;

  const onsigninclick = () => {
    // Note: thr url must be white-listed on supabase config, like, e.g.
    // - http://localhost:1960/**/*
    // - https://lsd-*.vercel.app/**/*
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirect,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4">
        <h1 className="text-6xl">
          <span className={delta_gothic_one.className}>The Bundle</span>
        </h1>
        <p className="opacity-50">Make your next big Idea real</p>
        <ContinueWithGoogleButton onClick={onsigninclick} />
      </div>
    </>
  );
}
