import { useState } from "react";
import { Mail, MessageCircle, Globe, MapPin, Send, CheckCircle2, Briefcase } from "lucide-react";
import { trackContactForm, trackFormSubmit } from "@/utils/analytics";

const WHATSAPP_URL = `https://wa.me/8801917443161?text=${encodeURIComponent("Hi Alamin! I'd like to discuss a project with you.")}`;
const FIVERR_URL = "https://www.fiverr.com/alaminseller";

const whatsappIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.555 4.118 1.528 5.849L.057 23.485a.5.5 0 0 0 .612.612l5.698-1.484A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.653-.52-5.166-1.426l-.37-.22-3.826.996.984-3.763-.24-.386A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
);

export default function ProfessionalContact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        trackFormSubmit("contact");
        trackContactForm();
        const subject = encodeURIComponent(`Website Inquiry from ${form.name}`);
        const body = encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
        );
        window.open(`mailto:hello@alaminrafi.com?subject=${subject}&body=${body}`);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    const scrollToForm = (e: React.MouseEvent) => {
        e.preventDefault();
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const inputClasses =
        "w-full px-4 py-3.5 rounded-xl bg-zinc-50 dark:bg-[#14233F] border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all text-[15px]";

    return (
        <section id="contact" className="bg-zinc-50 dark:bg-[#0D1B33] py-12 sm:py-24 border-t border-zinc-100 dark:border-white/[0.05]">
            <div className="max-w-6xl mx-auto px-5 sm:px-6">
                {/* ─── Mobile headline ─── */}
                <div className="sm:hidden mb-8">
                    <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">Contact</p>
                    <h2 className="text-3xl font-bold text-zinc-900 dark:text-white leading-snug">
                        Ready to Grow Smarter?
                    </h2>
                    <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-[15px] leading-[1.6]">
                        Tell me about your business. I'll tell you exactly how I can help.
                    </p>
                </div>

                {/* ─── Desktop headline ─── */}
                <div className="hidden sm:block mb-16">
                    <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Contact</p>
                    <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4 leading-snug">
                        Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">great together</span>
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[17px] max-w-xl leading-relaxed">
                        Have a project in mind? I'd love to hear about it. Send a message or reach out directly — I respond within 24 hours.
                    </p>
                </div>

                {/* ─── Mobile action buttons ─── */}
                <div className="sm:hidden space-y-3 mb-10">
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-ga="whatsapp_click"
                        data-ga-location="contact-mobile"
                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#25D366]/25 hover:brightness-110 active:scale-[0.99] transition-all"
                    >
                        {whatsappIcon} Chat on WhatsApp
                    </a>
                    <a
                        href={FIVERR_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full border border-[#C9A84C] text-[#C9A84C] font-bold py-4 rounded-xl hover:bg-[#C9A84C]/10 active:scale-[0.99] transition-all"
                    >
                        <Briefcase className="h-5 w-5" /> View My Fiverr Profile
                    </a>
                    <a
                        href="#contact-form"
                        onClick={scrollToForm}
                        className="flex items-center justify-center gap-2 w-full border border-zinc-300 dark:border-white/20 text-zinc-700 dark:text-zinc-200 font-bold py-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/[0.06] active:scale-[0.99] transition-all"
                    >
                        <Mail className="h-5 w-5" /> Send a Message
                    </a>
                </div>

                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Contact Info – Left (desktop) */}
                    <div className="hidden lg:block lg:col-span-2 space-y-6">
                        {/* Email */}
                        <a
                            href="mailto:hello@alaminrafi.com"
                            data-ga="email_click"
                            data-ga-location="contact"
                            className="flex items-start gap-4 bg-white dark:bg-[#0F2040] p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300 group"
                        >
                            <div className="h-11 w-11 rounded-xl bg-[#C9A84C]/12 dark:bg-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C] dark:text-[#E0C77E] shrink-0 group-hover:bg-[#C9A84C] group-hover:text-[#0A1628] transition-all duration-300">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Email</p>
                                <p className="text-zinc-900 dark:text-white font-medium">hello@alaminrafi.com</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Send me an email anytime</p>
                            </div>
                        </a>

                        {/* WhatsApp */}
                        <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-ga="whatsapp_click"
                            data-ga-location="contact"
                            className="flex items-start gap-4 bg-white dark:bg-[#0F2040] p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 group"
                        >
                            <div className="h-11 w-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">WhatsApp</p>
                                <p className="text-zinc-900 dark:text-white font-medium">+880 1917 443161</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Chat with me directly</p>
                            </div>
                        </a>

                        {/* Fiverr */}
                        <a
                            href={FIVERR_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-4 bg-white dark:bg-[#0F2040] p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-md hover:border-[#C9A84C]/50 dark:hover:border-[#C9A84C]/40 transition-all duration-300 group"
                        >
                            <div className="h-11 w-11 rounded-xl bg-[#C9A84C]/12 dark:bg-[#C9A84C]/15 flex items-center justify-center text-[#C9A84C] dark:text-[#E0C77E] shrink-0 group-hover:bg-[#C9A84C] group-hover:text-[#0A1628] transition-all duration-300">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Fiverr</p>
                                <p className="text-zinc-900 dark:text-white font-medium">fiverr.com/alaminseller</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Browse my services on Fiverr</p>
                            </div>
                        </a>

                        {/* Website */}
                        <a
                            href="https://alaminrafi.com/portfolio"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-ga="website_click"
                            data-ga-location="contact"
                            className="flex items-start gap-4 bg-white dark:bg-[#0F2040] p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300 group"
                        >
                            <div className="h-11 w-11 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 group-hover:bg-[#C9A84C] group-hover:text-[#0A1628] transition-all duration-300">
                                <Globe className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Website</p>
                                <p className="text-zinc-900 dark:text-white font-medium">alaminrafi.com/portfolio</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Browse my recent work</p>
                            </div>
                        </a>

                        {/* Location */}
                        <div className="flex items-start gap-4 bg-white dark:bg-[#0F2040] p-5 rounded-2xl border border-zinc-100 dark:border-white/[0.08]">
                            <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-400/10 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Location</p>
                                <p className="text-zinc-900 dark:text-white font-medium">Remote — Worldwide</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Serving clients globally</p>
                            </div>
                        </div>

                        {/* Availability note */}
                        <div className="bg-gradient-to-r from-[#C9A84C] to-[#E6C97A] p-5 rounded-2xl text-[#0A1628]">
                            <p className="font-semibold mb-1">🟢 Currently Available</p>
                            <p className="text-sm text-[#0A1628]/80 leading-relaxed">
                                I'm open to new website projects, growth partnerships, and long-term digital support. Let's talk!
                            </p>
                        </div>
                    </div>

                    {/* Contact Form – Right */}
                    <div id="contact-form" className="lg:col-span-3 bg-white dark:bg-[#0F2040] rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6 sm:p-8 shadow-sm scroll-mt-24">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-16">
                                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
                                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Message sent!</h3>
                                <p className="text-zinc-500 dark:text-zinc-400">Your email client has opened. I'll reply within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                                    <div>
                                        <label htmlFor="contact-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Your Name</label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            name="name"
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className={inputClasses}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Your Email</label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            name="email"
                                            required
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="contact-message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Your Business / What you need</label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        required
                                        rows={3}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Tell me about your business, goals, and what you'd like to build..."
                                        className={`${inputClasses} resize-none`}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] text-[#0A1628] font-semibold py-4 rounded-xl transition-all duration-300 hover:brightness-110 hover:shadow-lg hover:shadow-[#C9A84C]/25 active:scale-[0.99]"
                                >
                                    <Send className="h-4 w-4" />
                                    Send Message
                                </button>

                                <p className="text-center text-xs text-zinc-400">
                                    Prefer a quick chat? Reach me on{" "}
                                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline font-medium">
                                        WhatsApp
                                    </a>{" "}
                                    or{" "}
                                    <a href={FIVERR_URL} target="_blank" rel="noopener noreferrer" className="text-[#C9A84C] hover:underline font-medium">
                                        Fiverr
                                    </a>
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
