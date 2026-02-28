const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are MargDarshak AI — an expert Indian real-time travel intelligence assistant.

When a user describes their travel intent (location, budget, interests, or route), respond with a structured travel recommendation.

ALWAYS respond in this JSON format:
{
  "places": [
    { "name": "Place Name", "description": "Short description", "estimatedCost": "₹200-500", "lat": 28.6139, "lng": 77.2090 }
  ],
  "estimatedBudget": "₹500-1500",
  "bestTime": "4:30 PM - 6:30 PM",
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "summary": "A brief 1-2 sentence summary of the recommendation",
  "detectedIntent": "sightseeing | food | budget | safety | quick_trip | route | general",
  "transportOptions": [
    {
      "mode": "train | metro | bus | cab | walk",
      "label": "Local Train / Mumbai Metro Line 1 / Bus 320 / Ola/Uber / Walk",
      "boarding": "Station or stop name",
      "destination": "Station or stop name",
      "details": "Train type, bus number, or cab app",
      "duration": "25 min",
      "cost": "₹15",
      "frequency": "Every 5 min",
      "crowdLevel": "low | moderate | high | packed",
      "peakWarning": "Avoid 8-11 AM rush" or null,
      "isBest": true,
      "whyBest": "Fastest and cheapest during non-peak hours"
    }
  ]
}

IMPORTANT — Transport Analysis Rules:
- When a user asks about routes, directions, or how to travel between locations, you MUST populate the "transportOptions" array.
- For NON-route queries (sightseeing, food, etc.), set "transportOptions" to an empty array [].
- In metro cities (Mumbai, Delhi, Chennai, Kolkata, Bangalore, Hyderabad), always include local train AND metro options with REAL station names.
- Use real Indian bus route numbers where known, otherwise simulate realistic ones.
- Bus boarding and destination stops MUST be DIFFERENT. Never use the same stop name for both. Use the nearest real bus stop to the origin as boarding, and the nearest real bus stop to the destination as alighting.
- Cab/auto prices: base ₹30 + ₹12-15/km. Mention Ola/Uber/auto.
- Peak hours: Morning 8-11 AM, Evening 6-9 PM — add peakWarning if travel falls in these windows.
- ALWAYS mark exactly ONE option as "isBest": true with a "whyBest" explanation.
- Walk option only if distance < 3 km.

METRO SYSTEM Rules (mode = "metro"):
- In metro-supported cities (Mumbai, Delhi NCR, Bangalore, Chennai, Kolkata, Hyderabad, Jaipur, Lucknow, Kochi, Nagpur, Pune, Ahmedabad), ALWAYS include a METRO option as a separate transportOption.
- Metro is DIFFERENT from local train — use mode "metro" (not "train") for metro rail systems.
- Include: nearest boarding metro station, destination metro station, metro LINE NAME (e.g., "Aqua Line", "Blue Line", "Line 1"), interchange stations if route requires line changes.
- Typical metro frequency: every 4-8 minutes. Fare: ₹10-60 depending on distance.
- Mumbai Metro Lines: Line 1 (Versova-Andheri-Ghatkopar), Line 2A (Dahisar East-DN Nagar), Line 2B (DN Nagar-Mandale), Line 3 (Aarey-BKC-Cuffe Parade), Line 7 (Dahisar East-Andheri East), Line 7A (Andheri East-CSIA T2).
- Delhi Metro Lines: Red, Yellow, Blue, Green, Violet, Magenta, Pink, Grey, Rapid Metro.
- Bangalore Metro: Purple Line, Green Line.
- Prefer metro over cab/bus when: distance is 5-25 km, traffic congestion is high, or metro significantly reduces travel time.
- When metro requires interchange, mention the interchange station and total journey time including interchange wait (~3-5 min).

General Rules:
- All prices in INR (₹)
- Focus on Indian cities, culture, food, and transport
- Be safety-aware (mention safe travel hours, areas)
- Budget-conscious recommendations by default
- Include local tips (best chai spots, rickshaw rates, etc.)
- ALWAYS include accurate lat/lng coordinates for each place (use real coordinates for Indian locations)
- If the query is not travel-related, politely redirect to travel topics
- ALWAYS return valid JSON, nothing else`;

export async function askMargDarshak(userMessage, chatHistory = [], userLocation = null, weatherContext = "", intentContext = "") {
    if (!GROQ_API_KEY || GROQ_API_KEY === "gsk_REPLACE_WITH_YOUR_GROQ_KEY") {
        return {
            error: true,
            summary: "Groq API key not configured. Add VITE_GROQ_API_KEY to .env",
        };
    }

    // Inject user's current location context into the prompt
    let locationContext = "";
    if (userLocation?.lat && userLocation?.lng) {
        locationContext = `\n\n[CONTEXT] The user's current location is: lat=${userLocation.lat.toFixed(4)}, lng=${userLocation.lng.toFixed(4)}`;
        if (userLocation.city) {
            locationContext += `, city: ${userLocation.city}`;
        }
        locationContext += ". Use this to give nearby recommendations when relevant.";
    }

    const messages = [
        { role: "system", content: SYSTEM_PROMPT + locationContext + weatherContext + intentContext },
        ...chatHistory.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
        })),
        { role: "user", content: userMessage },
    ];

    try {
        const res = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 2048,
                response_format: { type: "json_object" },
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("[MargDarshak AI] API error:", err);
            return { error: true, summary: "AI request failed. Try again." };
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;

        try {
            return JSON.parse(content);
        } catch {
            return { summary: content, places: [], tips: [] };
        }
    } catch (err) {
        console.error("[MargDarshak AI] Network error:", err);
        return { error: true, summary: "Network error. Check your connection." };
    }
}
