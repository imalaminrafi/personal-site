export interface FAQItemData {
  question: string;
  answer: string;
  category: string;
}

export const faqCategories = ["General", "Web Design", "Pricing", "Support"];

export const faqData: FAQItemData[] = [
  {
    question: "How fast will my website be delivered?",
    answer: "It depends on the project size. A landing page typically takes 3–5 days, a small business site 5–7 days, and larger custom projects 10–14 days. You'll get a clear timeline before we start.",
    category: "Web Design",
  },
  {
    question: "Do you provide custom design or templates?",
    answer: "Custom. Every project starts from a blank canvas based on your brand, goals, and content. You get a design that is unique to your business.",
    category: "Web Design",
  },
  {
    question: "How much does a website cost?",
    answer: "Every project is different, so I don't use a fixed price list. Tell me what you need and I'll prepare a clear custom quote for your exact scope — no surprise fees, and you'll know the price before we start.",
    category: "Pricing",
  },
  {
    question: "Do you offer ongoing maintenance and support?",
    answer: "Yes. After launch I can handle updates, backups, security, content changes, and monthly reports. You can pick a plan that fits your budget.",
    category: "Support",
  },
  {
    question: "Will my website work well on mobile?",
    answer: "Absolutely. Every site I build is mobile-first — designed for phones first, then tablets and desktop, with 44px+ touch targets and fast loading.",
    category: "Web Design",
  },
  {
    question: "How do I contact you about a project?",
    answer: "The easiest ways are WhatsApp or email — both are one tap from the Contact page. I usually reply within a few hours during business days.",
    category: "General",
  },
  {
    question: "What happens after I pay?",
    answer: "You'll get a project checklist and timeline. I send updates at every milestone, and you can request revisions until you're happy before launch.",
    category: "General",
  },
  {
    question: "Do you provide SEO and digital marketing services?",
    answer: "Yes. Standard SEO setup is included with most sites, and I also offer ongoing digital marketing support to help you grow traffic and conversions.",
    category: "Support",
  },
];

export function loadFAQData(): FAQItemData[] {
  try {
    const raw = localStorage.getItem("ar_faq_data");
    return raw ? JSON.parse(raw) : faqData;
  } catch { return faqData; }
}

export function saveFAQData(list: FAQItemData[]) {
  localStorage.setItem("ar_faq_data", JSON.stringify(list));
}
