/**
 * SOS Emergency Service — handles GPS detection, emergency message
 * generation, alert sound, and Supabase logging.
 *
 * Designed for <1s activation. Falls back to last-known location
 * when offline or GPS unavailable.
 */

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
const LS_LAST_LOCATION = "md_sos_last_location";

/* ── Location helpers ───────────────────────────── */

/** Save location to localStorage for offline fallback */
function cacheLocation(lat, lng, area) {
    try {
        localStorage.setItem(LS_LAST_LOCATION, JSON.stringify({ lat, lng, area, ts: Date.now() }));
    } catch { /* ignore */ }
}

/** Read last-known location from localStorage */
function getCachedLocation() {
    try {
        const raw = localStorage.getItem(LS_LAST_LOCATION);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

/**
 * Attempt to get live GPS coordinates.
 * Resolves in ≤3s, falls back to lastKnown or cache.
 */
export function getLiveLocation(lastKnown) {
    return new Promise((resolve) => {
        // Immediate fallback timer — never block more than 3s
        const fallbackTimer = setTimeout(() => {
            const cached = getCachedLocation();
            if (lastKnown?.lat) {
                resolve({ lat: lastKnown.lat, lng: lastKnown.lng, source: "last-known" });
            } else if (cached) {
                resolve({ lat: cached.lat, lng: cached.lng, source: "cached" });
            } else {
                resolve({ lat: 28.6139, lng: 77.209, source: "default" }); // Delhi fallback
            }
        }, 3000);

        if (!navigator.geolocation) {
            clearTimeout(fallbackTimer);
            const cached = getCachedLocation();
            resolve(cached
                ? { lat: cached.lat, lng: cached.lng, source: "cached" }
                : { lat: 28.6139, lng: 77.209, source: "default" }
            );
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                clearTimeout(fallbackTimer);
                resolve({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    source: "gps",
                });
            },
            () => {
                clearTimeout(fallbackTimer);
                const cached = getCachedLocation();
                if (lastKnown?.lat) {
                    resolve({ lat: lastKnown.lat, lng: lastKnown.lng, source: "last-known" });
                } else if (cached) {
                    resolve({ lat: cached.lat, lng: cached.lng, source: "cached" });
                } else {
                    resolve({ lat: 28.6139, lng: 77.209, source: "default" });
                }
            },
            { enableHighAccuracy: true, timeout: 2500, maximumAge: 60000 }
        );
    });
}

/**
 * Reverse-geocode coordinates to a human-readable area name.
 * Returns area string or null.
 */
export async function getAreaName(lat, lng) {
    try {
        const res = await fetch(
            `${NOMINATIM_URL}?lat=${lat}&lon=${lng}&format=json&zoom=16&addressdetails=1`,
            { headers: { "User-Agent": "MargDarshak-SOS/1.0" }, signal: AbortSignal.timeout(3000) }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const a = data.address || {};
        const area = a.neighbourhood || a.suburb || a.village || a.town || a.city_district || a.city || a.state || null;
        // Cache for offline
        if (area) cacheLocation(lat, lng, area);
        return area;
    } catch {
        // Offline — try cached area
        const cached = getCachedLocation();
        if (cached?.area && Math.abs(cached.lat - lat) < 0.01) return cached.area;
        return null;
    }
}

/* ── Emergency message ──────────────────────────── */

/**
 * Build the emergency message string.
 */
export function buildEmergencyMessage(lat, lng, areaName) {
    const ts = new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kolkata",
    });

    const lines = [
        "SOS EMERGENCY — MargDarshak",
        "",
        areaName ? `Location: ${areaName}` : "Location: Unknown area",
        `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        `Time: ${ts}`,
        "",
        `Google Maps: https://maps.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`,
        "",
        "I need immediate help. Please respond.",
    ];
    return lines.join("\n");
}

/* ── Alert sound (Web Audio API — no external files) ───── */

let audioCtx = null;

export function playAlertSound() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const ctx = audioCtx;

        // Three sharp beeps
        [0, 0.25, 0.5].forEach((offset) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "square";
            osc.frequency.value = 880;
            gain.gain.value = 0.3;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + offset);
            osc.stop(ctx.currentTime + offset + 0.15);
        });
    } catch {
        // Audio not available — silent fail
    }
}

/* ── AI Safety Suggestion (uses existing knowledge) ───── */

const SAFE_PLACES = [
    "nearest police station",
    "nearest hospital or medical center",
    "nearest metro station or railway station",
    "nearest shopping mall or commercial complex",
    "nearest petrol pump (open 24/7)",
    "nearest religious place (temple, gurudwara, mosque, church)",
];

/**
 * Generate a quick AI safety suggestion using existing location data.
 * This is instant (no API call) — just smart local guidance.
 */
export function getSafetyGuidance(areaName, hour) {
    const h = hour ?? new Date().getHours();
    const isNight = h >= 22 || h < 5;

    const suggestions = [];

    if (isNight) {
        suggestions.push("Move to a well-lit main road or 24-hour establishment immediately.");
        suggestions.push("Nearest petrol pump or hospital will be open — head there.");
    } else {
        suggestions.push("Move toward the nearest crowded public area.");
    }

    suggestions.push("Look for " + SAFE_PLACES[Math.floor(Math.random() * SAFE_PLACES.length)] + ".");

    if (areaName) {
        suggestions.push(`Stay near main roads in ${areaName} where you can flag down help.`);
    }

    suggestions.push("Keep your phone charged and location services ON.");
    suggestions.push("If possible, stay on a call with someone you trust until you feel safe.");

    return suggestions;
}

/* ── Supabase logging ───────────────────────────── */
// Logging is handled via the supabaseClient.js `logSOSTrigger` function.
// This service focuses on the emergency logic only.
