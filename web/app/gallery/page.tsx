import { Dela_Gothic_One } from "next/font/google";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Gallery } from "@/library";
import { isProUser } from "@/s/q-user";
import { DemoDownloadCard } from "@/components/demo-download-card";
import { ScrollToTop } from "@/components/scroll-to-top";
import Footer from "@/components/footer";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

const delta_gothic_one = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Gallery | The Bundle",
};

export default async function LibraryPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase.auth.getUser();

  const pro = data.user && isProUser(data.user);

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
          {/* <div className="max-w-screen-md">
            <MaterialsNav />
          </div> */}
        </div>
      </div>
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
