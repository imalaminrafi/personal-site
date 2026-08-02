import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { plans, addons, maintenanceOption, PricingPlan } from "@/data/pricingData";

export default function PricingSection() {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);

    const scrollToContact = (e: React.MouseEvent) => {
        e.preventDefault();
        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScroll = () => {
        const el = scrollerRef.current;
        if (!el) return;
        const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? el.clientWidth;
        const idx = Math.min(plans.length - 1, Math.round(el.scrollLeft / (cardWidth + 16)));
        setActive(idx);
    };

    const scrollToCard = (i: number) => {
        const el = scrollerRef.current;
        if (!el) return;
        const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? el.clientWidth;
        el.scrollTo({ left: i * (cardWidth + 16), behavior: "smooth" });
    };

    return (
        <section
            id="pricing"
            className="py-12 sm:py-14 bg-white dark:bg-[#0A1628] border-t border-zinc-100 dark:border-white/[0.05] relative overflow-hidden"
        >
            <div className="relative max-w-5xl mx-auto px-6">
                {/* ─── Section Header ─── */}
                <div className="mb-10 sm:mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                        Pricing
                    </p>
                    <h2 className="text-xl sm:text-2xl font-medium text-zinc-900 dark:text-white tracking-tight">
                        Clear, Flexible <span className="text-zinc-400">Pricing</span>
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-3 max-w-xl leading-relaxed">
                        Every project is unique, so you get a custom quote based on your exact needs — no surprise fees, and you'll know the price before we start.
                    </p>
                </div>

                {/* Horizontal scroll on mobile, 3-col grid on md+ */}
                <div
                    ref={scrollerRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-none md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 md:snap-none"
                >
                    {plans.map((plan: PricingPlan) => {
                        return (
                            <div
                                key={plan.id}
                                className={`
                                    relative flex flex-col rounded-2xl p-6 pt-8
                                    border transition-all duration-300
                                    snap-start shrink-0 w-[75vw] max-w-[320px] md:w-auto md:max-w-none
                                    ${plan.highlighted
                                        ? "border-[#C9A84C] bg-[#0F2040] shadow-lg shadow-[#C9A84C]/15"
                                        : "border-[#C9A84C]/20 bg-[#0F2040]"
                                    }
                                `}
                            >
                                {plan.highlighted && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#C9A84C] px-3 py-1 text-xs font-bold text-[#0A1628] whitespace-nowrap">
                                        Most Popular
                                    </span>
                                )}

                                {/* Name + tagline */}
                                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                <p className="mt-1 text-sm text-zinc-400">{plan.priceNote}</p>

                                <div className="border-t border-white/[0.08] my-5" />

                                {/* Features */}
                                <ul className="space-y-3 mb-6 grow">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-start gap-2.5">
                                            <Check className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" strokeWidth={3} />
                                            <span className="text-sm text-zinc-300">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="border-t border-white/[0.08] mb-5" />

                                {/* Price */}
                                <p className="text-sm text-zinc-400">
                                    Price: <span className="text-white font-black text-lg">{plan.priceLabel}</span>
                                </p>

                                <a
                                    href="#contact"
                                    onClick={scrollToContact}
                                    className="mt-4 w-full py-3.5 rounded-xl bg-[#C9A84C] text-[#0A1628] font-bold text-sm text-center transition-all hover:brightness-110 active:scale-[0.99]"
                                >
                                    {plan.ctaLabel}
                                </a>
                            </div>
                        );
                    })}
                </div>

                {/* Swipe hint + dots (mobile only) */}
                <div className="md:hidden mt-4">
                    <div className="flex items-center justify-center gap-1.5">
                        {plans.map((plan, i) => (
                            <button
                                key={plan.id}
                                onClick={() => scrollToCard(i)}
                                aria-label={`Go to ${plan.name} plan`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    active === i ? "w-5 bg-[#C9A84C]" : "w-1.5 bg-zinc-400/50"
                                }`}
                            />
                        ))}
                    </div>
                    <p className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
                        Swipe → for more plans
                    </p>
                </div>

                {/* ─── Add-ons Section ─── */}
                <div className="mt-16">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">Available Add-ons</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {addons.map((addon) => (
                            <div 
                                key={addon.id}
                                className="p-4 rounded-xl border border-zinc-100 dark:border-white/[0.05] bg-zinc-50/50 dark:bg-[#0F2040]/40 flex justify-between items-center"
                            >
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{addon.name}</span>
                                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{addon.priceLabel}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ─── Maintenance Option ─── */}
                <div className="mt-8 p-6 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-[#0F2040]/20 text-center">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-2">{maintenanceOption.name}</h3>
                    <a 
                        href="#contact" 
                        onClick={scrollToContact}
                        className="text-violet-600 dark:text-violet-400 font-bold text-sm hover:underline"
                    >
                        {maintenanceOption.priceLabel} →
                    </a>
                </div>

                {/* Custom note */}
                <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-white/[0.05] text-center">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Not sure what you need?{" "}
                        <a
                            href="#contact"
                            onClick={scrollToContact}
                            className="text-violet-600 dark:text-violet-400 hover:underline font-bold"
                        >
                            Let's talk — I'll help you figure it out →
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
