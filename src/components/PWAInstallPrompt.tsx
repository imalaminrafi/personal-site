import { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [show, setShow] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        /* Check if already installed */
        const isStandalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
        if (isStandalone) return;

        /* Check if dismissed recently */
        const dismissed = localStorage.getItem("pwa-dismissed");
        if (dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000) {
            return;
        }

        /* Detect iOS */
        const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
        setIsIOS(ios);

        /* Android / Chrome: capture the native prompt */
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener("beforeinstallprompt", handler);

        /* Show after 5s or on scroll */
        const showPrompt = () => setShow(true);
        const t = setTimeout(showPrompt, 5000);
        
        const scrollHandler = () => {
            if (window.scrollY > 150) {
                showPrompt();
                window.removeEventListener("scroll", scrollHandler);
            }
        };
        window.addEventListener("scroll", scrollHandler, { passive: true });

        return () => {
            clearTimeout(t);
            window.removeEventListener("beforeinstallprompt", handler);
            window.removeEventListener("scroll", scrollHandler);
        };
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") setShow(false);
            setDeferredPrompt(null);
        } else if (isIOS) {
            alert('Tap "Share" in Safari, then "Add to Home Screen" to install.');
            setShow(false);
        } else {
            // Fallback for browsers that don't support beforeinstallprompt
            alert("To install, use your browser's menu and select 'Install' or 'Add to Home Screen'.");
            setShow(false);
        }
    };

    const dismiss = () => {
        setShow(false);
        /* Don't show again for 7 days */
        localStorage.setItem("pwa-dismissed", String(Date.now()));
    };

    if (!show) return null;

    return (
        <div className="sm:hidden fixed bottom-[90px] left-4 right-4 z-[80] animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white dark:bg-[#0F2040] rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">AR</span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-base font-semibold text-zinc-900 dark:text-white leading-snug mb-0.5">
                            Install App
                        </p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            Get faster access and better experience
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 mt-1">
                    <button
                        onClick={handleInstall}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-[#0A1628] text-sm font-semibold hover:brightness-110 transition-all"
                    >
                        <Download className="w-4 h-4" /> Install
                    </button>
                    <button
                        onClick={dismiss}
                        className="flex-1 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-[#14233F] text-zinc-600 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Later
                    </button>
                </div>
            </div>
        </div>
    );
}
