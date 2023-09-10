import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { user_metadata_stripe_customer_id } from "@/k/userkey.json";
import { stripe } from "@/s/stripe";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getHost from "@/s/utils/get-host";

export async function GET(request: NextRequest) {
  // get supabase user

  const supabase = createRouteHandlerClient({ cookies });
  const { data } = await supabase.auth.getUser();

  const { user } = data;

  if (!user) {
    const host = getHost(request);
    return NextResponse.redirect(host + "/signin");
  }

  const { email, id, user_metadata } = user!;

  const stripe_customer_id = user_metadata[user_metadata_stripe_customer_id];

  let customer_id = stripe_customer_id;

  if (!stripe_customer_id) {
    // create stripe customer
    const customer = await stripe.customers.create({
      email,
    });

    console.log("new stripe customer created", customer);

    // update user identity with stripe customer id
    await supabase.auth.updateUser({
      data: {
        stripe_customer_id: customer.id,
      },
    });

    customer_id = customer.id;
  } else {
    console.log("customer already exists", stripe_customer_id);
  }

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const price = request.nextUrl.searchParams.get("price");

  if (!price) {
    return NextResponse.json({ error: "price is required" }, { status: 400 });
  }

  const baseurl =
    process.env.NODE_ENV === "production"
      ? "https://grida.co/bundle"
      : `${request.nextUrl.protocol}//${request.nextUrl.host}/bundle`;

  try {
    // Create Checkout Sessions from body params.
    // - enable promotion codes
    // - 3 day trial
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: price,
          quantity: 1,
        },
      ],
      // enable promotion codes
      allow_promotion_codes: true,
      mode: "subscription",
      success_url: `${baseurl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseurl}/`,
    });

    return NextResponse.redirect(session.url!);
  } catch (err: any) {
    return NextResponse.json(err.message, { status: err.statusCode || 500 });
  }
}
