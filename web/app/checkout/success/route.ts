import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { app_metadata_subscription_id } from "@/k/userkey.json";
import { stripe } from "@/s/stripe";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import getHost from "@/s/utils/get-host";

const supbaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const session_id = request.nextUrl.searchParams.get("session_id");
  if (!session_id) {
    // TODO: redirect to error page
    return NextResponse.redirect("/");
  }

  const supabase = createRouteHandlerClient({ cookies });

  // get subscription id with session id
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const subscription_id = session.subscription;

  // update supabase user with subscription id
  const { data } = await supabase.auth.getUser();
  const { user } = data;
  const { id } = user!;

  console.log("payment success");
  console.log("subscription_id", subscription_id);

  // update user app_metadata
  const { error } = await supbaseAdmin.auth.admin.updateUserById(id, {
    app_metadata: { [app_metadata_subscription_id]: subscription_id },
  });
  if (error) {
    throw error;
  }

  // once updated, refresh session
  await supabase.auth.refreshSession();

  const host = getHost(request);

  // - TODO: the pro-activated is not being handled on the receiving page
  const redirect = `${host}/library?return-reason=pro-activated`;

  return NextResponse.redirect(redirect);
}
