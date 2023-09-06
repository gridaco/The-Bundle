import Link from "next/link";
import { Dela_Gothic_One } from "next/font/google";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { app_metadata_subscription_id } from "@/k/userkey.json";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import list from "@/k/bundle.json";
import Image from "next/image";
import { Content, LibraryTab } from "@/library/tab";
import { Tabs } from "@radix-ui/themes";

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
      <header className="flex flex-col items-center justify-center h-full ">
        <h1 className="text-5xl lg:text-7xl">
          <span className={delta_gothic_one.className}>The Bundle</span>
        </h1>
      </header>
      <div className="sticky top-0 bg-transparent bg-opacity-5 backdrop-blur-xl">
        <div className="flex flex-col items-center mt-10">
          <LibraryTab
            tabs={["materials", "gallary"]}
            defaultValue="materials"
          ></LibraryTab>
          <div className="max-w-screen-lg overflow-x-scroll no-scrollbar">
            <MaterialsNav />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-10">
        {list.map((item, i) => (
          <Link
            key={i}
            href={`/library/download?item=${item}`}
            download
            target="_blank"
          >
            <button>{item}</button>
          </Link>
        ))}
      </div>
      <footer></footer>
    </main>
  );
}

function MaterialsNav() {
  return (
    <div className="flex flex-row gap-4 w-fit">
      {[
        "cmp.aluminium-foil",
        "cmp.battered",
        "cmp.clay",
        "cmp.frosted-dispersion-glass",
        "cmp.frosted-glass",
        "cmp.glass",
        "cmp.gold-foil",
        "cmp.marble",
        "cmp.plastic",
        "cmp.subtle-imperfections",
        "m.blob",
        "m.chrome",
        "m.cloudy",
        "m.copper",
        "m.gold",
        "m.hologram",
        "m.silver",
        "p.reflective",
        "p.rough",
        "sss",
      ].map((m, i) => (
        <div key={i} className="select-none w-20 h-20">
          <Image
            src={`/bundle/icons/${m}.png`}
            width={100}
            height={100}
            alt={m}
          />
        </div>
      ))}
    </div>
  );
}
