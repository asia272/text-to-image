import Stripe from "stripe";
import { env } from "@/lib/env";

let client: Stripe | null = null;

export function getStripe() {
    return (client ??= new Stripe(env("STRIPE_SECRET_KEY")));
}