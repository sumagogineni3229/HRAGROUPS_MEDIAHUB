import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_API_KEY || "sk_test_dummy_key_for_build";

export const stripe = new Stripe(stripeApiKey, {
  // @ts-ignore - Stripe version compatibility configuration
  apiVersion: "2022-11-15",
  typescript: true,
});
