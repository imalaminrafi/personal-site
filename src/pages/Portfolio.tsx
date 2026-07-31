import ModernHeader from "@/components/modern/Header";
import ProjectsSection from "@/components/professional/Projects";
import ProfessionalFooter from "@/components/professional/Footer";
import BottomNav from "@/components/app/BottomNav";
import { useEffect } from "react";
import { trackPortfolioView } from "@/utils/analytics";

export default function PortfolioPage() {
    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
        trackPortfolioView("all");
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
            <ModernHeader />
            <main className="pt-20">
                {/* We will use the same ProjectsSection but without the 'landing' restrictions */}
                <ProjectsSection isLanding={false} />
            </main>
            <ProfessionalFooter />
            <BottomNav />
        </div>
    );
}
