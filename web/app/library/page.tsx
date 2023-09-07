import { Dela_Gothic_One } from "next/font/google";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { app_metadata_subscription_id } from "@/k/userkey.json";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Content, LibraryTab } from "@/library/tab";
import { Tabs } from "@radix-ui/themes";
import { Gallery, Packs, MaterialsNav } from "@/library";
import Link from "next/link";
import Image from "next/image";
export const dynamic = "force-dynamic";

const delta_gothic_one = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default async function LibraryPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase.auth.getUser();
  const pro = data.user?.app_metadata[app_metadata_subscription_id];

  if (!pro) {
    redirect("/bundle/signin");
  }

  return (
    <main className="max-w-screen-xl content-center m-auto p-24 pt-64">
      <header className="flex flex-col items-center justify-center h-full mb-20">
        <h1 className="text-5xl lg:text-7xl">
          <span className={delta_gothic_one.className}>The Bundle</span>
        </h1>
      </header>
      <div className="sticky top-0 bg-transparent bg-opacity-5 backdrop-blur-xl z-10">
        <div className="flex flex-col items-center mt-10">
          {/* <LibraryTab
            tabs={["materials", "gallary"]}
            defaultValue="materials"
          ></LibraryTab> */}
          <div className="max-w-screen-md overflow-x-scroll overflow-y-hidden no-scrollbar">
            <MaterialsNav />
          </div>
        </div>
      </div>
      <div className="max-w-screen-md m-auto mt-24">
        {/* <Gallery /> */}
        <Packs />
      </div>
      <footer className="p-4 pt-40 flex flex-col items-center justify-center text-center">
        <p className="opacity-50 text-xs leading-tight">
          The Bundle by Grida -<br />© {new Date().getFullYear()} Grida, Inc.
          All Rights Reserved.
        </p>
        <Link href="https://instagram.com/grida.co">
          <div className="mt-4">
            <Image
              src="/bundle/grida.svg"
              alt="Grida Logo"
              width={20}
              height={20}
            />
          </div>
        </Link>
      </footer>
    </main>
  );
}

// function
