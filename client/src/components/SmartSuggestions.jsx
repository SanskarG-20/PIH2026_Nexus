import { useState, useEffect } from "react";
import { Y, BK } from "../constants/theme";

const SECTION_ICONS = {
    attractions: "\u25C8",
    food: "\u25C7",
    returnTime: "\u25CB",
    tips: "\u25B8",
};

export default function SmartSuggestions({ suggestions }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 600);
        return () => clearTimeout(t);
    }, []);

    if (!suggestions) return null;

    const { nearbyAttractions, foodSpots, bestReturnTime, localTips } = suggestions;
    const hasContent = nearbyAttractions?.length || foodSpots?.length || bestReturnTime || localTips?.length;
    if (!hasContent) return null;

    return (
        <div style={{
            marginTop: 14,
            border: `1px solid rgba(204,255,0,.12)`,
            background: "rgba(204,255,0,.02)",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
        }}>
            {/* Header */}
            <div style={{
                padding: "10px 16px",
                borderBottom: "1px solid rgba(204,255,0,.08)",
                display: "flex",
                alignItems: "center",
                gap: 8,
            }}>
                <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: Y,
                    boxShadow: `0 0 6px ${Y}`,
                    display: "inline-block",
                }} />
                <span style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 13,
                    letterSpacing: 2.5,
                    color: Y,
                }}>
                    SMART SUGGESTIONS
                </span>
                <span style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 10,
                    color: "rgba(255,255,255,.3)",
                    marginLeft: "auto",
                    letterSpacing: 1,
                }}>
                    POWERED BY AI
                </span>
            </div>

            <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Nearby Attractions */}
                {nearbyAttractions?.length > 0 && (
                    <SuggestionBlock
                        icon={SECTION_ICONS.attractions}
                        title="NEARBY ATTRACTIONS"
                        delay={0}
                    >
                        {nearbyAttractions.map((a, i) => (
                            <div key={i} style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                flexWrap: "wrap",
                                gap: 4,
                                padding: "4px 0",
                                borderBottom: i < nearbyAttractions.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none",
                            }}>
                                <div>
                                    <span style={{
                                        fontFamily: "'DM Sans',sans-serif",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "rgba(255,255,255,.75)",
                                    }}>
                                        {a.name}
                                    </span>
                                    {a.why && (
                                        <span style={{
                                            fontFamily: "'DM Sans',sans-serif",
                                            fontSize: 11,
                                            color: "rgba(255,255,255,.35)",
                                            marginLeft: 6,
                                        }}>
                                            — {a.why}
                                        </span>
                                    )}
                                </div>
                                {a.distance && (
                                    <span style={{
                                        fontFamily: "'Bebas Neue',sans-serif",
                                        fontSize: 11,
                                        color: Y,
                                        opacity: 0.7,
                                        whiteSpace: "nowrap",
                                        marginLeft: 8,
                                    }}>
                                        {a.distance}
                                    </span>
                                )}
                            </div>
                        ))}
                    </SuggestionBlock>
                )}

                {/* Food Spots */}
                {foodSpots?.length > 0 && (
                    <SuggestionBlock
                        icon={SECTION_ICONS.food}
                        title="FOOD SPOTS"
                        delay={1}
                    >
                        {foodSpots.map((f, i) => (
                            <div key={i} style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "baseline",
                                flexWrap: "wrap",
                                gap: 4,
                                padding: "4px 0",
                                borderBottom: i < foodSpots.length - 1 ? "1px solid rgba(255,255,255,.04)" : "none",
                            }}>
                                <div>
                                    <span style={{
                                        fontFamily: "'DM Sans',sans-serif",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "rgba(255,255,255,.75)",
                                    }}>
                                        {f.name}
                                    </span>
                                    {f.cuisine && (
                                        <span style={{
                                            fontFamily: "'DM Sans',sans-serif",
                                            fontSize: 10,
                                            letterSpacing: 0.5,
                                            color: "#f97316",
                                            marginLeft: 6,
                                            padding: "1px 5px",
                                            background: "rgba(249,115,22,.08)",
                                            border: "1px solid rgba(249,115,22,.15)",
                                        }}>
                                            {f.cuisine}
                                        </span>
                                    )}
                                </div>
                                {f.priceRange && (
                                    <span style={{
                                        fontFamily: "'Bebas Neue',sans-serif",
                                        fontSize: 12,
                                        color: "#22c55e",
                                        whiteSpace: "nowrap",
                                        marginLeft: 8,
                                    }}>
                                        {f.priceRange}
                                    </span>
                                )}
                            </div>
                        ))}
                    </SuggestionBlock>
                )}

                {/* Best Return Time */}
                {bestReturnTime && (
                    <SuggestionBlock
                        icon={SECTION_ICONS.returnTime}
                        title="BEST RETURN TIME"
                        delay={2}
                    >
                        <div style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 13,
                            color: "rgba(255,255,255,.65)",
                            lineHeight: 1.5,
                        }}>
                            {bestReturnTime}
                        </div>
                    </SuggestionBlock>
                )}

                {/* Local Tips */}
                {localTips?.length > 0 && (
                    <SuggestionBlock
                        icon={SECTION_ICONS.tips}
                        title="LOCAL TIPS"
                        delay={3}
                    >
                        {localTips.map((tip, i) => (
                            <div key={i} style={{
                                fontFamily: "'DM Sans',sans-serif",
                                fontSize: 12,
                                color: "rgba(255,255,255,.5)",
                                paddingLeft: 12,
                                marginBottom: 3,
                                borderLeft: `2px solid rgba(204,255,0,.15)`,
                                lineHeight: 1.5,
                            }}>
                                {tip}
                            </div>
                        ))}
                    </SuggestionBlock>
                )}
            </div>
        </div>
    );
}

function SuggestionBlock({ icon, title, delay, children }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setShow(true), 200 + delay * 150);
        return () => clearTimeout(t);
    }, [delay]);

    return (
        <div style={{
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 6,
            }}>
                <span style={{ fontSize: 12 }}>{icon}</span>
                <span style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 11,
                    letterSpacing: 2,
                    color: "rgba(255,255,255,.4)",
                }}>
                    {title}
                </span>
            </div>
            {children}
        </div>
    );
}
