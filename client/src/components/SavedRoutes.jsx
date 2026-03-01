import { useState, useEffect, useCallback } from "react";
import { Y, BK, WH } from "../constants/theme";
import { getSavedTrips, deleteSavedTrip } from "../services/supabaseClient";

const MODE_EMOJI = {
    train: "\u25A0",
    metro: "\u25C6",
    bus: "\u25A3",
    cab: "\u25C8",
    walk: "\u25CB",
    auto: "\u25B8",
};

export default function SavedRoutes({ dbUser, onSelectRoute }) {
    const [trips, setTrips] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchTrips = useCallback(async () => {
        if (!dbUser?.id) return;
        setLoading(true);
        const data = await getSavedTrips(dbUser.id);
        setTrips(data);
        setLoading(false);
    }, [dbUser?.id]);

    // Fetch on open
    useEffect(() => {
        if (open) fetchTrips();
    }, [open, fetchTrips]);

    // Expose refresh method via custom event
    useEffect(() => {
        const handler = () => fetchTrips();
        window.addEventListener("savedtrips:refresh", handler);
        return () => window.removeEventListener("savedtrips:refresh", handler);
    }, [fetchTrips]);

    const handleDelete = async (e, tripId) => {
        e.stopPropagation();
        const ok = await deleteSavedTrip(tripId);
        if (ok) setTrips((prev) => prev.filter((t) => t.id !== tripId));
    };

    const handleSelect = (trip) => {
        onSelectRoute?.(trip.source, trip.destination);
    };

    return (
        <div style={{ marginBottom: 24 }}>
            {/* Toggle button */}
            <button
                onClick={() => setOpen((o) => !o)}
                data-hover
                style={{
                    width: "100%",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 16,
                    letterSpacing: 2,
                    color: Y,
                    background: "rgba(204,255,0,.04)",
                    border: `1px solid rgba(204,255,0,.15)`,
                    cursor: "pointer",
                    transition: "all .15s",
                }}
            >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    \u2606 SAVED ROUTES
                    {trips.length > 0 && (
                        <span style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 10,
                            fontWeight: 700,
                            color: BK,
                            background: Y,
                            padding: "1px 6px",
                            borderRadius: 2,
                            minWidth: 18,
                            textAlign: "center",
                        }}>
                            {trips.length}
                        </span>
                    )}
                </span>
                <span style={{
                    fontSize: 12,
                    transition: "transform .2s",
                    transform: open ? "rotate(180deg)" : "rotate(0)",
                    display: "inline-block",
                }}>
                    ▼
                </span>
            </button>

            {/* Saved list */}
            {open && (
                <div style={{
                    border: "1px solid rgba(255,255,255,.08)",
                    borderTop: "none",
                    background: "rgba(255,255,255,.02)",
                    maxHeight: 280,
                    overflowY: "auto",
                }}>
                    {loading && (
                        <div style={{
                            padding: "20px",
                            textAlign: "center",
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 12,
                            color: "rgba(255,255,255,.3)",
                        }}>
                            Loading...
                        </div>
                    )}

                    {!loading && trips.length === 0 && (
                        <div style={{
                            padding: "24px 20px",
                            textAlign: "center",
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 13,
                            color: "rgba(255,255,255,.25)",
                        }}>
                            No saved routes yet.
                            <br />
                            <span style={{ fontSize: 11, opacity: 0.6 }}>
                                Save a route from AI transport analysis to see it here.
                            </span>
                        </div>
                    )}

                    {!loading && trips.map((trip) => (
                        <div
                            key={trip.id}
                            onClick={() => handleSelect(trip)}
                            data-hover
                            style={{
                                padding: "12px 16px",
                                borderBottom: "1px solid rgba(255,255,255,.05)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: 10,
                                transition: "background .15s",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(204,255,0,.04)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    marginBottom: 3,
                                }}>
                                    <span style={{
                                        fontFamily: "'DM Sans',sans-serif",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "rgba(255,255,255,.8)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}>
                                        {trip.source}
                                    </span>
                                    <span style={{
                                        fontFamily: "'Bebas Neue',sans-serif",
                                        fontSize: 11,
                                        color: Y,
                                        flexShrink: 0,
                                    }}>
                                        →
                                    </span>
                                    <span style={{
                                        fontFamily: "'DM Sans',sans-serif",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "rgba(255,255,255,.8)",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}>
                                        {trip.destination}
                                    </span>
                                </div>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}>
                                    {trip.preferred_mode && (
                                        <span style={{
                                            fontFamily: "'DM Sans',sans-serif",
                                            fontSize: 10,
                                            letterSpacing: 1,
                                            textTransform: "uppercase",
                                            color: Y,
                                            opacity: 0.7,
                                        }}>
                                            {MODE_EMOJI[trip.preferred_mode] || "\u25C6"} {trip.preferred_mode}
                                        </span>
                                    )}
                                    <span style={{
                                        fontFamily: "'DM Sans',sans-serif",
                                        fontSize: 10,
                                        color: "rgba(255,255,255,.2)",
                                    }}>
                                        {new Date(trip.created_at).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Delete button */}
                            <button
                                onClick={(e) => handleDelete(e, trip.id)}
                                data-hover
                                style={{
                                    background: "none",
                                    border: "1px solid rgba(239,68,68,.2)",
                                    color: "rgba(239,68,68,.5)",
                                    fontFamily: "'DM Sans',sans-serif",
                                    fontSize: 10,
                                    padding: "3px 8px",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                    transition: "all .15s",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(239,68,68,.1)";
                                    e.currentTarget.style.color = "#ef4444";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "none";
                                    e.currentTarget.style.color = "rgba(239,68,68,.5)";
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
