import Image from "next/image";
import { ASSETS } from "@/lib/assets";

const testimonials = [
    { name: "Donald Jackman", role: "Graphic Designer", image: ASSETS.profile1 },
    { name: "Richard Nelson", role: "Content Creator", image: ASSETS.profile2 },
    { name: "James Washington", role: "Co-Founder", image: ASSETS.profile1 },
];

const text =
    "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.";

export default function Testimonials() {
    return (
        <section className="px-4 py-16 text-center sm:py-20">
            <h2 className="text-[32px] font-medium leading-tight sm:text-[40px]">Customer testimonials</h2>
            <p className="mt-2 text-sm text-neutral-500 sm:text-base">What Our Users Are Saying</p>

            <div className="mx-auto mt-12 flex max-w-5xl flex-wrap justify-center gap-6">
                {testimonials.map((t) => (
                    <article
                        key={t.name}
                        className="w-full max-w-[322px] rounded-lg border border-[#E1E1E1] bg-white/20 px-9 py-10 text-center shadow-[0_4px_15px_#0000000D]"
                    >
                        <Image src={t.image} alt="" width={56} height={56} className="mx-auto size-14 rounded-full object-cover" />
                        <h3 className="mt-3 text-xl font-medium text-[#44445a]">{t.name}</h3>
                        <p className="text-sm text-[#6b6b9a]">{t.role}</p>
                        <div className="mt-3 flex justify-center gap-1" aria-label="5 out of 5 stars">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Image key={i} src={ASSETS.ratingStar} alt="" width={20} height={20} className="size-5" />
                            ))}
                        </div>
                        <p className="mt-4 text-[15px] leading-6 text-neutral-500">{text}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}