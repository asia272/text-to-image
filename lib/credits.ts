import { prisma } from "@/lib/prisma";

// Atomic: do request ek saath aayen to bhi credit minus mein nahi jata
export async function takeCredit(userId: string): Promise<boolean> {
    const result = await prisma.user.updateMany({
        where: { id: userId, credits: { gt: 0 } },
        data: { credits: { decrement: 1 } },
    });
    return result.count === 1;
}

export async function refundCredit(userId: string) {
    await prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: 1 } },
    });
}