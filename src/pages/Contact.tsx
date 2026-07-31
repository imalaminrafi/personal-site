import { useEffect } from "react";
import PublicLayout from "@/components/app/PublicLayout";
import ProfessionalContact from "@/components/professional/Contact";

export default function ContactPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <PublicLayout>
      <ProfessionalContact />
    </PublicLayout>
  );
}
