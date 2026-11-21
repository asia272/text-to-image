import { prisma } from "@/lib/prisma";
import { generateToken, hashToken } from "@/lib/crypto";
import { sendVerificationEmail } from "@/lib/mail";

// Purane unused token hata kar naya token banata hai aur email bhejta hai
export async function issueVerificationEmail(userId: string, email: string) {
    await prisma.emailToken.deleteMany({
        where: { userId, type: "VERIFY_EMAIL", usedAt: null },
    });

    const token = generateToken();
    await prisma.emailToken.create({
        data: {
            userId,
            type: "VERIFY_EMAIL",
            tokenHash: hashToken(token),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    });

    await sendVerificationEmail(email, token);
}