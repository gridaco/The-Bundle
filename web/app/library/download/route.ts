import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { app_metadata_subscription_id } from "@/k/userkey.json";

export async function GET(request: NextRequest) {
  // sign s3 url if user is signed in as a pro user
}
