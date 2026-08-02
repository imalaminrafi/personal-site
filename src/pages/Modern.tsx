import ModernHeader from "@/components/modern/Header";
import ModernHeroVisual from "@/components/modern/Hero";
import ServicesSection from "@/components/professional/Services";
import PricingSection from "@/components/professional/Pricing";
import AboutSection from "@/components/professional/About";
import ProfessionalContact from "@/components/professional/Contact";
import ProfessionalFooter from "@/components/professional/Footer";
import MobileBottomNav from "@/components/professional/MobileNav";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function ModernPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            <ModernHeader />
            <main>
                <ModernHeroVisual />
                <AboutSection />
                <ServicesSection />
                <PricingSection />
                <ProfessionalContact />
            </main>
            <ProfessionalFooter />
            <MobileBottomNav />
            <PWAInstallPrompt />
        </div>
    );
}
