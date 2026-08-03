import ProfessionalHeader from "@/components/professional/Header";
import ProfessionalHero from "@/components/professional/Hero";
import ProfessionalAbout from "@/components/professional/About";
import ProfessionalExperience from "@/components/professional/Experience";
import ProfessionalSkills from "@/components/professional/Skills";
import ProfessionalAchievements from "@/components/professional/Achievements";
import ProfessionalContact from "@/components/professional/Contact";
import ProfessionalFooter from "@/components/professional/Footer";
import SectionBoundary from "@/components/SectionBoundary";

export default function ProfessionalPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0F172A]">
            <ProfessionalHeader />
            <main>
                <SectionBoundary name="Hero"><ProfessionalHero /></SectionBoundary>
                <SectionBoundary name="About"><ProfessionalAbout /></SectionBoundary>
                <SectionBoundary name="Experience"><ProfessionalExperience /></SectionBoundary>
                <SectionBoundary name="Skills"><ProfessionalSkills /></SectionBoundary>
                <SectionBoundary name="Achievements"><ProfessionalAchievements /></SectionBoundary>
                <SectionBoundary name="Contact"><ProfessionalContact /></SectionBoundary>
            </main>
            <SectionBoundary name="Footer"><ProfessionalFooter /></SectionBoundary>
        </div>
    );
}
