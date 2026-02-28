/**
 * Environment Intelligence Service — unified weather + AQI wrapper.
 *
 * Delegates to weatherService for API calls, adds Supabase logging.
 * Single entry point for all environment data in the app.
 */

import { fetchWeatherAndAQI, buildWeatherContext } from "./weatherService";
import { saveEnvironmentLog } from "./supabaseClient";

/**
 * Fetch full environment snapshot (weather + AQI) and optionally log to Supabase.
 *
 * @param {number} lat
 * @param {number} lng
 * @param {string|null} userId  — Supabase user ID; if provided, logs the snapshot
 * @returns {object|null}  The weather data object from weatherService
 */
export async function getEnvironmentSnapshot(lat, lng, userId) {
    var data = await fetchWeatherAndAQI(lat, lng);
    if (!data) return null;

    // Persist to Supabase if user is authenticated
    if (userId) {
        try {
            await saveEnvironmentLog({
                userId: userId,
                temperature: data.temperature,
                weather: data.weatherLabel,
                weatherCode: data.weatherCode,
                aqi: data.aqi,
                aqiLabel: data.aqiLabel,
                humidity: data.humidity,
                windSpeed: data.windSpeed,
                rainProbability: data.rainProbability,
                pm25: data.pm25,
            });
        } catch (err) {
            // Non-blocking — don't break UX if logging fails
            console.warn("[MargDarshak Env] Failed to save environment log:", err);
        }
    }

    return data;
}

/**
 * Build a concise environment context string for AI prompt injection.
 * Re-exports from weatherService for convenience.
 */
export { buildWeatherContext };

/**
 * Get a one-line environment summary for compact UI display.
 * Example: "☀️ 29°C | AQI Moderate"
 *
 * @param {object} weather — from fetchWeatherAndAQI()
 * @returns {string}
 */
export function getEnvironmentSummary(weather) {
    if (!weather) return "";

    var parts = [];
    parts.push(weather.weatherIcon + " " + Math.round(weather.temperature) + "\u00B0C");

    if (weather.rainProbability != null && weather.rainProbability > 0) {
        parts.push("\uD83C\uDF27\uFE0F " + weather.rainProbability + "%");
    }

    if (weather.aqi != null) {
        parts.push("AQI " + weather.aqiLabel);
    }

    return parts.join(" | ");
}
