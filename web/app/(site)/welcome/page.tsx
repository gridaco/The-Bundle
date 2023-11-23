import React from "react";
import { createServerClient } from '@supabase/ssr'
import { cookies } from "next/headers";
import { redirect, useSearchParams } from "next/navigation";
import { Dela_Gothic_One } from "next/font/google";
import { Metadata } from "next";
import { redirect_uri } from "@/s/q";

export const dynamic = "force-dynamic";

const delta_gothic_one = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Welcome",
};

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: ReturnType<typeof useSearchParams>;
}) {
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


  const _redirect_uri = redirect_uri.parse(searchParams);
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect(
      redirect_uri.make("/bundle/signin", {
        redirect_uri: _redirect_uri,
      })!
    );
  }

  const metadata = data.user.user_metadata;
  const formurl = redirect_uri.make("/bundle/welcome/form", {
    redirect_uri: _redirect_uri,
  });

  return (
    <main className="max-w-screen-lg m-auto p-8 pt-24 md:p-24 md:pt-40">
      <h1 className="text-5xl text-center">
        <span className={delta_gothic_one.className}>The Bundle</span>
      </h1>
      <div className="h-10" />
      <form
        className="flex flex-col gap-8 max-w-md m-auto p-2 sm:p-16"
        method="POST"
        action={formurl}
      >
        <div>
          <label
            htmlFor="job-title"
            className="block mb-2 text-sm font-medium text-white"
          >
            Job / Title
          </label>
          <input
            id="job-title"
            name="job-title"
            type="text"
            className="text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Graphics Designer"
            required
            autoComplete="off"
            defaultValue={metadata?.job_title}
          />
        </div>
        <div>
          <label
            htmlFor="team-size"
            className="block mb-2 text-sm font-medium text-white"
          >
            Team Size
          </label>
          <input
            id="team-size"
            name="team-size"
            type="text"
            className="text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="1 ~ 3"
            required
            autoComplete="off"
            defaultValue={metadata?.team_size}
          />
        </div>
        <div>
          <label
            htmlFor="instagram"
            className="block mb-2 text-sm font-medium text-white"
          >
            Instagram Account
          </label>
          <input
            id="instagram"
            name="instagram"
            type="text"
            className="text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-neutral-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="@grida.co"
            required
            autoComplete="off"
            defaultValue={
              metadata?.instagram_username
                ? `@${metadata.instagram_username}`
                : ""
            }
          />
          <p className="block mt-2 text-sm opacity-60">
            Either your personal account or your company&apos;s account
          </p>
        </div>
        <hr className="opacity-5" />
        <div>
          <button
            type="submit"
            className="bg-white hover:bg-white-600 text-black rounded-lg w-full p-2.5"
          >
            Continue
          </button>
        </div>
      </form>
    </main>
  );
}
