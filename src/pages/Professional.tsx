import ProfessionalHeader from "@/components/professional/Header";
import ProfessionalHero from "@/components/professional/Hero";
import ProfessionalAbout from "@/components/professional/About";
import ProfessionalExperience from "@/components/professional/Experience";
import ProfessionalSkills from "@/components/professional/Skills";
import ProfessionalAchievements from "@/components/professional/Achievements";
import ProfessionalContact from "@/components/professional/Contact";
import ProfessionalFooter from "@/components/professional/Footer";

export default function ProfessionalPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950">
            <ProfessionalHeader />
            <main>
                <ProfessionalHero />
                <ProfessionalAbout />
                <ProfessionalExperience />
                <ProfessionalSkills />
                <ProfessionalAchievements />
                <ProfessionalContact />
            </main>
            <ProfessionalFooter />
        </div>
    );
}
