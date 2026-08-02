import ModernHeader from "@/components/modern/Header";
import ModernHeroVisual from "@/components/modern/Hero";
import ServicesSection from "@/components/professional/Services";
import PricingSection from "@/components/professional/Pricing";
import WhyMeSection from "@/components/professional/WhyMe";
import AboutSection from "@/components/professional/About";
import ProfessionalContact from "@/components/professional/Contact";
import ProfessionalFooter from "@/components/professional/Footer";
import GrowthInsightsSection from "@/components/professional/GrowthInsights";
import MyBooksSection from "@/components/professional/MyBooks";
import GetStartedButton from "@/components/professional/GetStarted";
import SectionBoundary from "@/components/SectionBoundary";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function ModernPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0A1628]">
            <ModernHeader />
            <main>
                <SectionBoundary name="Hero"><ModernHeroVisual /></SectionBoundary>
                <SectionBoundary name="About"><AboutSection /></SectionBoundary>
                <SectionBoundary name="Services"><ServicesSection /></SectionBoundary>
                <SectionBoundary name="Insights"><GrowthInsightsSection /></SectionBoundary>
                <SectionBoundary name="Pricing"><PricingSection /></SectionBoundary>
                <SectionBoundary name="WhyMe"><WhyMeSection /></SectionBoundary>
                <SectionBoundary name="Books"><MyBooksSection /></SectionBoundary>
                <SectionBoundary name="Contact"><ProfessionalContact /></SectionBoundary>
            </main>
            <GetStartedButton />
            <SectionBoundary name="Footer"><ProfessionalFooter /></SectionBoundary>
            <SectionBoundary name="PWAInstallPrompt" fallback={null}><PWAInstallPrompt /></SectionBoundary>
        </div>
    );
}
