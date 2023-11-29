'use client'
import { createBrowserClient } from '@supabase/ssr'
import { isProUser } from "@/s/q-user";
import { DemoDownloadCard } from "@/components/demo-download-card";
import { useUser } from '@/hooks/useUser';


export function DemoDownloadCardIfNotPro() {
  const { isPro } = useUser();

  return <>
    {!isPro && (
      <div className="max-w-screen-md m-auto mt-24 mb-24 border border-opacity-10 border-white p-8 rounded-sm hover:border-opacity-20">
        <DemoDownloadCard />
      </div>
    )}
  </>
}