import { cache } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/crypto";
import { SESSION_COOKIE } from "@/lib/session";
import { ApiError } from "@/lib/http";

export const getCurrentUser = cache(async () => {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const session = await prisma.session.findUnique({
        where: { tokenHash: hashToken(token) },
        include: {
            user: {
                select: { id: true, email: true, name: true, credits: true, emailVerifiedAt: true },
            },
        },
    });

    if (!session || session.expiresAt < new Date()) return null;
    return session.user;
});

export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) throw new ApiError(401, "Please sign in", "UNAUTHORIZED");
    return user;
}

export async function requireVerifiedUser() {
    const user = await requireUser();
    if (!user.emailVerifiedAt) {
        throw new ApiError(403, "Please verify your email first", "EMAIL_NOT_VERIFIED");
    }
    return user;
}