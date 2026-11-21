import { prisma } from "@/lib/prisma";
import { requireVerifiedUser } from "@/lib/auth";
import { takeCredit, refundCredit } from "@/lib/credits";
import { generateImage } from "@/lib/image-provider";
import { rateLimit } from "@/lib/rate-limit";
import { ApiError, handleError } from "@/lib/http";
import { generateSchema } from "@/lib/validators";

export async function POST(req: Request) {
    try {
        const user = await requireVerifiedUser();
        await rateLimit(`generate:${user.id}`, 6, 60);

        const body = await req.json().catch(() => null);
        const { prompt } = generateSchema.parse(body);

        // Credit pehle kaato (atomic). 0 hon to frontend 402 dekh kar /pricing par bhejega.
        const taken = await takeCredit(user.id);
        if (!taken) {
            throw new ApiError(402, "You have no credits left. Please buy more.", "NO_CREDITS");
        }

        let result;
        try {
            result = await generateImage(prompt);
        } catch (error) {
            // Generate fail hua: credit wapas, aur failure ka record
            await refundCredit(user.id);
            const message = error instanceof Error ? error.message : "Unknown error";
            await prisma.imageJob.create({
                data: { userId: user.id, prompt, status: "FAILED", errorMessage: message.slice(0, 300) },
            });
            console.error("Image generation failed:", error);
            throw new ApiError(
                502,
                "Image generation failed. Your credit was refunded. Please try again.",
                "GENERATION_FAILED",
            );
        }

        await prisma.imageJob.create({
            data: { userId: user.id, prompt, status: "SUCCESS", provider: result.provider },
        });

        if (result.providerCreditsLeft !== null && result.providerCreditsLeft < 10) {
            console.warn(`${result.provider} credits running low: ${result.providerCreditsLeft} left`);
        }

        const fresh = await prisma.user.findUnique({
            where: { id: user.id },
            select: { credits: true },
        });

        return new Response(result.image, {
            headers: {
                "content-type": result.contentType,
                "cache-control": "no-store",
                "x-credits-left": String(fresh?.credits ?? 0),
            },
        });
    } catch (error) {
        return handleError(error);
    }
}