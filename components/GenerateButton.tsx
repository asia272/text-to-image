"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { ASSETS } from "@/lib/assets";

export default function GenerateButton({ className = "" }: { className?: string }) {
    const { user, loading, openLogin } = useAuth();
    const router = useRouter();

    function handleClick() {
        if (user) router.push("/result");
        else openLogin({ redirectTo: "/result" });
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className={`inline-flex h-[55px] w-[239px] items-center justify-center gap-2 rounded-full bg-black text-base text-white transition hover:scale-105 active:scale-95 disabled:opacity-70 ${className}`}
        >
            Generate Images
            <Image src={ASSETS.starGroup} alt="" width={24} height={24} className="h-6 w-auto" />
        </button>
    );
}