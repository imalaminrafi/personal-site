import { useState, useEffect } from "react";

/**
 * Mobile-only sticky CTA: appears after the user scrolls past the hero and
 * disappears once they reach the contact section.
 */
export default function GetStartedButton() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const contact = document.getElementById("contact");
            const contactTop = contact?.offsetTop ?? Number.POSITIVE_INFINITY;
            const y = window.scrollY;
            setVisible(y > 420 && y < contactTop - 700);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = () => {
        const contact = document.getElementById("contact");
        if (contact) {
            contact.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div
            className={`sm:hidden fixed bottom-5 left-4 right-20 z-[60] transition-all duration-300 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
            }`}
        >
            <button
                onClick={handleClick}
                className="w-full bg-[#C9A84C] text-[#0F172A] font-bold text-base py-4 rounded-xl shadow-lg shadow-black/30 hover:brightness-110 active:scale-[0.99] transition-all"
            >
                Get Started — Free Consultation
            </button>
        </div>
    );
}
