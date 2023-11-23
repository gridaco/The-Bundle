import React from "react";
import { createServerClient } from '@supabase/ssr'
import { redirect } from "next/navigation";
import { redirect_uri } from "@/s/q";
import { Metadata } from "next";
import { Content } from "@/library/d";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "My Library | The Bundle",
};

export default async function MyLibraryPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: _user } = await supabase.auth.getUser();
  const { user } = _user;

  if (!user) {
    redirect(
      redirect_uri.make("/bundle/signin", {
        redirect_uri: "/downloads",
      })!
    );
  }

  return (
    <main className="max-w-screen-xl content-center m-auto p-8 pt-20 md:p-24 md:pt-40">
      <h1 className="text-5xl lg:text-7xl font-bold">My Library</h1>
      <Content />
    </main>
  );
}
