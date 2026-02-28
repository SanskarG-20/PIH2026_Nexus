/**
 * WhyThisRoute — Explainable AI component for MargDarshak.
 *
 * Renders below the selected (best) transport option showing
 * human-readable reasons for why this route was chosen.
 */
import { Y, BK } from "../constants/theme";

export default function WhyThisRoute({ reasons }) {
    if (!reasons || reasons.length === 0) return null;

    return (
        <div
            style={{
                marginTop: 8,
                padding: "10px 14px",
                background: "rgba(204,255,0,.03)",
                border: "1px solid rgba(204,255,0,.10)",
                borderLeft: `3px solid ${Y}`,
            }}
        >
            {/* Header */}
            <div
                style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 11,
                    letterSpacing: 2,
                    color: Y,
                    marginBottom: 8,
                }}
            >
                WHY THIS ROUTE?
            </div>

            {/* Reason list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {reasons.map((reason, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 6,
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 12,
                            color: "rgba(255,255,255,.7)",
                            lineHeight: 1.4,
                            animation: `ldm-step-in 0.3s ease both`,
                            animationDelay: `${i * 0.08}s`,
                        }}
                    >
                        <span
                            style={{
                                color: Y,
                                fontSize: 12,
                                fontWeight: 700,
                                flexShrink: 0,
                                marginTop: 1,
                            }}
                        >
                            ✓
                        </span>
                        <span>{reason}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
