import { isProUser } from "@/s/q-user";
import getHost from "@/s/utils/get-host";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // while on CBT session, check if user has a plan, if not, redirect to /beta/join
  const { data } = await supabase.auth.getUser();

  const host = getHost(request);

  if (data.user && isProUser(data.user)) {
    return NextResponse.redirect(host + "/pricing");
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(host + "/library");
}
