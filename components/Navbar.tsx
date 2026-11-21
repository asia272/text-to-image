"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { ASSETS } from "@/lib/assets";

export default function Navbar() {
    const { user, loading, openLogin, logout } = useAuth();

    return (
        <header className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4 sm:px-10 lg:px-[72px]">
            <Link href="/" aria-label="imagify home">
                <Image src={ASSETS.logo} alt="imagify" width={160} height={40} priority className="h-8 w-auto sm:h-10" />
            </Link>

            <nav className="flex items-center gap-3 sm:gap-5">
                {loading ? (
                    <div className="h-[42px] w-28" aria-hidden />
                ) : user ? (
                    <>
                        <Link
                            href="/pricing"
                            className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 transition hover:scale-105 sm:px-6"
                        >
                            <Image src={ASSETS.creditStar} alt="" width={20} height={20} className="size-5" />
                            <span className="text-xs font-medium text-neutral-600 sm:text-sm">Credits left: {user.credits}</span>
                        </Link>
                        <p className="hidden text-sm text-neutral-600 sm:block">Hi! {user.name.split(" ")[0]}</p>
                        <div className="group relative">
                            <button type="button" aria-label="Account menu" className="block">
                                <Image src={ASSETS.profileIcon} alt="" width={40} height={40} className="size-10 drop-shadow" />
                            </button>
                            <div className="absolute right-0 top-full z-20 hidden pt-2 group-focus-within:block group-hover:block">
                                <ul className="min-w-32 rounded-md border border-neutral-200 bg-white p-1 text-sm shadow-md">
                                    <li>
                                        <button
                                            type="button"
                                            onClick={logout}
                                            className="w-full rounded px-3 py-2 text-left hover:bg-neutral-50"
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Link href="/pricing" className="text-sm text-neutral-600 hover:text-black sm:text-base">
                            Pricing
                        </Link>
                        <button
                            type="button"
                            onClick={() => openLogin()}
                            className="h-[42px] w-28 rounded-full bg-black text-[15px] text-white transition hover:scale-105 sm:w-[146px]"
                        >
                            Login
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
}