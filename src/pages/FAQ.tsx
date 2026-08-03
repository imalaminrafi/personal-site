import { useEffect, useState } from "react";
import PublicLayout from "@/components/app/PublicLayout";
import { loadFAQData } from "@/data/faq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { trackWhatsAppClick } from "@/utils/analytics";

const WHATSAPP_URL = "https://wa.me/8801917443161?text=Hi%20Alamin!%20I%20have%20a%20question.";

export default function FAQPage() {
  const [items] = useState(() => loadFAQData());

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <PublicLayout>
      <section className="max-w-2xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">FAQ</p>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-3">
          Frequently asked questions
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed mb-8">
          Quick answers to the questions I get most. Can't find yours? Just ask.
        </p>

        {items.length === 0 ? (
          <div className="py-16 text-center text-zinc-400">No FAQs yet.</div>
        ) : (
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-2xl border border-zinc-100 px-4 dark:border-[#1E3A5F] bg-zinc-50/60 dark:bg-[#162032]/40"
              >
                <AccordionTrigger className="min-h-[52px] px-2 py-3 text-left text-sm font-bold text-zinc-900 dark:text-white">
                  <span className="flex items-start gap-2.5">
                    <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 pl-7 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        <div className="mt-10 rounded-2xl border border-zinc-100 dark:border-[#1E3A5F] bg-zinc-50/60 dark:bg-[#162032]/40 p-6 text-center">
          <p className="text-sm font-bold text-zinc-900 dark:text-white mb-1">Still have a question?</p>
          <p className="text-xs text-zinc-500 mb-4">I usually reply within a few hours on business days.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/contact" className="flex min-h-[44px] items-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-bold text-white transition-colors hover:bg-violet-700">
              <MessageCircle className="h-4 w-4" /> Contact
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-ga="whatsapp_click"
              data-ga-location="faq"
              onClick={() => trackWhatsAppClick("faq")}
              className="flex min-h-[44px] items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
