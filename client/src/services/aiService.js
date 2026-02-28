const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are MargDarshak AI — an expert Indian travel intelligence assistant.

When a user describes their travel intent (location, budget, interests), respond with a structured travel recommendation.

ALWAYS respond in this JSON format:
{
  "places": [
    { "name": "Place Name", "description": "Short description", "estimatedCost": "₹200-500", "lat": 28.6139, "lng": 77.2090 }
  ],
  "estimatedBudget": "₹500-1500",
  "bestTime": "4:30 PM - 6:30 PM",
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "summary": "A brief 1-2 sentence summary of the recommendation"
}

Rules:
- All prices in INR (₹)
- Focus on Indian cities, culture, food, and transport
- Be safety-aware (mention safe travel hours, areas)
- Budget-conscious recommendations by default
- Include local tips (best chai spots, rickshaw rates, etc.)
- ALWAYS include accurate lat/lng coordinates for each place (use real coordinates for Indian locations)
- If the query is not travel-related, politely redirect to travel topics
- ALWAYS return valid JSON, nothing else`;

export async function askMargDarshak(userMessage, chatHistory = []) {
    if (!GROQ_API_KEY || GROQ_API_KEY === "gsk_REPLACE_WITH_YOUR_GROQ_KEY") {
        return {
            error: true,
            summary: "Groq API key not configured. Add VITE_GROQ_API_KEY to .env",
        };
    }

    const messages = [
        { role: "system", content: SYSTEM_PROMPT },
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
                max_tokens: 1024,
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
