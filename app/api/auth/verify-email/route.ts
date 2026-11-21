import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/crypto";
import { ApiError, handleError } from "@/lib/http";
import { verifyEmailSchema } from "@/lib/validators";

// POST istemal karte hain (GET nahi), taake email scanners link khol kar token use na kar den
export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);
        const { token } = verifyEmailSchema.parse(body);

        const record = await prisma.emailToken.findUnique({
            where: { tokenHash: hashToken(token) },
        });

        if (
            !record ||
            record.type !== "VERIFY_EMAIL" ||
            record.usedAt ||
            record.expiresAt < new Date()
        ) {
            throw new ApiError(400, "This link is invalid or has expired", "INVALID_TOKEN");
        }

        await prisma.$transaction(async (tx) => {
            const claimed = await tx.emailToken.updateMany({
                where: { id: record.id, usedAt: null },
                data: { usedAt: new Date() },
            });
            if (claimed.count === 0) {
                throw new ApiError(400, "This link is invalid or has expired", "INVALID_TOKEN");
            }
            await tx.user.update({
                where: { id: record.userId },
                data: { emailVerifiedAt: new Date() },
            });
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        return handleError(error);
    }
}