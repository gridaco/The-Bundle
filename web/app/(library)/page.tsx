import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Packs, MaterialsNav } from "@/library";
import { isProUser } from "@/s/q-user";
import { DemoDownloadCard } from "@/components/demo-download-card";
import { ScrollToTop } from "@/components/scroll-to-top";
import Header from "@/library/header";
import Footer from "@/library/footer";
import { LibraryTab } from "@/library/tab";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/bundle/signin");
  }

  const pro = data.user && isProUser(data.user);

  return (
    <main className="max-w-screen-xl content-center m-auto p-24 pt-40">
      <Header />
      <div
        className="flex flex-col items-center mt-10"
        style={{
          // disabled for now
          display: "none",
        }}
      >
        <LibraryTab
          tabs={[
            { value: "materials", href: "/" },
            {
              value: "gallery",
              href: "/gallery",
            },
          ]}
          defaultValue="materials"
        />
      </div>
      <div className="sticky top-0 bg-transparent bg-opacity-5 backdrop-blur-xl z-10">
        <div className="flex flex-col items-center mt-10">
          <div className="max-w-screen-md">
            <MaterialsNav />
          </div>
        </div>
      </div>
      {!pro && (
        <div className="max-w-screen-md m-auto mt-24 mb-24 border border-opacity-10 border-white p-8 rounded-sm hover:border-opacity-20">
          <DemoDownloadCard />
        </div>
      )}
      <div className="max-w-screen-md m-auto mt-24">
        {/* <Gallery /> */}
        <Packs />
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
