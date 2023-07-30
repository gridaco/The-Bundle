import Stripe from "stripe";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  // get supabase user

  const supabase = createPagesServerClient({ req, res });
  const { data } = await supabase.auth.getUser(req.cookies["sb-access-token"]);

  const { user } = data;

  const { email, id, user_metadata } = user!;

  const { stripe_customer_id } = user_metadata;

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
    res.status(401).json("Unauthorized");
  }

  const price = req.query.price;
  const host = req.headers.host;
  const protocol = req.headers["x-forwarded-proto"];

  const baseurl = `${protocol}://${host}/lsd`;

  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      customer: customer_id,
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: price,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${baseurl}/?return-reason=pro-activated`,
      cancel_url: `${baseurl}/`,
    });
    res.redirect(303, session.url);
  } catch (err) {
    res.status(err.statusCode || 500).json(err.message);
  }
}

// async function create_checkout_session({ email }: { email: string }) {
//   const customer = await stripe.customers.create({
//     email,
//   });
//   const { id: customer_id } = customer;
//   const session = await stripe.checkout.sessions.create({
//     customer: customer_id,
//     payment_method_types: ["card"],
//     line_items: [
//       {
//         price: "",
//         quantity: 1,
//       },
//     ],
//     success_url: "https://example.com/success",
//   });

//   return session;
// }
