import { app_metadata_subscription_id } from "@/k/userkey.json";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // while on CBT session, check if user has a plan, if not, redirect to /beta/join
  const { data: user } = await supabase.auth.getUser();

  const host =
    process.env.NODE_ENV === "production"
      ? "https://grida.co/bundle"
      : requestUrl.origin + "/bundle";

  if (user.user?.app_metadata) {
    if (!user.user.app_metadata[app_metadata_subscription_id]) {
      return NextResponse.redirect(host + "/pricing");
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(host + "/library");
}
