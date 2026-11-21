import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { issueVerificationEmail } from "@/lib/email-verification";
import { rateLimit } from "@/lib/rate-limit";
import { ApiError, getClientIp, handleError } from "@/lib/http";
import { registerSchema } from "@/lib/validators";

export async function POST(req: Request) {
    try {
        await rateLimit(`register:${getClientIp(req)}`, 5, 600);

        const body = await req.json().catch(() => null);
        const { name, email, password } = registerSchema.parse(body);

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new ApiError(409, "An account with this email already exists", "EMAIL_TAKEN");
        }

        let user;
        try {
            user = await prisma.user.create({
                data: { name, email, passwordHash: await hashPassword(password) },
                select: { id: true, email: true, name: true, credits: true },
            });
        } catch (error) {
            // Do request ek saath aayen to unique constraint yahan pakadti hai
            if ((error as { code?: string }).code === "P2002") {
                throw new ApiError(409, "An account with this email already exists", "EMAIL_TAKEN");
            }
            throw error;
        }

        let emailSent = true;
        try {
            await issueVerificationEmail(user.id, user.email);
        } catch (error) {
            console.error("Verification email failed:", error);
            emailSent = false;
        }

        await createSession(user.id, req.headers.get("user-agent"));

        return NextResponse.json({ user, emailSent }, { status: 201 });
    } catch (error) {
        return handleError(error);
    }
}