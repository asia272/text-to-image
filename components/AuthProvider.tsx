"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";

export type User = {
    id: string;
    email: string;
    name: string;
    credits: number;
    emailVerified: boolean;
};

type Mode = "login" | "signup";
type OpenLoginOptions = { mode?: Mode; redirectTo?: string };

type AuthContextValue = {
    user: User | null;
    loading: boolean;
    refresh: () => Promise<void>;
    setCredits: (credits: number) => void;
    logout: () => Promise<void>;
    openLogin: (options?: OpenLoginOptions) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<{ open: boolean; mode: Mode; redirectTo?: string }>({
        open: false,
        mode: "login",
    });

    const refresh = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me", { cache: "no-store" });
            const data = await res.json();
            setUser(data.user ?? null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const setCredits = useCallback((credits: number) => {
        setUser((current) => (current ? { ...current, credits } : current));
    }, []);

    const openLogin = useCallback((options: OpenLoginOptions = {}) => {
        setModal({ open: true, mode: options.mode ?? "login", redirectTo: options.redirectTo });
    }, []);

    const logout = useCallback(async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/");
        router.refresh();
    }, [router]);

    const value = useMemo(
        () => ({ user, loading, refresh, setCredits, logout, openLogin }),
        [user, loading, refresh, setCredits, logout, openLogin],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
            <AuthModal
                open={modal.open}
                mode={modal.mode}
                onModeChange={(mode) => setModal((m) => ({ ...m, mode }))}
                onClose={() => setModal((m) => ({ ...m, open: false }))}
                onAuthenticated={async () => {
                    await refresh();
                    const target = modal.redirectTo;
                    setModal((m) => ({ ...m, open: false }));
                    if (target) router.push(target);
                }}
            />
        </AuthContext.Provider>
    );
}