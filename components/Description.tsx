import Image from "next/image";
import { ASSETS } from "@/lib/assets";

export default function Description() {
    return (
        <section className="px-4 py-16 sm:py-20">
            <div className="text-center">
                <h2 className="text-[32px] font-medium leading-tight sm:text-[40px]">Create AI Images</h2>
                <p className="mt-2 text-sm text-neutral-500 sm:text-base">Turn your imagination into visuals</p>
            </div>

            <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-8 md:flex-row md:gap-14">
                <Image
                    src={ASSETS.sample1}
                    alt="A friendly monster chef next to a birthday cake, generated with imagify"
                    width={384}
                    height={384}
                    className="h-auto w-80 rounded-lg xl:w-96"
                />
                <div className="max-w-lg">
                    <h3 className="text-2xl font-medium text-[#44445a] sm:text-[28px] sm:leading-9">
                        Introducing the AI-Powered Text to Image Generator
                    </h3>
                    <p className="mt-5 text-[16px] leading-6 text-neutral-500">
                        Easily bring your ideas to life with our free AI image generator. Whether you need stunning visuals or
                        unique imagery, our tool transforms your text into eye-catching images with just a few clicks. Imagine it,
                        describe it, and watch it come to life instantly.
                    </p>
                    <p className="mt-5 text-[16px] leading-6 text-neutral-500">
                        Simply type in a text prompt, and our cutting-edge AI will generate high-quality images in seconds. From
                        product visuals to character designs and portraits, even concepts that don&apos;t yet exist can be
                        visualized effortlessly. Powered by advanced AI technology, the creative possibilities are limitless!
                    </p>
                </div>
            </div>
        </section>
    );
}