"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { ASSETS } from "@/lib/assets";

type Props = {
    open: boolean;
    mode: "login" | "signup";
    onModeChange: (mode: "login" | "signup") => void;
    onClose: () => void;
    onAuthenticated: () => void | Promise<void>;
};

const fieldClass =
    "mt-4 flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2.5 focus-within:border-[#007AFF]";
const inputClass = "w-full bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400";

export default function AuthModal({ open, mode, onModeChange, onClose, onAuthenticated }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = previous;
            window.removeEventListener("keydown", onKey);
        };
    }, [open, onClose]);

    useEffect(() => {
        setMessage("");
    }, [mode, open]);

    if (!open) return null;

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setMessage("");
        setSubmitting(true);
        try {
            const isLogin = mode === "login";
            const res = await fetch(isLogin ? "/api/auth/login" : "/api/auth/register", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(isLogin ? { email, password } : { name, email, password }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setMessage(data.error ?? "Something went wrong. Please try again.");
                return;
            }
            setPassword("");
            await onAuthenticated();
        } catch {
            setMessage("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    const isLogin = mode === "login";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <form
                role="dialog"
                aria-modal="true"
                aria-labelledby="auth-title"
                onSubmit={handleSubmit}
                className="relative w-full max-w-[350px] rounded-xl bg-white p-8 text-center shadow-xl sm:p-10"
            >
                <button type="button" onClick={onClose} aria-label="Close" className="absolute right-5 top-5">
                    <Image src={ASSETS.crossIcon} alt="" width={12} height={12} className="size-3" />
                </button>

                <h1 id="auth-title" className="text-2xl font-medium text-neutral-700">
                    {isLogin ? "Login" : "Sign Up"}
                </h1>
                <p className="mt-1 text-sm text-[#4a4a8a]">
                    {isLogin ? "Welcome back! Please sign in to continue" : "Welcome! Please sign up to continue"}
                </p>

                {!isLogin && (
                    <label className={fieldClass}>
                        <Image src={ASSETS.profileIcon} alt="" width={14} height={14} className="size-3.5" />
                        <input
                            className={inputClass}
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            maxLength={60}
                            required
                        />
                    </label>
                )}

                <label className={fieldClass}>
                    <Image src={ASSETS.emailIcon} alt="" width={14} height={14} className="h-3.5 w-auto" />
                    <input
                        className={inputClass}
                        type="email"
                        placeholder="Email id"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                </label>

                <label className={fieldClass}>
                    <Image src={ASSETS.lockIcon} alt="" width={14} height={14} className="h-3.5 w-auto" />
                    <input
                        className={inputClass}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        minLength={isLogin ? undefined : 8}
                        required
                    />
                </label>

                {isLogin && (
                    <p className="mt-4 text-left text-sm">
                        <button
                            type="button"
                            className="text-[#007AFF] hover:underline"
                            onClick={() => setMessage("Password reset is coming soon.")}
                        >
                            Forgot password?
                        </button>
                    </p>
                )}

                {message && (
                    <p role="alert" className="mt-3 text-left text-sm text-red-600">
                        {message}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-5 w-full rounded-full bg-[#007AFF] py-2.5 text-sm text-white transition hover:brightness-110 disabled:opacity-60"
                >
                    {submitting ? "Please wait..." : isLogin ? "Login" : "Create account"}
                </button>

                <p className="mt-5 text-xs text-neutral-500 sm:text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        className="text-[#007AFF] hover:underline"
                        onClick={() => onModeChange(isLogin ? "signup" : "login")}
                    >
                        {isLogin ? "Sign up" : "Login"}
                    </button>
                </p>
            </form>
        </div>
    );
}