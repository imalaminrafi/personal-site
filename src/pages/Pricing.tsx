import { useEffect } from "react";
import PublicLayout from "@/components/app/PublicLayout";
import PricingSection from "@/components/professional/Pricing";

export default function PricingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <PublicLayout>
      <PricingSection />
    </PublicLayout>
  );
}
