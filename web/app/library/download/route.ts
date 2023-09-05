import { NextRequest, NextResponse } from "next/server";
import { generateSignedDownloadLink } from "@/s/stripe/s3";

export async function GET(request: NextRequest) {
  // sign s3 url if user is signed in as a pro user
  const bucket = "the-bundle-dist";
  const item = request.nextUrl.searchParams.get("item");

  if (!item) return NextResponse.error();

  const signedUrl = await generateSignedDownloadLink(bucket, item);

  return NextResponse.redirect(signedUrl);
}
