import { useEffect } from "react";
import PublicLayout from "@/components/app/PublicLayout";

const sections = [
  {
    title: "Services",
    body: "By engaging Alamin Rafi for website design, development, WordPress, UI/UX, or digital marketing services, you agree to the project scope, timeline, and pricing agreed upon before work begins. Any changes to scope may affect pricing and delivery.",
  },
  {
    title: "Payments",
    body: "Project payments and deposits are due as agreed in the proposal. Digital products (books, guides, templates) are delivered electronically after payment is confirmed and are non-refundable once downloaded.",
  },
  {
    title: "Deliverables",
    body: "Final project files are delivered after full payment. Revisions within the agreed scope are included; out-of-scope changes are quoted separately.",
  },
  {
    title: "Intellectual property",
    body: "Upon full payment, you own the final deliverables. Alamin Rafi retains the right to showcase completed work in a portfolio unless a confidentiality agreement is in place.",
  },
  {
    title: "Limitation of liability",
    body: "We provide services on a best-effort basis and are not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount paid for the specific service.",
  },
  {
    title: "Governing law",
    body: "These terms are governed by applicable local law. Questions about these terms can be directed to hello@alaminrafi.com.",
  },
];

export default function TermsPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <PublicLayout>
      <article className="max-w-2xl mx-auto px-5 sm:px-6 py-10 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">Legal</p>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">Terms of Service</h1>
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
