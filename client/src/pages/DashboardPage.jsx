import { UserButton, useUser } from "@clerk/clerk-react";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Y, BK, WH } from "../constants/theme";
import useUserSync from "../hooks/useUserSync";
import useGeolocation from "../hooks/useGeolocation";
import { saveUserLocation } from "../services/supabaseClient";
import Cursor from "../components/Cursor";
import LocationBar from "../components/LocationBar";
import IntentInput from "../components/IntentInput";
import AIChat from "../components/AIChat";
import MapView from "../components/MapView";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const { dbUser } = useUserSync();
    const { location: userLocation, city, loading: geoLoading, permissionDenied, setManualCity } = useGeolocation();
    const [aiActive, setAiActive] = useState(false);
    const [mapActive, setMapActive] = useState(false);
    const [mapMarkers, setMapMarkers] = useState([]);

    // Save location to Supabase whenever it changes
    useEffect(() => {
        if (dbUser?.id && userLocation?.lat && userLocation?.lng) {
            saveUserLocation({
                userId: dbUser.id,
                lat: userLocation.lat,
                lng: userLocation.lng,
                city: city || null,
            });
        }
    }, [dbUser?.id, userLocation?.lat, userLocation?.lng, city]);

    // Build location context object for AI
    const aiLocationContext = useMemo(() => {
        if (!userLocation) return null;
        return { lat: userLocation.lat, lng: userLocation.lng, city: city || null };
    }, [userLocation, city]);

    const handleAIResponse = useCallback((parsedResult) => {
        setAiActive(true);
        // Extract places with coordinates from AI response for map markers
        if (parsedResult?.places?.length > 0) {
            const newMarkers = parsedResult.places
                .filter((p) => p.lat && p.lng)
                .map((p) => ({
                    name: p.name,
                    lat: p.lat,
                    lng: p.lng,
                    description: p.description,
                    estimatedCost: p.estimatedCost,
                }));
            if (newMarkers.length > 0) {
                setMapMarkers(newMarkers);
            }
        }
    }, []);

    if (!isLoaded) {
        return (
            <div
                className="dark-page"
                style={{
                    minHeight: "100vh",
                    background: BK,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: 24,
                        color: Y,
                        letterSpacing: 3,
                        animation: "pulse-ring 2s ease-out infinite",
                    }}
                >
                    LOADING...
                </div>
            </div>
        );
    }

    return (
        <div
            className="dark-page"
            style={{
                minHeight: "100vh",
                background: BK,
                padding: "100px 32px 60px",
            }}
        >
            <Cursor />

            {/* Grid background */}
            <svg
                style={{
                    position: "fixed",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0.04,
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            >
                <defs>
                    <pattern
                        id="dash-grid"
                        x="0"
                        y="0"
                        width="60"
                        height="60"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M 60 0 L 0 0 0 60"
                            fill="none"
                            stroke={Y}
                            strokeWidth="0.5"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dash-grid)" />
            </svg>

            {/* Watermark */}
            <div
                style={{
                    position: "fixed",
                    bottom: -30,
                    right: -20,
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: "clamp(120px, 20vw, 260px)",
                    color: "rgba(204,255,0,.03)",
                    letterSpacing: -5,
                    userSelect: "none",
                    pointerEvents: "none",
                    zIndex: 0,
                    lineHeight: 0.85,
                }}
            >
                MARG
                <br />
                DARSHAK
            </div>

            {/* Yellow top stripe */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: Y,
                    zIndex: 100,
                }}
            />

            {/* Bottom-right accent bar */}
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    right: 0,
                    width: "35%",
                    height: 4,
                    background: Y,
                    zIndex: 100,
                }}
            />

            <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }}>
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 60,
                    }}
                >
                    <a
                        href="/"
                        style={{
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: 28,
                            color: Y,
                            letterSpacing: 3,
                            textDecoration: "none",
                            lineHeight: 1,
                        }}
                    >
                        MARG
                        <br />
                        DARSHAK
                    </a>
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: {
                                    width: 40,
                                    height: 40,
                                    border: `2px solid ${Y}`,
                                },
                            },
                        }}
                    />
                </div>

                {/* Greeting */}
                <div
                    style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        color: Y,
                        letterSpacing: 4,
                        marginBottom: 16,
                        textTransform: "uppercase",
                    }}
                >
          // WELCOME BACK
                </div>
                <h1
                    style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: "clamp(48px,8vw,96px)",
                        color: WH,
                        lineHeight: 0.9,
                        marginBottom: 32,
                    }}
                >
                    NAMASTE,
                    <br />
                    <span style={{ color: Y }}>
                        {user?.firstName || user?.username || "TRAVELER"}
                    </span>
                    <span style={{ color: "rgba(255,255,255,.2)" }}>.</span>
                </h1>

                {/* Dashboard placeholder */}
                <div
                    style={{
                        border: `2px solid rgba(255,255,255,.1)`,
                        borderLeft: `5px solid ${Y}`,
                        padding: "32px 28px",
                        marginBottom: 24,
                    }}
                >
                    <div
                        style={{
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: 22,
                            color: Y,
                            letterSpacing: 2,
                            marginBottom: 12,
                        }}
                    >
                        TRAVEL DASHBOARD
                    </div>
                    <div
                        style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 15,
                            color: "rgba(255,255,255,.6)",
                            lineHeight: 1.8,
                        }}
                    >
                        Your AI travel intelligence dashboard is being built.
                        <br />
                        Soon you'll see trip planning, weather alerts, route
                        recommendations, and more — all powered by MargDarshak AI.
                    </div>
                </div>

                {/* Location Bar */}
                <LocationBar
                    location={userLocation}
                    city={city}
                    loading={geoLoading}
                    permissionDenied={permissionDenied}
                    onManualCity={setManualCity}
                />

                {/* Intent Input */}
                <IntentInput dbUser={dbUser} />

                {/* AI Chat */}
                <AIChat
                    dbUser={dbUser}
                    onAIResponse={handleAIResponse}
                    userLocation={aiLocationContext}
                />

                {/* Map */}
                <MapView
                    userLocation={userLocation}
                    markers={mapMarkers}
                    onMapReady={() => setMapActive(true)}
                />

                {/* Status indicators */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: 12,
                    }}
                >
                    {[
                        { label: "AUTH", status: "ACTIVE", ok: true },
                        { label: "DATABASE", status: "ACTIVE", ok: true },
                        { label: "AI ENGINE", status: aiActive ? "ACTIVE" : "PENDING", ok: aiActive },
                        { label: "MAPS", status: mapActive ? "ACTIVE" : "PENDING", ok: mapActive },
                    ].map((item) => (
                        <div
                            key={item.label}
                            style={{
                                padding: "20px 16px",
                                border: `1px solid ${item.ok ? Y : "rgba(255,255,255,.08)"
                                    }`,
                                background: item.ok
                                    ? "rgba(204,255,0,.05)"
                                    : "rgba(255,255,255,.02)",
                            }}
                        >
                            <div
                                style={{
                                    fontFamily: "'Bebas Neue',sans-serif",
                                    fontSize: 14,
                                    color: "rgba(255,255,255,.4)",
                                    letterSpacing: 2,
                                    marginBottom: 8,
                                }}
                            >
                                {item.label}
                            </div>
                            <div
                                style={{
                                    fontFamily: "'Bebas Neue',sans-serif",
                                    fontSize: 18,
                                    color: item.ok ? Y : "rgba(255,255,255,.25)",
                                    letterSpacing: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <span
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: item.ok ? Y : "rgba(255,255,255,.2)",
                                        display: "inline-block",
                                    }}
                                />
                                {item.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
