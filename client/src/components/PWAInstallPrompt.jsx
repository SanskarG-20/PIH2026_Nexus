import { useState, useEffect } from "react";
import { Y, BK } from "../constants/theme";

/**
 * PWA Install Prompt — shows a sticky install button when the
 * browser exposes the `beforeinstallprompt` event (Chrome / Edge / Samsung).
 */
export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);
    const [installed, setInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed (standalone mode)
        if (window.matchMedia("(display-mode: standalone)").matches) return;

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setVisible(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Listen for successful install
        window.addEventListener("appinstalled", () => {
            setInstalled(true);
            setVisible(false);
            setDeferredPrompt(null);
        });

        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setInstalled(true);
        }
        setVisible(false);
        setDeferredPrompt(null);
    };

    if (!visible || installed) return null;

    return (
        <button
            onClick={handleInstall}
            style={{
                position: "fixed",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 22px",
                background: Y,
                color: BK,
                border: "none",
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 16,
                letterSpacing: 2,
                cursor: "pointer",
                boxShadow: `0 4px 20px rgba(198,255,0,.35)`,
                transition: "transform .15s ease, box-shadow .15s ease",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(-50%) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 28px rgba(198,255,0,.5)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(-50%) scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(198,255,0,.35)";
            }}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" /><path d="M19 12l-7 7-7-7" />
                <line x1="5" y1="21" x2="19" y2="21" />
            </svg>
            INSTALL APP
        </button>
    );
}
