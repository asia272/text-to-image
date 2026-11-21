"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function VerifyEmailPage() {
    const { refresh } = useAuth();
    const [state, setState] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const started = useRef(false);

    useEffect(() => {
        // Dev mode mein effect do baar chalta hai, token sirf ek baar use hona chahiye
        if (started.current) return;
        started.current = true;

        const token = new URLSearchParams(window.location.search).get("token");
        if (!token) {
            setState("error");
            setMessage("This verification link is missing its token.");
            return;
        }

        (async () => {
            try {
                const res = await fetch("/api/auth/verify-email", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ token }),
                });
                const data = await res.json().catch(() => ({}));
                if (res.ok) {
                    setState("success");
                    await refresh();
                } else {
                    setState("error");
                    setMessage(data.error ?? "This link is invalid or has expired.");
                }
            } catch {
                setState("error");
                setMessage("Network error. Please try again.");
            }
        })();
    }, [refresh]);

    return (
        <section className="flex justify-center px-4 py-20">
            <div className="w-full max-w-md rounded-lg border border-[#E1E1E1] bg-white/60 p-10 text-center shadow-[0_4px_15px_#0000000D]">
                {state === "loading" && <p className="text-neutral-600">Verifying your email...</p>}

                {state === "success" && (
                    <>
                        <h1 className="text-2xl font-medium">Email verified</h1>
                        <p className="mt-2 text-sm text-neutral-500">You can now generate images with your free credits.</p>
                        <Link href="/result" className="mt-6 inline-block rounded-full bg-black px-8 py-3 text-sm text-white">
                            Start generating
                        </Link>
                    </>
                )}

                {state === "error" && (
                    <>
                        <h1 className="text-2xl font-medium">Verification failed</h1>
                        <p className="mt-2 text-sm text-red-600">{message}</p>
                        <p className="mt-2 text-sm text-neutral-500">
                            Log in and use &ldquo;Resend email&rdquo; on the generate page to get a new link.
                        </p>
                        <Link href="/" className="mt-6 inline-block rounded-full bg-black px-8 py-3 text-sm text-white">
                            Go home
                        </Link>
                    </>
                )}
            </div>
        </section>
    );
}