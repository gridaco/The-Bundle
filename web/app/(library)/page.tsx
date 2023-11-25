
import { Packs, MaterialsNav } from "@/library";

import { ScrollToTop } from "@/components/scroll-to-top";
import Footer from "@/library/footer";
import { ScrollArea } from "@radix-ui/themes";
import { DemoDownloadCardIfNotPro } from "@/library/demo";
import React from "react";

export const dynamic = "force-dynamic";

export default function LibraryPage() {

  return (
    <Layout>
      <main className="relative p-10 flex flex-col">
        {/* <header className="sticky top-24 flex flex-col bg-black z-10">
          <div className='max-w-5xl'>
            <MaterialsNav />
          </div>
        </header> */}
        <div className="flex-1 h-auto">
          <div className="mt-24">
            <Packs />
          </div>
          <DemoDownloadCardIfNotPro />
          {/* scroll to top */}
          <div className="m-auto w-fit mt-40">
            <ScrollToTop />
          </div>
          <Footer />
        </div>
      </main>
    </Layout>
  );
}


function Layout({ children }: React.PropsWithChildren<{}>) {
  return <div className="flex flex-row">
    <Sidebar />
    {children}
  </div>
}


function Sidebar({ children }: React.PropsWithChildren<{}>) {
  return <div className="hidden md:block min-w-[200px] lg:min-w-[240px] sticky max-w-xs border-r border-white/10">
    {children}
  </div>
}