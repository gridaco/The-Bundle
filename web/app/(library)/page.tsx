import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Packs, MaterialsNav } from "@/library";
import { isProUser } from "@/s/q-user";
import { DemoDownloadCard } from "@/components/demo-download-card";
import { ScrollToTop } from "@/components/scroll-to-top";
import Title from "@/library/title";
import Footer from "@/library/footer";
import { LibraryTab } from "@/library/tab";
import { ScrollArea } from "@radix-ui/themes";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/bundle/signin");
  }

  const pro = data.user && isProUser(data.user);

  return (
    <Layout>
      <main className="p-10 overflow-scroll">
        {!pro && (
          <div className="max-w-screen-md m-auto mt-24 mb-24 border border-opacity-10 border-white p-8 rounded-sm hover:border-opacity-20">
            <DemoDownloadCard />
          </div>
        )}
        <div className="mt-24">
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
    </Layout>
  );
}


function Layout({ children }: React.PropsWithChildren<{}>) {
  return <div className="flex flex-row">
    <div className="min-w-[240px] sticky max-w-xs border-r border-white/10 overflow-x-hidden">
      <ScrollArea>
        <div className="sticky top-40">
          <div className="flex flex-col items-center mt-10">
            <div className="max-w-screen-md">
              <MaterialsNav />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
    {children}
  </div>
}