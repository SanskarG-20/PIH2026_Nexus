/**
 * Intent classification for travel queries.
 * Runs locally (no API call) — keyword + pattern matching with weighted scoring.
 */

const INTENT_DEFINITIONS = {
    sightseeing: {
        label: "Sightseeing",
        icon: "MAP",
        keywords: [
            "visit", "see", "explore", "sightseeing", "tourist", "tourism",
            "monument", "palace", "fort", "temple", "church", "mosque", "museum",
            "heritage", "historical", "landmark", "architecture", "attraction",
            "scenic", "view", "viewpoint", "sunset", "sunrise", "photo", "photography",
            "walk around", "day trip", "weekend", "things to do", "places to see",
            "must visit", "famous", "popular", "iconic", "beautiful",
        ],
        promptModifier: `The user wants SIGHTSEEING recommendations. Prioritize:
- Must-visit landmarks, monuments, and scenic viewpoints
- Best photo spots and golden-hour timings
- Entry fees + timings for each attraction
- Logical visiting ORDER to minimize travel between spots
- Include lesser-known hidden gems alongside popular attractions`,
    },

    food: {
        label: "Food & Cuisine",
        icon: "FOOD",
        keywords: [
            "food", "eat", "restaurant", "cafe", "dhaba", "street food",
            "cuisine", "dish", "taste", "biryani", "thali", "chaat", "chai",
            "coffee", "dosa", "idli", "paneer", "chicken", "mutton", "veg",
            "nonveg", "non-veg", "breakfast", "lunch", "dinner", "snack",
            "dessert", "sweet", "mithai", "lassi", "kulfi", "paan",
            "hungry", "meal", "where to eat", "best food", "local food",
            "foodie", "culinary", "cooking", "recipe", "flavor",
        ],
        promptModifier: `The user wants FOOD & CUISINE recommendations. Prioritize:
- Best local dishes and WHERE to eat them (specific stall/restaurant names)
- Price range per dish (street food vs restaurant)
- Hygiene ratings and crowd timings (avoid peak rush)
- Must-try local specialties unique to the area
- Vegetarian AND non-vegetarian options clearly labeled`,
    },

    budget: {
        label: "Budget Trip",
        icon: "BUDGET",
        keywords: [
            "budget", "cheap", "affordable", "low cost", "free", "save money",
            "economical", "inexpensive", "backpack", "backpacking", "hostel",
            "dormitory", "under", "within", "rupees", "pocket-friendly",
            "student", "frugal", "cost-effective", "minimum spend",
            "no money", "tight budget", "shoestring",
        ],
        promptModifier: `The user is on a TIGHT BUDGET. Prioritize:
- Free or extremely low-cost activities and attractions
- Cheapest transport options (local bus, shared auto, walking)
- Budget accommodation (hostels, dharamshalas, budget hotels)
- Street food over restaurants (with specific price per item in INR)
- Total estimated trip cost breakdown: transport + food + entry fees + stay
- Money-saving tips specific to this area`,
    },

    safety: {
        label: "Safety Info",
        icon: "SAFETY",
        keywords: [
            "safe", "safety", "danger", "dangerous", "crime", "scam",
            "woman", "women", "solo", "female", "night", "late night",
            "alone", "secure", "security", "police", "emergency",
            "avoid", "risky", "precaution", "trusted", "reliable",
            "family-friendly", "kid-friendly", "children",
        ],
        promptModifier: `The user has SAFETY concerns. Prioritize:
- Safety ratings for each area (safe/moderate/avoid)
- Safe travel hours and well-lit routes
- Emergency contacts: local police, women's helpline (181), tourist helpline (1363)
- Common scams in the area and how to avoid them
- Safe transport options (verified apps like Ola/Uber over random autos)
- Areas to avoid, especially at night
- If traveling solo/female, specific precautions for each suggestion`,
    },

    quick_trip: {
        label: "Quick Trip",
        icon: "QUICK",
        keywords: [
            "quick", "short", "few hours", "half day", "2 hours", "3 hours",
            "layover", "transit", "passing through", "short stop", "stopover",
            "limited time", "hurry", "fast", "brief", "1 day", "one day",
            "day trip", "morning", "evening", "afternoon only",
            "2-3 hours", "4 hours", "quick visit",
        ],
        promptModifier: `The user has LIMITED TIME. Prioritize:
- Only the TOP 2-3 things to do (no long lists)
- Places clustered CLOSE TOGETHER to minimize travel time
- Estimated time at each spot (e.g., "30 min here is enough")
- Fastest transport between spots
- Skip anything that requires advance booking or long queues
- Provide a tight minute-by-minute itinerary`,
    },

    route: {
        label: "Route / Transport",
        icon: "ROUTE",
        keywords: [
            "route", "how to reach", "how to go", "how to get", "travel to",
            "go to", "going to", "reach", "commute", "get to",
            "train", "metro", "local train", "bus", "cab", "auto",
            "rickshaw", "uber", "ola", "taxi", "transport",
            "from", "to", "between", "directions", "navigate",
            "fastest way", "cheapest way", "best way",
            "station", "bus stop", "airport", "terminal",
            "distance", "travel time", "how far", "how long",
            "suburban", "railway", "platform", "boarding",
        ],
        promptModifier: `The user wants ROUTE/TRANSPORT analysis. You MUST return the "transportOptions" field in your JSON.
Analyze ALL available transport modes between the locations:

1. TRAIN (if applicable in metro cities like Mumbai, Delhi, Chennai, Kolkata, Bangalore, Hyderabad):
   - Nearest boarding station and destination station
   - Train type: Local/Fast/Metro/Express
   - Travel time, next departures (simulate realistic timings)
   - Peak hour warning (Morning 8-11 AM, Evening 6-9 PM)

2. BUS:
   - Bus route number, boarding stop, drop stop
   - Frequency, crowd level, travel duration

3. CAB/AUTO:
   - Price estimate in INR (Ola/Uber range)
   - Traffic condition, comfort level

4. WALK (if under 3 km)

Always recommend the BEST option and explain WHY.
Use real Indian station names, bus routes, and landmarks.`,
    },
};

