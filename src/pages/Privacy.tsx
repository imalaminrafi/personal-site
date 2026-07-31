import { useEffect } from "react";
import PublicLayout from "@/components/app/PublicLayout";

const sections = [
  {
    title: "Information we collect",
    body: "This website does not require an account to browse. If you use the contact form, we receive the name, email address, and message you provide. We use Google Analytics, which collects anonymous, aggregated usage data (pages viewed, approximate location, device type) to understand how the site is used.",
  },
  {
    title: "How we use your information",
    body: "Your contact details are used only to respond to your enquiry or provide the services you request. Analytics data is used to improve the website's content, performance, and usability. We never sell your personal information.",
  },
  {
    title: "Cookies & consent",
    body: "We use a minimal set of cookies for essential site functions (such as saving your theme preference) and for Google Analytics. A consent banner lets you accept or decline analytics tracking. You can change your choice at any time, and we respect your browser's privacy settings (including Do Not Track).",
  },
  {
    title: "Data retention",
    body: "Contact messages are kept only for as long as needed to complete the request. You may ask us to delete any personal data you have shared at any time.",
  },
  {
    title: "Your rights",
    body: "Depending on your location, you may have rights to access, correct, or delete your personal data, and to object to processing. Contact us and we will honour your request within a reasonable time.",
  },
  {
    title: "Contact",
    body: "For any privacy questions or requests, email hello@alaminrafi.com or use the contact form.",
  },
];

export default function PrivacyPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <PublicLayout>
      <article className="max-w-2xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">Legal</p>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-xs text-zinc-400 mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <div className="space-y-6">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-1.5">{s.title}</h2>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
    </PublicLayout>
  );
}
