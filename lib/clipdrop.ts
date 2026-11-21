import { env } from "@/lib/env";

export class ProviderError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
    }
}

export async function generateImage(prompt: string) {
    const form = new FormData();
    form.append("prompt", prompt);

    const res = await fetch("https://clipdrop-api.co/text-to-image/v1", {
        method: "POST",
        headers: { "x-api-key": env("CLIPDROP_API_KEY") },
        body: form,
        signal: AbortSignal.timeout(60_000),
    });

    if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new ProviderError(res.status, detail.slice(0, 300));
    }

    const remaining = res.headers.get("x-remaining-credits");
    return {
        image: await res.arrayBuffer(),
        providerCreditsLeft: remaining ? Number(remaining) : null,
    };
}