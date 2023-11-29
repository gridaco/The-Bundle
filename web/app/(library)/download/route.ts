import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { generateSignedDownloadLink } from "@/s/stripe/s3";
import { cookies } from "next/headers";
import { isProUser } from "@/s/q-user";
import getHost from "@/s/utils/get-host";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  // sign s3 url if user is signed in as a pro user
  const bucket = "the-bundle-dist";
  const item = request.nextUrl.searchParams.get("item");
  const host = getHost(request);
  const { data } = await supabase.auth.getUser();

  // TODO: add redirect to the origin page
  // const origin = request.headers.get('origin')

  if (!item || !data.user) return NextResponse.redirect(host + "/signin");

  if (item.toLowerCase().includes("demo")) {
    // pass
  } else {
    // if not demo, double check if pro user
    if (!isProUser(data.user)) {
      // redirect to pro page
      return NextResponse.redirect(host + "/pro");
    }
  }

  const signedUrl = await generateSignedDownloadLink(bucket, item);

  return NextResponse.redirect(signedUrl);
}
