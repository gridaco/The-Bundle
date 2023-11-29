
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Packs } from "@/library";
import { ScrollToTop } from "@/components/scroll-to-top";
import Footer from "@/library/footer";
import { DemoDownloadCardIfNotPro } from "@/library/demo";
import bundle from "@/k/bundle.json";

// @ts-ignore
const material_keys: (keyof typeof bundle.materials)[] = Object.keys(bundle.materials);

export const dynamic = "force-dynamic";

export default function LibraryPage() {

  return (
    <Layout>
      <main className="relative p-10 flex flex-col overflow-y-scroll mt-24">
        <div className="flex-1 h-auto">
          <Packs />
          <DemoDownloadCardIfNotPro />
          <Footer />
        </div>
      </main>
    </Layout>
  );
}


function Layout({ children }: React.PropsWithChildren<{}>) {
  return <div className="flex flex-row w-screen h-screen">
    <Sidebar >
      <div className="p-2 flex flex-col gap-1 mt-24">
        {material_keys.map((m, i) => (
          <Link href={`#${m}`} key={i}>
            <div className="flex flex-row items-center gap-4 px-2 py-1 hover:bg-gray-100/10 rounded">
              <Image
                className="w-16 h-16"
                src={`/bundle/icons/${m}.png`}
                width={100}
                height={100}
                alt={m}
              />
              <span className="text-sm opacity-80">{(bundle.materials)[m].name}</span>
            </div>
          </Link>
        ))}
      </div>

    </Sidebar>
    {children}
  </div>
}


function Sidebar({ children }: React.PropsWithChildren<{}>) {
  return <div className="hidden md:block min-w-[200px] lg:min-w-[240px] sticky max-w-xs border-r border-white/10 overflow-y-scroll">
    {children}
  </div>
}