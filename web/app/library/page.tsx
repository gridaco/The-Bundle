import Link from "next/link";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { app_metadata_subscription_id } from "@/k/userkey.json";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LibraryPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase.auth.getUser();
  const pro = data.user?.app_metadata[app_metadata_subscription_id];

  if (!pro) {
    redirect("/bundle");
  }

  return (
    <>
      <Link
        href="/library/download?item=m.copper-a.zip"
        download
        target="_blank"
      >
        <button>Download Copper-A</button>
      </Link>
    </>
  );
}
