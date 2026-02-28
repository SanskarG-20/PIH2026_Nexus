import { useState, useEffect } from "react";

// Default: New Delhi (India Gate)
const DEFAULT_LOCATION = { lat: 28.6139, lng: 77.209 };

/**
 * Detects user's current location via browser Geolocation API.
 * Falls back to Delhi if denied/unavailable.
 *
 * Returns { location, error, loading }
 */
export default function useGeolocation() {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported");
            setLocation(DEFAULT_LOCATION);
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                setLoading(false);
            },
            (err) => {
                console.warn("[MargDarshak] Geolocation denied:", err.message);
                setError(err.message);
                setLocation(DEFAULT_LOCATION);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 300000, // cache for 5 min
            }
        );
    }, []);

    return { location, error, loading };
}
