import { useState } from "react";
import { Y, BK, WH } from "../constants/theme";

/**
 * LocationBar — Shows detected location or manual city input fallback.
 *
 * Props:
 *  - location: { lat, lng } | null
 *  - city: string | null
 *  - loading: boolean
 *  - permissionDenied: boolean
 *  - onManualCity: (cityName) => Promise<boolean>
 */
export default function LocationBar({
    location,
    city,
    loading,
    permissionDenied,
    onManualCity,
}) {
    const [manualInput, setManualInput] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (!manualInput.trim() || searching) return;

        setSearching(true);
        setSearchError(null);

        const success = await onManualCity(manualInput.trim());
        setSearching(false);

        if (success) {
            setManualInput("");
        } else {
            setSearchError("City not found. Try again.");
        }
    };

    return (
        <div
            style={{
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.02)",
                padding: "16px 20px",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
            }}
        >
            {/* Location icon */}
            <div
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: location && !permissionDenied
                        ? "rgba(204,255,0,.1)"
                        : "rgba(255,255,255,.05)",
                    border: `1px solid ${
                        location && !permissionDenied ? Y : "rgba(255,255,255,.15)"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                }}
            >
                <span style={{ fontSize: 14 }}>
                    {loading ? "◎" : location && !permissionDenied ? "◉" : "○"}
                </span>
            </div>

            {/* Status text */}
            <div style={{ flex: 1, minWidth: 150 }}>
                <div
                    style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: 12,
                        color: "rgba(255,255,255,.4)",
                        letterSpacing: 2,
                        marginBottom: 2,
                    }}
                >
                    YOUR LOCATION
                </div>

                {loading ? (
                    <div
                        style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 14,
                            color: Y,
                            animation: "pulse-ring 1.5s ease infinite",
                        }}
                    >
                        Detecting...
                    </div>
                ) : city ? (
                    <div
                        style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 15,
                            color: WH,
                            fontWeight: 600,
                        }}
                    >
                        {city}
                        <span
                            style={{
                                fontSize: 11,
                                color: "rgba(255,255,255,.3)",
                                marginLeft: 8,
                                fontWeight: 400,
                            }}
                        >
                            {location?.lat?.toFixed(4)}, {location?.lng?.toFixed(4)}
                        </span>
                    </div>
                ) : location ? (
                    <div
                        style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 14,
                            color: "rgba(255,255,255,.5)",
                        }}
                    >
                        {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </div>
                ) : null}

                {permissionDenied && !city && (
                    <div
                        style={{
                            fontFamily: "'DM Sans',sans-serif",
                            fontSize: 12,
                            color: "rgba(255,255,255,.35)",
                            marginTop: 2,
                        }}
                    >
                        Location access denied — enter your city below
                    </div>
                )}
            </div>

            {/* Manual city input (shown when permission denied OR user wants to change) */}
            <form
                onSubmit={handleManualSubmit}
                style={{
                    display: "flex",
                    gap: 0,
                    flexShrink: 1,
                    minWidth: 0,
                    width: "100%",
                    maxWidth: 280,
                }}
            >
                <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => {
                        setManualInput(e.target.value);
                        setSearchError(null);
                    }}
                    placeholder={permissionDenied ? "Enter city name..." : "Change city..."}
                    style={{
                        padding: "8px 14px",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 13,
                        color: WH,
                        background: "rgba(255,255,255,.05)",
                        border: `1px solid ${
                            searchError ? "#ef4444" : "rgba(255,255,255,.12)"
                        }`,
                        borderRight: "none",
                        outline: "none",
                        width: "100%",
                        flex: 1,
                        minWidth: 0,
                        transition: "border-color .2s",
                    }}
                    onFocus={(e) =>
                        (e.target.style.borderColor = searchError ? "#ef4444" : Y)
                    }
                    onBlur={(e) =>
                        (e.target.style.borderColor = searchError
                            ? "#ef4444"
                            : "rgba(255,255,255,.12)")
                    }
                />
                <button
                    type="submit"
                    disabled={searching || !manualInput.trim()}
                    data-hover
                    style={{
                        padding: "8px 16px",
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: 13,
                        letterSpacing: 1,
                        color: BK,
                        background: searching ? "rgba(204,255,0,.5)" : Y,
                        border: `1px solid ${Y}`,
                        cursor: searching ? "wait" : "pointer",
                        transition: "all .15s",
                        whiteSpace: "nowrap",
                    }}
                >
                    {searching ? "..." : "SET →"}
                </button>
            </form>
        </div>
    );
}
