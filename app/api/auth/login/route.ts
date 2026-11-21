import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { ApiError, getClientIp, handleError } from "@/lib/http";
import { loginSchema } from "@/lib/validators";

// Email na milne par bhi hash check hota hai, taake response time se email ka pata na chale
const DUMMY_HASH = `scrypt$${"00".repeat(16)}$${"00".repeat(64)}`;

export async function POST(req: Request) {
    try {
        await rateLimit(`login:${getClientIp(req)}`, 10, 600);

        const body = await req.json().catch(() => null);
        const { email, password } = loginSchema.parse(body);

        const user = await prisma.user.findUnique({ where: { email } });
        const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

        if (!user || !valid) {
            throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
        }

        await createSession(user.id, req.headers.get("user-agent"));

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