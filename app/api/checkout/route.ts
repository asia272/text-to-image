import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { getPack } from "@/lib/packs";
import { env } from "@/lib/env";
import { ApiError, handleError } from "@/lib/http";
import { checkoutSchema } from "@/lib/validators";

export async function POST(req: Request) {
    try {
        const user = await requireUser();

        const body = await req.json().catch(() => null);
        const { packId } = checkoutSchema.parse(body);

        // Price hamesha server se, client se kabhi nahi
        const pack = getPack(packId);
        if (!pack) throw new ApiError(400, "Unknown credit pack", "INVALID_PACK");

        const appUrl = env("NEXT_PUBLIC_APP_URL");

        const session = await getStripe().checkout.sessions.create({
            mode: "payment",
            customer_email: user.email,
            client_reference_id: user.id,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "usd",
                        unit_amount: pack.priceCents,
                        product_data: { name: `${pack.name} - ${pack.credits} credits` },
                    },
                },
            ],
            metadata: { userId: user.id, packId: pack.id },
            success_url: `${appUrl}/pricing?payment=success`,
            cancel_url: `${appUrl}/pricing?payment=cancelled`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        return handleError(error);
    }
}