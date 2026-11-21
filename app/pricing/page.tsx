"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { ASSETS } from "@/lib/assets";
import { PACKS } from "@/lib/packs";

type Notice = { type: "success" | "error" | "info"; text: string };

const noticeStyle = {
    success: "border-green-300 bg-green-50 text-green-800",
    error: "border-red-300 bg-red-50 text-red-700",
    info: "border-neutral-300 bg-white text-neutral-700",
};

export default function PricingPage() {
    const { user, openLogin, refresh } = useAuth();
    const [busyId, setBusyId] = useState<string | null>(null);
    const [notice, setNotice] = useState<Notice | null>(null);

    useEffect(() => {
        const payment = new URLSearchParams(window.location.search).get("payment");
        if (payment === "cancelled") {
            setNotice({ type: "info", text: "Payment cancelled. No money was charged." });
            return;
        }
        if (payment === "success") {
            setNotice({ type: "success", text: "Payment received! Your credits will appear in a few seconds." });
            // Webhook mein thori der lag sakti hai, isliye kuch baar credits dobara check karte hain
            let tries = 0;
            refresh();
            const id = setInterval(() => {
                tries += 1;
                refresh();
                if (tries >= 5) clearInterval(id);
            }, 2000);
            return () => clearInterval(id);
        }
    }, [refresh]);

    async function buy(packId: string) {
        if (!user) {
            openLogin({ redirectTo: "/pricing" });
            return;
        }
        setBusyId(packId);
        setNotice(null);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ packId }),
            });
            const data = await res.json().catch(() => ({}));
            if (res.ok && data.url) {
                window.location.href = data.url;
                return;
            }
            setNotice({ type: "error", text: data.error ?? "Could not start checkout. Please try again." });
        } catch {
            setNotice({ type: "error", text: "Network error. Please try again." });
        }
        setBusyId(null);
    }

    return (
        <section className="px-4 pb-20 pt-8 text-center sm:pt-12">
            {notice && (
                <p
                    role="status"
                    className={`mx-auto mb-6 max-w-xl rounded-lg border px-4 py-3 text-sm ${noticeStyle[notice.type]}`}
                >
                    {notice.text}
                </p>
            )}

            <span className="inline-block rounded-full border border-neutral-400 px-10 py-1.5 text-xs uppercase text-neutral-600">
                Our Plans
            </span>
            <h1 className="mb-10 mt-4 text-[28px] font-medium sm:text-[32px]">Choose the plan</h1>

            <div className="flex flex-wrap justify-center gap-6">
                {PACKS.map((pack) => (
                    <div
                        key={pack.id}
                        className="w-full max-w-[290px] rounded-lg border border-neutral-200 bg-white px-8 py-10 text-left shadow-sm transition hover:scale-[1.02]"
                    >
                        <Image src={ASSETS.logoIcon} alt="" width={40} height={40} className="size-10" />
                        <h2 className="mb-1 mt-4 font-medium">{pack.name}</h2>
                        <p className="text-sm text-neutral-600">{pack.description}</p>
                        <p className="mt-6">
                            <span className="text-3xl font-medium">${pack.priceCents / 100}</span>
                            <span className="text-sm text-neutral-600"> / {pack.credits} credits</span>
                        </p>
                        <button
                            type="button"
                            onClick={() => buy(pack.id)}
                            disabled={busyId !== null}
                            className="mt-8 w-full rounded-md bg-[#252525] py-2.5 text-sm text-white transition hover:bg-black disabled:opacity-60"
                        >
                            {busyId === pack.id ? "Redirecting..." : "Get started"}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}