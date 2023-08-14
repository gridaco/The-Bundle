import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { app_metadata_subscription_id } from "@/k/userkey";
import { NextResponse } from "next/server";
import { stripe } from "@/server/stripe";
import { createClient } from "@supabase/supabase-js";

const supbaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_SECRET!
);

export default async function handler(req, res) {
  const session_id = req.query.session_id;
  const supabase = createPagesServerClient({ req, res });

  // get subscription id with session id
  const session = await stripe.checkout.sessions.retrieve(session_id);
  const subscription_id = session.subscription;

  // update supabase user with subscription id
  const { data } = await supabase.auth.getUser(req.cookies["sb-access-token"]);
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

  const host = req.headers.host;
  const protocol = req.headers["x-forwarded-proto"];
  const baseurl = `${protocol}://${host}/lsd`;

  //
  const redirect = `${baseurl}/?return-reason=pro-activated`;

  res.status(302).setHeader("Location", redirect);

  res.end();
}
