
import { Packs, MaterialsNav } from "@/library";

import { ScrollToTop } from "@/components/scroll-to-top";
import Footer from "@/library/footer";
import { ScrollArea } from "@radix-ui/themes";
import { DemoDownloadCardIfNotPro } from "@/library/demo";

export const dynamic = "force-dynamic";

export default function LibraryPage() {

  return (
    <Layout>
      <main className="p-10 overflow-scroll">
        <div className="mt-24">
          <Packs />
        </div>
        <DemoDownloadCardIfNotPro />
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