"use client";
import React, { useState, useEffect } from "react";
import { Dela_Gothic_One } from "next/font/google";
import { ContinueWithGoogleButton } from "@/components/continue-with-google-button";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useSearchParams } from "next/navigation";
import { redirect_uri } from "@/s/q";
import useHost from "@/hooks/useHost";

const delta_gothic_one = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function SigninPage() {
  const supabase = createPagesBrowserClient();
  const host = useHost();
  const searchParams = useSearchParams();

  const _redirect_uri = redirect_uri.parse(searchParams);

  const redirect = redirect_uri.make(`${host}/bundle/auth/callback`, {
    redirect_uri: _redirect_uri,
  });

  const onsigninclick = () => {
    // Note: thr url must be white-listed on supabase config, like, e.g.
    // - http://localhost:1969/**/*
    // - https://the-bundle-*.vercel.app/**/*
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirect?.toString(),
      },
    });
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen gap-4">
      <h1 className="text-6xl">
        <span className={delta_gothic_one.className}>The Bundle</span>
      </h1>
      <p className="opacity-50">Make your next big Idea real</p>
      <ContinueWithGoogleButton onClick={onsigninclick} />
    </main>
  );
}
