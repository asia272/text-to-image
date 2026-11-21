"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { ASSETS } from "@/lib/assets";

type Status = "idle" | "loading" | "done";

export default function ResultPage() {
    const router = useRouter();
    const { user, loading, openLogin, refresh, setCredits } = useAuth();

    const [prompt, setPrompt] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [imageSrc, setImageSrc] = useState<string>(ASSETS.sample1);
    const [error, setError] = useState<string | null>(null);
    const [resendMessage, setResendMessage] = useState<string | null>(null);
    const objectUrl = useRef<string | null>(null);

    // Login nahi hai to home par bhejo aur login box kholo
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/");
            openLogin({ redirectTo: "/result" });
        }
    }, [loading, user, router, openLogin]);

    useEffect(() => {
        return () => {
            if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        };
    }, []);

    if (loading || !user) return null;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (status === "loading") return;

        const text = prompt.trim();
        if (text.length < 3) {
            setError("Please describe the image you want (at least 3 characters).");
            return;
        }

        setError(null);
        setStatus("loading");

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ prompt: text }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setStatus("idle");
                if (res.status === 402) {
                    // Credits khatam: pricing page par bhejo
                    await refresh();
                    router.push("/pricing");
                    return;
                }
                if (res.status === 403) await refresh();
                setError(data.error ?? "Something went wrong. Please try again.");
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
            objectUrl.current = url;
            setImageSrc(url);

            const left = res.headers.get("x-credits-left");
            if (left !== null) setCredits(Number(left));
            setStatus("done");
        } catch {
            setStatus("idle");
            setError("Network error. Please try again.");
        }
    }

    async function resendVerification() {
        setResendMessage(null);
        const res = await fetch("/api/auth/resend-verification", { method: "POST" });
        const data = await res.json().catch(() => ({}));
        setResendMessage(res.ok ? "Verification email sent. Please check your inbox." : (data.error ?? "Could not send email."));
    }

    const barWidth = status === "idle" ? "0%" : "100%";

    return (
        <section className="flex flex-col items-center px-4 pb-20 pt-8 text-center">
            {!user.emailVerified && (
                <div role="status" className="mb-8 w-full max-w-xl rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                    Please verify your email to generate images. We sent a link to <strong>{user.email}</strong>.{" "}
                    <button type="button" onClick={resendVerification} className="font-medium underline">
                        Resend email
                    </button>
                    {resendMessage && <p className="mt-1">{resendMessage}</p>}
                </div>
            )}

            <div className="w-72 sm:w-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="Generated result" className="aspect-square w-full rounded object-cover" />
                <div className="h-1 w-full bg-neutral-200">
                    <div
                        className="h-1 bg-[#007AFF]"
                        style={{ width: barWidth, transition: status === "loading" ? "width 10s linear" : "none" }}
                    />
                </div>
                <p className={`mt-1 text-left text-xs text-neutral-600 ${status === "loading" ? "" : "invisible"}`}>
                    Loading.....
                </p>
            </div>

            {status !== "done" ? (
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 flex w-full max-w-xl rounded-full bg-neutral-500 p-0.5 text-sm text-white"
                >
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        maxLength={1000}
                        placeholder="Describe what you want to generate"
                        aria-label="Describe what you want to generate"
                        className="min-w-0 flex-1 bg-transparent px-6 outline-none placeholder:text-neutral-200"
                    />
                    <button
                        type="submit"
                        disabled={status === "loading" || !user.emailVerified}
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-3 transition hover:bg-black disabled:opacity-60 sm:px-14"
                    >
                        {status === "loading" && <Loader2 className="size-4 animate-spin" aria-hidden />}
                        Generate
                    </button>
                </form>
            ) : (
                <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
                    <button
                        type="button"
                        onClick={() => {
                            setStatus("idle");
                            setPrompt("");
                        }}
                        className="rounded-full border border-zinc-900 px-8 py-3 text-zinc-900 transition hover:bg-white"
                    >
                        Generate Another
                    </button>
                    <a
                        href={imageSrc}
                        download="imagify.jpg"
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-10 py-3 text-white transition hover:bg-black"
                    >
                        <Download className="size-4" aria-hidden />
                        Download
                    </a>
                </div>
            )}

            {error && (
                <p role="alert" className="mt-4 text-sm text-red-600">
                    {error}
                </p>
            )}
        </section>
    );
}