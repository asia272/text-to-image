import Image from "next/image";
import { ASSETS } from "@/lib/assets";

const steps = [
    {
        title: "Describe Your Vision",
        text: "“Type a phrase, sentence, or paragraph that describes the image you want to create.”",
    },
    {
        title: "Watch the Magic",
        text: "“Our AI-powered engine will transform your text into a high-quality, unique image in seconds.”",
    },
    {
        title: "Download & Share",
        text: "“Instantly download your creation or share it with the world directly from our platform.”",
    },
];

export default function HowItWorks() {
    return (
        <section className="px-4 py-16 text-center sm:py-20">
            <h2 className="text-[32px] font-medium leading-tight sm:text-[40px]">How it works</h2>
            <p className="mt-2 text-sm text-neutral-500 sm:text-base">Transform Words Into Stunning Images</p>

            <div className="mx-auto mt-10 flex w-full max-w-3xl flex-col gap-4 text-left">
                {steps.map((step, i) => (
                    <div
                        key={step.title}
                        className="flex items-center gap-4 rounded-lg border border-[#E1E1E1] bg-white/20 px-5 py-4 shadow-[0_4px_15px_#0000000D] sm:px-6"
                    >
                        <Image src={ASSETS.steps[i]} alt="" width={40} height={40} className="size-10 shrink-0" />
                        <div>
                            <h3 className="text-[16px] font-medium sm:text-lg">{step.title}</h3>
                            <p className="text-sm text-neutral-500">{step.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}