import { createServerClient } from '@supabase/ssr'
import { cookies } from "next/headers";
import { Gallery } from "@/library";
import { isProUser } from "@/s/q-user";
import { DemoDownloadCard } from "@/components/demo-download-card";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Metadata } from "next";
import Footer from "@/library/footer";
import Title from "@/library/title";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery | The Bundle",
};

export default async function LibraryPage() {
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


  const { data } = await supabase.auth.getUser();

  const pro = data.user && isProUser(data.user);

  return (
    <main className="max-w-screen-xl content-center m-auto p-24 pt-40">
      <Title />
      {!pro && (
        <div className="max-w-screen-md m-auto mt-24 mb-24 border border-opacity-10 border-white p-8 rounded-sm hover:border-opacity-20">
          <DemoDownloadCard />
        </div>
      )}
      <div className="max-w-screen-md m-auto mt-24">
        <Gallery />
      </div>
      {!pro && (
        <div className="max-w-screen-md m-auto mt-24 mb-24 border border-opacity-10 border-white p-8 rounded-sm hover:border-opacity-20">
          <DemoDownloadCard />
        </div>
      )}
      {/* scroll to top */}
      <div className="m-auto w-fit mt-40">
        <ScrollToTop />
      </div>
      <Footer />
    </main>
  );
}
