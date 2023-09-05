import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { app_metadata_subscription_id } from "@/k/userkey.json";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import list from "@/k/bundle.json";

export default async function LibraryPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase.auth.getUser();
  const pro = data.user?.app_metadata[app_metadata_subscription_id];

  if (!pro) {
    redirect("/bundle");
  }

  return (
    <div className="max-w-xl flex flex-col gap-4 p-24">
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
  );
}
