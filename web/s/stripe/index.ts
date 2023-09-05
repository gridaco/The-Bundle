import Stripe from "stripe";

const STRIPE_SECRET_KEY_TEST = process.env.STRIPE_SECRET_KEY;
const STRIPE_SECRET_KEY_LIVE = process.env.STRIPE_SECRET_KEY_LIVE;
const STRIPE_SECRET_KEY =
  process.env.NODE_ENV === "production"
    ? STRIPE_SECRET_KEY_LIVE
    : STRIPE_SECRET_KEY_TEST;

export const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});
