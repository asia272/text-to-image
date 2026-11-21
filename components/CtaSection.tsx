import GenerateButton from "@/components/GenerateButton";

export default function CtaSection() {
    return (
        <section className="px-4 py-20 text-center sm:py-24">
            <h2 className="text-[32px] font-medium leading-tight text-[#252525] sm:text-[40px]">See the magic. Try now</h2>
            <GenerateButton className="mt-8" />
        </section>
    );
}