import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getHost from "@/s/utils/get-host";

export async function POST(request: NextRequest) {
  const host = getHost(request);

  // get form data
  const body = await request.formData();
  const instagram = body.get("instagram") as string;
  const instagram_username = parseInstagramUsername(instagram);

  const job_title = body.get("job-title") as string;
  const team_size = body.get("team-size") as string;

  // get supabase user
  const supabase = createRouteHandlerClient({ cookies });
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.redirect(host + "/signin");
  }

  const { data: updaed } = await supabase.auth.updateUser({
    data: {
      instagram_username,
      job_title,
      team_size,
    },
  });

  console.log("user metadata updated", updaed.user?.user_metadata);

  return NextResponse.redirect(host + "/library", {
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
