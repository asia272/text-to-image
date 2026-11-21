import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { issueVerificationEmail } from "@/lib/email-verification";
import { rateLimit } from "@/lib/rate-limit";
import { ApiError, handleError } from "@/lib/http";

export async function POST() {
    try {
        const user = await requireUser();
        if (user.emailVerifiedAt) {
            throw new ApiError(400, "Your email is already verified", "ALREADY_VERIFIED");
        }

        await rateLimit(`resend:${user.id}`, 3, 600);
        await issueVerificationEmail(user.id, user.email);

        return NextResponse.json({ ok: true });
    } catch (error) {
        return handleError(error);
    }
}