/**
 * Classify a user message into one or more intent types.
 * Returns array sorted by confidence: [{ type, label, icon, confidence, promptModifier }]
 */
export function classifyIntent(message) {
    if (!message || typeof message !== "string") return [];

    const lower = message.toLowerCase();
    const results = [];

    for (const [type, def] of Object.entries(INTENT_DEFINITIONS)) {
        let score = 0;
        let matchedKeywords = 0;

        for (const kw of def.keywords) {
            // Exact word boundary match scores higher
            const regex = new RegExp("\\b" + kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i");
            if (regex.test(lower)) {
                matchedKeywords++;
                // Multi-word keywords are more specific → higher weight
                score += kw.includes(" ") ? 3 : 1;
            }
        }

        if (matchedKeywords > 0) {
            // Normalize to 0-1 confidence (cap at 1.0)
            const confidence = Math.min(1, score / 5);
            results.push({
                type,
                label: def.label,
                icon: def.icon,
                confidence,
                promptModifier: def.promptModifier,
            });
        }
    }

    // Sort by confidence descending
    results.sort((a, b) => b.confidence - a.confidence);

    return results;
}

/**
 * Get the single primary intent (highest confidence, must be > 0.2).
 * Returns null if no clear intent detected.
 */
export function getPrimaryIntent(message) {
    const intents = classifyIntent(message);
    if (intents.length === 0) return null;
    return intents[0].confidence >= 0.2 ? intents[0] : null;
}

/**
 * Build the intent-aware prompt modifier string.
 * If multiple strong intents, combine them (max 2).
 */
export function buildIntentPrompt(message) {
    const intents = classifyIntent(message);
    if (intents.length === 0) return "";

    // Take top 2 intents above threshold
    const strong = intents.filter((i) => i.confidence >= 0.2).slice(0, 2);
    if (strong.length === 0) return "";

    const parts = strong.map((i) => i.promptModifier);
    return "\n\n[USER INTENT: " + strong.map((i) => i.label.toUpperCase()).join(" + ") + "]\n" + parts.join("\n\n");
}

export { INTENT_DEFINITIONS };
