import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ user: null });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                credits: user.credits,
                emailVerified: Boolean(user.emailVerifiedAt),
            },
        });
    } catch (error) {
        return handleError(error);
    }
}