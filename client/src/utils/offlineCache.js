/**
 * Offline Cache — persists last successful API data to localStorage.
 * Keys: md_cache_ai, md_cache_weather, md_cache_route
 *
 * Each entry stores: { data, timestamp }
 * TTL: weather 30 min, route 60 min, AI 120 min (stale but usable).
 */

const KEYS = {
    ai: "md_cache_ai",
    weather: "md_cache_weather",
    route: "md_cache_route",
    offline: "md_offline_active",
};

const TTL = {
    ai: 2 * 60 * 60 * 1000,       // 2 hours
    weather: 30 * 60 * 1000,       // 30 minutes
    route: 60 * 60 * 1000,         // 1 hour
};

/* ── Internal helpers ──────────────────────────── */

function write(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {
        // localStorage full or unavailable — silently skip
    }
}

function read(key, ttl) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;

        const { data, timestamp } = JSON.parse(raw);
        // Return data even if stale — caller decides whether to use it
        return { data, timestamp, stale: Date.now() - timestamp > ttl };
    } catch {
        return null;
    }
}

/* ── Public API ────────────────────────────────── */

/** Cache a successful AI response (keyed by query). */
export function cacheAIResponse(query, response) {
    write(KEYS.ai, { query, response });
}

/** Get last cached AI response. Returns { query, response, stale } or null. */
export function getCachedAI() {
    const entry = read(KEYS.ai, TTL.ai);
    if (!entry) return null;
    return { query: entry.data.query, response: entry.data.response, stale: entry.stale };
}

/** Cache successful weather data. */
export function cacheWeather(weatherData) {
    write(KEYS.weather, weatherData);
}

/** Get cached weather. Returns { data, stale } or null. */
export function getCachedWeather() {
    const entry = read(KEYS.weather, TTL.weather);
    if (!entry) return null;
    return { data: entry.data, stale: entry.stale };
}

/** Cache successful route result. */
export function cacheRoute(routeData) {
    write(KEYS.route, routeData);
}

/** Get cached route. Returns { data, stale } or null. */
export function getCachedRoute() {
    const entry = read(KEYS.route, TTL.route);
    if (!entry) return null;
    return { data: entry.data, stale: entry.stale };
}

/** Mark the app as offline / online. */
export function setOfflineFlag(isOffline) {
    try {
        if (isOffline) {
            localStorage.setItem(KEYS.offline, "1");
        } else {
            localStorage.removeItem(KEYS.offline);
        }
    } catch {}
}

/** Check if the offline flag is set. */
export function isOfflineFlagSet() {
    try {
        return localStorage.getItem(KEYS.offline) === "1";
    } catch {
        return false;
    }
}
