import { env } from "@/lib/env";
import { ProviderError } from "@/lib/clipdrop";

export async function generateImage(prompt: string) {
    const res = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env("CLOUDFLARE_ACCOUNT_ID")}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env("CLOUDFLARE_API_TOKEN")}`,
                "content-type": "application/json",
            },
            body: JSON.stringify({ prompt, steps: 4 }),
            signal: AbortSignal.timeout(60_000),
        },
    );

    if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new ProviderError(res.status, detail.slice(0, 300));
    }

    const data = (await res.json()) as { result?: { image?: string } };
    const base64 = data.result?.image;
    if (!base64) throw new ProviderError(502, "Cloudflare returned no image");

    const bytes = Uint8Array.from(Buffer.from(base64, "base64"));
    // PNG ki pehchan 0x89, warna JPEG
    const contentType = bytes[0] === 0x89 ? "image/png" : "image/jpeg";

    return {
        image: bytes.buffer as ArrayBuffer,
        contentType,
        providerCreditsLeft: null as number | null,
    };
}