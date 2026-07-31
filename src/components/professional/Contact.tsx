import { useState } from "react";
import { Mail, MessageCircle, MapPin, Send, CheckCircle2 } from "lucide-react";
import { trackContactForm, trackFormSubmit } from "@/utils/analytics";

export default function ProfessionalContact() {
    const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        trackFormSubmit("contact");
        trackContactForm();
        // Build a mailto link with form data
        const subject = encodeURIComponent(`Website Inquiry from ${form.name}`);
        const body = encodeURIComponent(
            `Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\n\nMessage:\n${form.message}`
        );
        window.open(`mailto:hello@alaminrafi.com?subject=${subject}&body=${body}`);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    const whatsappMsg = encodeURIComponent("Hi Alamin! I'd like to discuss a web project with you.");

    return (
        <section id="contact" className="bg-zinc-50 dark:bg-zinc-900/50 py-24 border-t border-zinc-100 dark:border-zinc-800">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-3">Contact</p>
                <h2 className="text-4xl font-bold text-zinc-900 dark:text-white mb-4 leading-snug">
                    Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-cyan-500">great together</span>
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-[17px] mb-16 max-w-xl leading-relaxed">
                    Have a project in mind? I'd love to hear about it. Send a message or reach out directly — I respond within 24 hours.
                </p>

                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Contact Info – Left */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Email */}
                        <a
                            href="mailto:hello@alaminrafi.com"
                            data-ga="email_click"
                            data-ga-location="contact"
                            className="flex items-start gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800 transition-all duration-300 group"
                        >
                            <div className="h-11 w-11 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
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
                            href={`https://wa.me/8801917443161?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-ga="whatsapp_click"
                            data-ga-location="contact"
                            className="flex items-start gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-300 group"
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

                        {/* Location */}
                        <div className="flex items-start gap-4 bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="h-11 w-11 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-1">Location</p>
                                <p className="text-zinc-900 dark:text-white font-medium">Faridganj, Chandpur</p>
                                <p className="text-xs text-zinc-400 mt-0.5">Available Remotely</p>
                            </div>
                        </div>

                        {/* Availability note */}
                        <div className="bg-gradient-to-r from-violet-600 to-cyan-500 p-5 rounded-2xl text-white">
                            <p className="font-semibold mb-1">🟢 Currently Available</p>
                            <p className="text-sm text-violet-100 leading-relaxed">
                                I'm open to freelance projects, website contracts, and long-term digital partnerships. Let's talk!
                            </p>
                        </div>
                    </div>

                    {/* Contact Form – Right */}
                    <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-16">
                                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
                                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Message sent!</h3>
                                <p className="text-zinc-500 dark:text-zinc-400">Your email client has opened. I'll reply within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
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
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            name="email"
                                            required
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="contact-service" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Service Needed</label>
                                    <select
                                        id="contact-service"
                                        name="service"
                                        required
                                        value={form.service}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
                                    >
                                        <option value="">Select a service...</option>
                                        <option value="Website Design & Development">Website Design & Development</option>
                                        <option value="WordPress Website">WordPress Website</option>
                                        <option value="Landing Page Design">Landing Page Design</option>
                                        <option value="UI/UX Design">UI/UX Design</option>
                                        <option value="Digital Marketing Support">Digital Marketing Support</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="contact-message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Project Details</label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Tell me about your project, timeline, and budget..."
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                                >
                                    <Send className="h-4 w-4" />
                                    Send Message
                                </button>

                                <p className="text-center text-xs text-zinc-400">
                                    Or reach me directly on{" "}
                                    <a href={`https://wa.me/8801917443161?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline font-medium">
                                        WhatsApp
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
