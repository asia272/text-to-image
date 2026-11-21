import Image from "next/image";
import GenerateButton from "@/components/GenerateButton";
import { ASSETS } from "@/lib/assets";

export default function Hero() {
    return (
        <section className="flex flex-col items-center px-4 pb-10 pt-10 text-center sm:pt-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-400 bg-white px-6 py-1 text-sm text-neutral-600">
                <p>Best text to image generator</p>
                <Image src={ASSETS.starIcon} alt="" width={16} height={16} className="size-4" />
            </div>

            <h1 className="mx-auto mt-8 max-w-[620px] text-[44px] leading-[1.05] sm:text-6xl lg:text-[80px] lg:leading-[80px]">
                Turn text to <span className="text-[#007AFF]">image</span>, in seconds.
            </h1>

            <p className="mx-auto mt-6 max-w-[576px] text-base text-[#545454] sm:text-lg">
                Unleash your creativity with AI. Turn your imagination into visual art in seconds – just type, and watch the
                magic happen.
            </p>

            <GenerateButton className="mt-8" />

            <div className="mt-14 flex flex-wrap justify-center gap-1.5">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Image
                        key={i}
                        src={i % 2 === 0 ? ASSETS.sample1 : ASSETS.sample2}
                        alt="Sample image generated with imagify"
                        width={80}
                        height={80}
                        className="size-16 rounded-lg object-cover transition hover:scale-105 sm:size-20"
                    />
                ))}
            </div>
            <p className="mt-3 text-sm text-neutral-500">Generated images from imagify</p>
        </section>
    );
}