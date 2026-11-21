// Pricing page Figma jaisa. Price hamesha server se, client se kabhi nahi.
export const PACKS = [
    { id: "basic", name: "Basic", description: "Best for personal use.", credits: 100, priceCents: 1000 },
    { id: "advanced", name: "Advanced", description: "Best for business use.", credits: 500, priceCents: 5000 },
    { id: "business", name: "Business", description: "Best for enterprise use.", credits: 5000, priceCents: 25000 },
] as const;

export function getPack(id: string) {
    return PACKS.find((pack) => pack.id === id);
}