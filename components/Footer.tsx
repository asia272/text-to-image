import Image from "next/image";
import { ASSETS } from "@/lib/assets";

export default function Footer() {
    return (
        <footer className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-10 lg:px-[72px]">
            <div className="flex items-center gap-4">
                <Image src={ASSETS.logo} alt="imagify" width={140} height={36} className="h-8 w-auto" />
                <span className="hidden h-6 w-px bg-neutral-300 sm:block" aria-hidden />
                <p className="text-xs text-neutral-500 sm:text-sm">All right reserved. Copyright @imagify</p>
            </div>
            <div className="flex items-center gap-2.5">
                <Image src={ASSETS.facebook} alt="Facebook" width={28} height={28} className="size-7" />
                <Image src={ASSETS.twitter} alt="Twitter" width={28} height={28} className="size-7" />
                <Image src={ASSETS.instagram} alt="Instagram" width={28} height={28} className="size-7" />
            </div>
        </footer>
    );
}