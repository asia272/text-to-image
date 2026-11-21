import { generateImage as clipdrop } from "@/lib/clipdrop";
import { generateImage as cloudflare } from "@/lib/cloudflare";

export type ImageResult = {
    image: ArrayBuffer;
    contentType: string;
    providerCreditsLeft: number | null;
    provider: string;
};

// .env mein IMAGE_PROVIDER=cloudflare ya clipdrop likh kar provider badal sakte hain
export async function generateImage(prompt: string): Promise<ImageResult> {
    if (process.env.IMAGE_PROVIDER === "clipdrop") {
        const result = await clipdrop(prompt);
        return { ...result, contentType: "image/png", provider: "clipdrop" };
    }
    const result = await cloudflare(prompt);
    return { ...result, provider: "cloudflare" };
}