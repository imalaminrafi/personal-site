import { Check, Zap, Star, Crown } from "lucide-react";
import { plans, addons, maintenanceOption, PricingPlan } from "@/data/pricingData";

const iconMap = {
    Zap: <Zap className="w-5 h-5" />,
    Star: <Star className="w-5 h-5" />,
    Crown: <Crown className="w-5 h-5" />,
};

export default function PricingSection() {
    const scrollToContact = (e: React.MouseEvent) => {
        e.preventDefault();
        document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            id="pricing"
            className="py-10 sm:py-14 bg-white dark:bg-[#0A1628] border-t border-zinc-100 dark:border-white/[0.05] relative overflow-hidden"
        >
            <div className="relative max-w-5xl mx-auto px-6">
                {/* ─── Section Header ─── */}
                <div className="mb-10 sm:mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                        Pricing
                    </p>
                    <h2 className="text-xl sm:text-2xl font-medium text-zinc-900 dark:text-white tracking-tight">
                        Simple, Transparent <span className="text-zinc-400">Pricing</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {plans.map((plan: PricingPlan) => {
                        return (
                            <div
                                key={plan.id}
                                className={`
                                    relative flex flex-col rounded-2xl overflow-hidden text-left p-6
                                    border transition-all duration-300
                                    ${plan.highlighted
                                        ? "border-[#C9A84C]/50 dark:border-[#C9A84C]/40 bg-[#C9A84C]/5 dark:bg-[#C9A84C]/[0.06] shadow-md shadow-[#C9A84C]/10"
                                        : "border-zinc-100 dark:border-white/[0.05] bg-zinc-50/50 dark:bg-[#0F2040]"
                                    }
                                `}
                            >
                                {/* Icon + Name */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${plan.iconBg}`}>
                                        {iconMap[plan.iconName]}
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{plan.name}</h3>
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <p className="text-3xl font-black text-zinc-900 dark:text-white">
                                        {plan.priceLabel}
                                    </p>
                                    <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest mt-1">
                                        {plan.priceNote}
                                    </p>
                                </div>

                                <div className="border-t border-zinc-100 dark:border-white/[0.06] mb-6" />

                                {/* Features */}
                                <ul className="space-y-3 mb-8 grow">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2.5">
                                            <Check className="w-3.5 h-3.5 text-violet-500" strokeWidth={3} />
                                            <span className="text-sm text-zinc-600 dark:text-zinc-300">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href="#contact"
                                    onClick={scrollToContact}
                                    className={`
                                        w-full py-3 rounded-xl font-bold text-sm text-center transition-all
                                        ${plan.highlighted
                                            ? "bg-[#C9A84C] text-[#0A1628] shadow-lg shadow-[#C9A84C]/20 hover:brightness-110"
                                            : "bg-zinc-900 dark:bg-[#14233F] text-white hover:bg-black dark:hover:bg-[#1C2A47]"
                                        }
                                    `}
                                >
                                    {plan.ctaLabel}
                                </a>
                            </div>
                        );
                    })}
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
                        Need a fully custom solution?{" "}
                        <a
                            href="#contact"
                            onClick={scrollToContact}
                            className="text-violet-600 dark:text-violet-400 hover:underline font-bold"
                        >
                            Let's discuss your project →
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
}
