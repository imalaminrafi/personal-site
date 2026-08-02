import ModernHeader from "@/components/modern/Header";
import ProfessionalFooter from "@/components/professional/Footer";
import MobileBottomNav from "@/components/professional/MobileNav";
import SectionBoundary from "@/components/SectionBoundary";

/** Shared chrome for public pages: header + footer + mobile bottom nav. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <ModernHeader />
      <main className="pt-20">
        <SectionBoundary name="PageContent">{children}</SectionBoundary>
      </main>
      <ProfessionalFooter />
      <MobileBottomNav />
    </div>
  );
}
