/**
 * Weather & AQI service using Open-Meteo (free, no API key needed).
 * Docs: https://open-meteo.com/en/docs
 */

import { cacheWeather, getCachedWeather, setOfflineFlag } from "../utils/offlineCache";

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const AQI_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

/** WMO weather code → human label + emoji */
const WMO_CODES = {
    0: { label: "Clear Sky", icon: "☀️" },
    1: { label: "Mainly Clear", icon: "🌤️" },
    2: { label: "Partly Cloudy", icon: "⛅" },
    3: { label: "Overcast", icon: "☁️" },
    45: { label: "Foggy", icon: "🌫️" },
    48: { label: "Rime Fog", icon: "🌫️" },
    51: { label: "Light Drizzle", icon: "🌦️" },
    53: { label: "Drizzle", icon: "🌦️" },
    55: { label: "Heavy Drizzle", icon: "🌧️" },
    61: { label: "Light Rain", icon: "🌧️" },
    63: { label: "Rain", icon: "🌧️" },
    65: { label: "Heavy Rain", icon: "🌧️" },
    71: { label: "Light Snow", icon: "🌨️" },
    73: { label: "Snow", icon: "❄️" },
    75: { label: "Heavy Snow", icon: "❄️" },
    80: { label: "Rain Showers", icon: "🌦️" },
    81: { label: "Moderate Showers", icon: "🌧️" },
    82: { label: "Heavy Showers", icon: "⛈️" },
    95: { label: "Thunderstorm", icon: "⛈️" },
    96: { label: "Thunderstorm + Hail", icon: "⛈️" },
    99: { label: "Severe Thunderstorm", icon: "⛈️" },
};

/** AQI number → level label + color */
function getAQILevel(aqi) {
    if (aqi == null) return { label: "N/A", color: "rgba(255,255,255,.3)" };
    if (aqi <= 50) return { label: "Good", color: "#22c55e" };
    if (aqi <= 100) return { label: "Moderate", color: "#eab308" };
    if (aqi <= 150) return { label: "Unhealthy (Sensitive)", color: "#f97316" };
    if (aqi <= 200) return { label: "Unhealthy", color: "#ef4444" };
    if (aqi <= 300) return { label: "Very Unhealthy", color: "#a855f7" };
    return { label: "Hazardous", color: "#7f1d1d" };
}

/**
 * Fetch current weather + AQI for given coordinates.
 * Returns structured data or null on failure.
 */
export async function fetchWeatherAndAQI(lat, lng) {
    try {
        const [weatherRes, aqiRes] = await Promise.all([
            fetch(
                `${WEATHER_URL}?latitude=${lat}&longitude=${lng}` +
                `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index` +
                `&hourly=precipitation_probability` +
                `&forecast_days=1` +
                `&timezone=auto`
            ),
            fetch(
                `${AQI_URL}?latitude=${lat}&longitude=${lng}` +
                `&current=us_aqi,pm2_5,pm10` +
                `&timezone=auto`
            ),
        ]);

        if (!weatherRes.ok) {
            console.error("[MargDarshak Weather] API error:", await weatherRes.text());
            return null;
        }

        const weatherData = await weatherRes.json();
        const current = weatherData.current;

        // Extract rain probability for current hour from hourly data
        let rainProbability = null;
        const hourlyPrecip = weatherData.hourly?.precipitation_probability;
        if (hourlyPrecip && hourlyPrecip.length > 0) {
            const currentHour = new Date().getHours();
            rainProbability = hourlyPrecip[currentHour] ?? hourlyPrecip[0];
        }

        // Parse AQI (may fail for some locations)
        let aqiData = null;
        if (aqiRes.ok) {
            const aqiJson = await aqiRes.json();
            aqiData = aqiJson.current || null;
        }

        const weatherCode = current?.weather_code ?? 0;
        const wmo = WMO_CODES[weatherCode] || { label: "Unknown", icon: "🌡️" };
        const aqiValue = aqiData?.us_aqi ?? null;
        const aqiLevel = getAQILevel(aqiValue);

        const result = {
            temperature: current?.temperature_2m,
            feelsLike: current?.apparent_temperature,
            humidity: current?.relative_humidity_2m,
            windSpeed: current?.wind_speed_10m,
            uvIndex: current?.uv_index,
            rainProbability,
            weatherCode,
            weatherLabel: wmo.label,
            weatherIcon: wmo.icon,
            aqi: aqiValue,
            aqiLabel: aqiLevel.label,
            aqiColor: aqiLevel.color,
            pm25: aqiData?.pm2_5 ?? null,
            pm10: aqiData?.pm10 ?? null,
            timestamp: new Date().toISOString(),
        };

        // Cache successful weather data
        cacheWeather(result);
        return result;
    } catch (err) {
        console.error("[MargDarshak Weather] Network error:", err);

        // Offline fallback: return cached weather
        const cached = getCachedWeather();
        if (cached) {
            setOfflineFlag(true);
            return { ...cached.data, _fromCache: true };
        }
        return null;
    }
}

/**
 * Build a concise weather context string for AI prompt injection.
 */
export function buildWeatherContext(weather) {
    if (!weather) return "";

    let ctx = `\n\n[WEATHER] Current conditions: ${weather.weatherLabel} ${weather.weatherIcon}, `;
    ctx += `${weather.temperature}°C (feels like ${weather.feelsLike}°C), `;
    ctx += `humidity ${weather.humidity}%, wind ${weather.windSpeed} km/h`;

    if (weather.rainProbability != null && weather.rainProbability > 0) {
        ctx += `, rain probability ${weather.rainProbability}%`;
    }

    if (weather.uvIndex != null) {
        ctx += `, UV index ${weather.uvIndex}`;
    }

    if (weather.aqi != null) {
        ctx += `. Air Quality: AQI ${weather.aqi} (${weather.aqiLabel})`;
        if (weather.pm25 != null) ctx += `, PM2.5: ${weather.pm25}`;
    }

    ctx += ". Adapt recommendations based on these conditions (e.g., suggest indoor places during rain/poor AQI, warn about heat/UV).";
    return ctx;
}
