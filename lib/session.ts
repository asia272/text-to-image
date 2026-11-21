import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateToken, hashToken } from "@/lib/crypto";

export const SESSION_COOKIE = "session";
const SESSION_DAYS = 30;

export async function createSession(userId: string, userAgent?: string | null) {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

    await prisma.session.create({
        data: {
            userId,
            tokenHash: hashToken(token),
            expiresAt,
            userAgent: userAgent?.slice(0, 255) ?? null,
        },
    });

    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
    });
}

export async function destroySession() {
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (token) {
        await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
    }
    jar.delete(SESSION_COOKIE);
}