import { isUserWelcomeFormRequired } from "@/s/q-user";
import getHost from "@/s/utils/get-host";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { redirect_uri } from "@/s/q";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const host = getHost(request);
  const supabase = createRouteHandlerClient({ cookies });

  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else {
    return NextResponse.redirect(host + "/signin");
  }

  const { data } = await supabase.auth.getUser();

  const _redirect_uri = redirect_uri.parse(request.nextUrl.searchParams);

  // force onboarding flow
  if (isUserWelcomeFormRequired(data.user!!)) {
    return NextResponse.redirect(
      redirect_uri
        .make(host + "/welcome", {
          redirect_uri: _redirect_uri,
        })!
        .toString()
    );
  }

  if (_redirect_uri) {
    return NextResponse.redirect(
      redirect_uri.abs({
        host,
        redirect_uri: _redirect_uri,
      })
    );
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(host + "/library");
}
