import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { user_metadata_stripe_customer_id } from "@/k/userkey.json";
import { stripe } from "@/s/stripe";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getHost from "@/s/utils/get-host";
import { redirect_uri } from "@/s/q";

export async function GET(request: NextRequest) {
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
  const host = getHost(request);

  const { user } = data;

  if (!user) {
    return NextResponse.redirect(
      redirect_uri.make(host + "/signin", {
        redirect_uri: request.url,
      })!
    );
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
      success_url: `${host}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/`,
    });

    return NextResponse.redirect(session.url!);
  } catch (err: any) {
    return NextResponse.json(err.message, { status: err.statusCode || 500 });
  }
}
