import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { app_metadata_subscription_id } from "@/k/userkey.json";
import { generateSignedDownloadLink } from "@/s/stripe/s3";

export async function GET(request: NextRequest) {
  // sign s3 url if user is signed in as a pro user
  const bucket = "the-bundle-dist";
  const key = "v1/bin/cmp.gold-foil/99.zip"; // TODO: replace this
  const signedUrl = await generateSignedDownloadLink(bucket, key);

  return NextResponse.redirect(signedUrl);
}
