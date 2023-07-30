import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            // TODO: replace
            price: "price_1NZWzVAvR3geCh5rQ5Rl2w2t",
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/lsd/?success=true`,
        cancel_url: `${req.headers.origin}/lsd/?canceled=true`,
        automatic_tax: { enabled: true },
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
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
