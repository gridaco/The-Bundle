import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { generateSignedDownloadLink } from "@/s/stripe/s3";
import { cookies } from "next/headers";
import { isProUser } from "@/s/q-user";

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  // sign s3 url if user is signed in as a pro user
  const bucket = "the-bundle-dist";
  const item = request.nextUrl.searchParams.get("item");
  const { data } = await supabase.auth.getUser();

  if (!item || !data.user) return NextResponse.error();

  if (item.toLowerCase().includes("demo")) {
    // pass
  } else {
    // if not demo, double check if pro user
    if (!isProUser(data.user)) {
      return NextResponse.error();
    }
  }

  const signedUrl = await generateSignedDownloadLink(bucket, item);

  return NextResponse.redirect(signedUrl);
}
