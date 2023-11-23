import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getHost from "@/s/utils/get-host";
import { redirect_uri } from "@/s/q";

export async function POST(request: NextRequest) {
  const host = getHost(request);
  const _redirect_uri = redirect_uri.parse(request.nextUrl.searchParams);

  // get form data
  const body = await request.formData();
  const instagram = body.get("instagram") as string;
  const instagram_username = parseInstagramUsername(instagram);

  const job_title = body.get("job-title") as string;
  const team_size = body.get("team-size") as string;

  // get supabase user
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

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.redirect(
      redirect_uri.make(host + "/signin", {
        redirect_uri: _redirect_uri,
      })!,
      {
        status: 301,
      }
    );
  }

  const { data: updaed } = await supabase.auth.updateUser({
    data: {
      instagram_username,
      job_title,
      team_size,
    },
  });

  console.log("user metadata updated", updaed.user?.user_metadata);

  if (_redirect_uri) {
    return NextResponse.redirect(
      redirect_uri.abs({
        host,
        redirect_uri: _redirect_uri,
      }),
      {
        status: 301,
      }
    );
  }

  return NextResponse.redirect(host + "/", {
    // Returning a 301 status redirects from a POST to a GET route
    status: 301,
  });
}

function parseInstagramUsername(txt: string) {
  // remove @
  txt = txt.replace("@", "");

  // check if url
  try {
    const url = new URL(txt);
    if (url.hostname === "instagram.com") {
      return url.pathname.replace("/", "");
    }
  } catch {
    // not a url
    return txt;
  }
}
