import { useState, useEffect, useCallback } from "react";

// Default: New Delhi (India Gate)
const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.209 };

/**
 * Reverse geocode lat/lng to city name using free Nominatim API.
 */
async function reverseGeocode(lat, lng) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10&addressdetails=1`,
            { headers: { "User-Agent": "MargDarshak/1.0" } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        const addr = data.address;
        return (
            addr?.city ||
            addr?.town ||
            addr?.village ||
            addr?.state_district ||
            addr?.state ||
            null
        );
    } catch {
        return null;
    }
}

/**
 * Forward geocode a city name to lat/lng using free Nominatim API.
 * Biases results toward India.
 */
async function forwardGeocode(cityName) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)},India&format=json&limit=1`,
            { headers: { "User-Agent": "MargDarshak/1.0" } }
        );
        if (!res.ok) return null;
        const data = await res.json();
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
                city: data[0].display_name.split(",")[0],
            };
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Detects user's current location via browser Geolocation API.
 * Provides reverse geocoded city name.
 * Supports manual city override when permission is denied.
 *
 * Returns { location, city, error, loading, permissionDenied, setManualCity }
 */
export default function useGeolocation() {
    const [location, setLocation] = useState(null);
    const [city, setCity] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [permissionDenied, setPermissionDenied] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported");
            setLocation(DEFAULT_LOCATION);
            setPermissionDenied(true);
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const loc = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };
                setLocation(loc);
                setLoading(false);

                // Reverse geocode to get city name
                const cityName = await reverseGeocode(loc.lat, loc.lng);
                if (cityName) setCity(cityName);
            },
            (err) => {
                console.warn("[MargDarshak] Geolocation denied:", err.message);
                setError(err.message);
                setLocation(DEFAULT_LOCATION);
                setPermissionDenied(true);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 300000, // cache for 5 min
            }
        );
    }, []);

    /**
     * Manual city override — forward geocodes city name to coordinates.
     * Returns true on success, false on failure.
     */
    const setManualCity = useCallback(async (cityName) => {
        if (!cityName?.trim()) return false;

        const result = await forwardGeocode(cityName.trim());
        if (result) {
            setLocation({ lat: result.lat, lng: result.lng });
            setCity(result.city || cityName.trim());
            setError(null);
            return true;
        }
        return false;
    }, []);

    return { location, city, error, loading, permissionDenied, setManualCity };
}
