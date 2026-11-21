import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getPack } from "@/lib/packs";
import { env } from "@/lib/env";

export async function POST(req: Request) {
    const signature = req.headers.get("stripe-signature");
    if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

    // Signature check ke liye raw text chahiye, json nahi
    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
        event = getStripe().webhooks.constructEvent(rawBody, signature, env("STRIPE_WEBHOOK_SECRET"));
    } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (
        event.type !== "checkout.session.completed" &&
        event.type !== "checkout.session.async_payment_succeeded"
    ) {
        return NextResponse.json({ received: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true });
    }

    const userId = session.client_reference_id ?? session.metadata?.userId;
    const pack = getPack(session.metadata?.packId ?? "");
    if (!userId || !pack) {
        console.error("Stripe webhook: missing user or pack", session.id);
        return NextResponse.json({ received: true });
    }

    try {
        // Ek transaction: event record + purchase record + credits. Teeno ya koi nahi.
        await prisma.$transaction([
            prisma.stripeEvent.create({ data: { id: event.id, type: event.type } }),
            prisma.creditPurchase.create({
                data: {
                    userId,
                    stripeSessionId: session.id,
                    packId: pack.id,
                    credits: pack.credits,
                    amountCents: session.amount_total ?? pack.priceCents,
                },
            }),
            prisma.user.update({
                where: { id: userId },
                data: { credits: { increment: pack.credits } },
            }),
        ]);
    } catch (error) {
        // Unique constraint: yeh event ya session pehle process ho chuka, dobara credits nahi dene
        if ((error as { code?: string }).code === "P2002") {
            return NextResponse.json({ received: true, duplicate: true });
        }
        console.error("Stripe webhook failed:", error);
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}