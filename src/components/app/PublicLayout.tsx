import ModernHeader from "@/components/modern/Header";
import ProfessionalFooter from "@/components/professional/Footer";
import SectionBoundary from "@/components/SectionBoundary";

/** Shared chrome for public pages: header + footer. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <ModernHeader />
      <main className="pt-20">
        <SectionBoundary name="PageContent">{children}</SectionBoundary>
      </main>
      <ProfessionalFooter />
    </div>
  );
}
