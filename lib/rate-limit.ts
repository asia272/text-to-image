import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/http";

export async function rateLimit(key: string, limit: number, windowSeconds: number) {
    const since = new Date(Date.now() - windowSeconds * 1000);
    const count = await prisma.rateLimitHit.count({ where: { key, createdAt: { gte: since } } });

    if (count >= limit) {
        throw new ApiError(429, "Too many requests. Please try again in a minute.", "RATE_LIMITED");
    }

    await prisma.rateLimitHit.create({ data: { key } });

    //Occasionally clean up old data
    if (Math.random() < 0.01) {
        await prisma.rateLimitHit.deleteMany({
            where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
        });
    }
}