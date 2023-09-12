import React from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Dela_Gothic_One } from "next/font/google";
import { Metadata } from "next";

const delta_gothic_one = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Welcome",
  description: "The Bundle by Grida",
  colorScheme: "dark",
  openGraph: {
    images: "https://grida.co/bundle/og-image.jpg",
  },
};

export default async function WelcomePage() {
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/bundle/signin");
  }

  const metadata = data.user.user_metadata;

  return (
    <main className="max-w-screen-lg m-auto p-8 pt-24 md:p-24">
      <h1 className="text-5xl lg:text-7xl text-center">
        <span className={delta_gothic_one.className}>The Bundle</span>
      </h1>
      <form
        className="flex flex-col gap-8 max-w-md m-auto mt-24 p-16"
        method="POST"
        action="/bundle/welcome/form"
      >
        <div>
          <label
            htmlFor="job-title"
            className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white"
          >
            Job / Title
          </label>
          <input
            id="job-title"
            name="job-title"
            type="text"
            className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Graphics Designer"
            required
            autoComplete="off"
            defaultValue={metadata?.job_title}
          />
        </div>
        <div>
          <label
            htmlFor="team-size"
            className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white"
          >
            Team Size
          </label>
          <input
            id="team-size"
            name="team-size"
            type="text"
            className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="1 ~ 3"
            required
            autoComplete="off"
            defaultValue={metadata?.team_size}
          />
        </div>
        <div>
          <label
            htmlFor="instagram"
            className="block mb-2 text-sm font-medium text-neutral-900 dark:text-white"
          >
            Instagram Account
          </label>
          <input
            id="instagram"
            name="instagram"
            type="text"
            className="bg-neutral-50 border border-neutral-300 text-neutral-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
