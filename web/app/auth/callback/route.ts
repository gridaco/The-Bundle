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

  const host = getHost(request);

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(host + "/library");
}
