import { useState, useRef, useEffect } from "react";
import { Y, BK, WH } from "../constants/theme";
import { askMargDarshak } from "../services/aiService";
import { saveAIHistory, getAIHistory } from "../services/supabaseClient";

export default function AIChat({ dbUser, onAIResponse }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const chatEndRef = useRef(null);

    // Load previous chat history from Supabase on mount
    useEffect(() => {
        if (!dbUser?.id || historyLoaded) return;

        setHistoryLoaded(true);
        getAIHistory(dbUser.id, 20).then((history) => {
            if (history.length > 0) {
                const restored = [];
                history.forEach((h) => {
                    restored.push({ role: "user", content: h.prompt });
                    let parsed = null;
                    try {
                        parsed = JSON.parse(h.response);
                    } catch {
                        parsed = { summary: h.response, places: [], tips: [] };
                    }
                    restored.push({
                        role: "assistant",
                        content: h.response,
                        parsed,
                    });
                });
                setMessages(restored);
                // If we have past successful AI responses, mark AI as active
                onAIResponse?.();
            }
        });
    }, [dbUser?.id, historyLoaded, onAIResponse]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        const result = await askMargDarshak(userMsg, messages);
        const aiContent = result.error
            ? result.summary
            : JSON.stringify(result);

        setMessages((prev) => [
            ...prev,
            { role: "assistant", content: aiContent, parsed: result },
        ]);
        setLoading(false);

        if (!result.error) {
            onAIResponse?.(result);
        }

        if (dbUser?.id && !result.error) {
            saveAIHistory({
                userId: dbUser.id,
                prompt: userMsg,
                response: aiContent,
            });
        }
    };

    return (
        <div style={{ marginTop: 32 }}>
            {/* Header */}
            <div
                style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 22,
                    color: Y,
                    letterSpacing: 2,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <span
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: loading ? Y : "#22c55e",
                        display: "inline-block",
                        boxShadow: loading ? `0 0 8px ${Y}` : "0 0 8px #22c55e",
                        animation: loading
                            ? "pulse-ring 1s ease infinite"
                            : "pulse-ring 2s ease infinite",
                    }}
                />
                AI TRAVEL ASSISTANT
            </div>

            {/* Chat messages */}
            <div
                style={{
                    maxHeight: 400,
                    overflowY: "auto",
                    marginBottom: 16,
                    border: "1px solid rgba(255,255,255,.08)",
                    background: "rgba(255,255,255,.02)",
                }}
            >
                {messages.length === 0 && (
                    <div
                        style={{
                            padding: "40px 24px",
                            textAlign: "center",
                            fontFamily: "'DM Sans',sans-serif",
                            color: "rgba(255,255,255,.25)",
                            fontSize: 14,
                        }}
                    >
                        Ask MargDarshak AI about any travel plan in India
                        <br />
                        <span style={{ fontSize: 12, opacity: 0.6 }}>
                            Try: "I'm in Jaipur with ₹2000 budget, suggest a full day plan"
                        </span>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i}>
                        {msg.role === "user" ? (
                            <div
                                style={{
                                    padding: "14px 20px",
                                    borderLeft: `3px solid ${Y}`,
                                    background: "rgba(204,255,0,.03)",
                                }}
                            >
                                <div
                                    style={{
                                        fontFamily: "'DM Sans',sans-serif",
                                        fontSize: 11,
                                        color: Y,
                                        letterSpacing: 2,
                                        marginBottom: 6,
                                        textTransform: "uppercase",
                                    }}
                                >
                                    YOU
                                </div>
                                <div
                                    style={{
                                        fontFamily: "'DM Sans',sans-serif",
                                        fontSize: 14,
                                        color: "rgba(255,255,255,.8)",
                                    }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ) : (
                            <AIResponse msg={msg} />
                        )}
                    </div>
                ))}

                {loading && (
                    <div
                        style={{
                            padding: "14px 20px",
                            borderLeft: `3px solid rgba(255,255,255,.1)`,
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: 14,
                            color: Y,
                            letterSpacing: 2,
                            animation: "pulse-ring 1.5s ease infinite",
                        }}
                    >
                        THINKING...
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} style={{ display: "flex", gap: 0 }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about any Indian city, route, or travel plan..."
                    disabled={loading}
                    style={{
                        flex: 1,
                        padding: "14px 18px",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 15,
                        color: WH,
                        background: "rgba(255,255,255,.05)",
                        border: "2px solid rgba(255,255,255,.15)",
                        borderRight: "none",
                        outline: "none",
                        transition: "border-color .2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = Y)}
                    onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(255,255,255,.15)")
                    }
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    data-hover
                    style={{
                        padding: "14px 28px",
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: 16,
                        letterSpacing: 2,
                        color: BK,
                        background: loading ? "rgba(204,255,0,.5)" : Y,
                        border: `2px solid ${Y}`,
                        cursor: loading ? "wait" : "pointer",
                        transition: "all .15s",
                        whiteSpace: "nowrap",
                    }}
                >
                    {loading ? "..." : "ASK AI →"}
                </button>
            </form>
        </div>
    );
}

function AIResponse({ msg }) {
    const data = msg.parsed;

    if (!data || data.error) {
        return (
            <div
                style={{
                    padding: "14px 20px",
                    borderLeft: "3px solid #ef4444",
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 14,
                    color: "rgba(255,255,255,.6)",
                }}
            >
                {data?.summary || msg.content}
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "16px 20px",
                borderLeft: "3px solid rgba(255,255,255,.1)",
                background: "rgba(255,255,255,.01)",
            }}
        >
            {/* Summary */}
            {data.summary && (
                <div
                    style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 14,
                        color: "rgba(255,255,255,.7)",
                        marginBottom: 16,
                        lineHeight: 1.6,
                    }}
                >
                    {data.summary}
                </div>
            )}

            {/* Places */}
            {data.places?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    <div
                        style={{
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: 14,
                            color: Y,
                            letterSpacing: 2,
                            marginBottom: 8,
                        }}
                    >
                        SUGGESTED PLACES
                    </div>
                    {data.places.map((place, i) => (
                        <div
                            key={i}
                            style={{
                                padding: "10px 14px",
                                marginBottom: 6,
                                background: "rgba(204,255,0,.03)",
                                border: "1px solid rgba(255,255,255,.06)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 12,
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontFamily: "'DM Sans',sans-serif",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        color: "rgba(255,255,255,.85)",
                                        marginBottom: 2,
                                    }}
                                >
                                    {place.name}
                                </div>
                                <div
                                    style={{
                                        fontFamily: "'DM Sans',sans-serif",
                                        fontSize: 12,
                                        color: "rgba(255,255,255,.45)",
                                    }}
                                >
                                    {place.description}
                                </div>
                            </div>
                            {place.estimatedCost && (
                                <span
                                    style={{
                                        fontFamily: "'Bebas Neue',sans-serif",
                                        fontSize: 13,
                                        color: Y,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {place.estimatedCost}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Budget + Time */}
            <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                {data.estimatedBudget && (
                    <div
                        style={{
                            padding: "8px 14px",
                            border: `1px solid ${Y}`,
                            background: "rgba(204,255,0,.05)",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'DM Sans',sans-serif",
                                fontSize: 11,
                                color: "rgba(255,255,255,.4)",
                                letterSpacing: 1,
                            }}
                        >
                            BUDGET{" "}
                        </span>
                        <span
                            style={{
                                fontFamily: "'Bebas Neue',sans-serif",
                                fontSize: 16,
                                color: Y,
                            }}
                        >
                            {data.estimatedBudget}
                        </span>
                    </div>
                )}
                {data.bestTime && (
                    <div
                        style={{
                            padding: "8px 14px",
                            border: "1px solid rgba(255,255,255,.15)",
                        }}
                    >
                        <span
                            style={{
                                fontFamily: "'DM Sans',sans-serif",
                                fontSize: 11,
                                color: "rgba(255,255,255,.4)",
                                letterSpacing: 1,
                            }}
                        >
                            BEST TIME{" "}
                        </span>
                        <span
                            style={{
                                fontFamily: "'Bebas Neue',sans-serif",
                                fontSize: 16,
                                color: WH,
                            }}
                        >
                            {data.bestTime}
                        </span>
                    </div>
                )}
            </div>

            {/* Tips */}
            {data.tips?.length > 0 && (
                <div>
                    <div
                        style={{
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: 14,
                            color: "rgba(255,255,255,.4)",
                            letterSpacing: 2,
                            marginBottom: 6,
                        }}
                    >
                        LOCAL TIPS
                    </div>
                    {data.tips.map((tip, i) => (
                        <div
                            key={i}
                            style={{
                                fontFamily: "'DM Sans',sans-serif",
                                fontSize: 13,
                                color: "rgba(255,255,255,.5)",
                                paddingLeft: 14,
                                marginBottom: 4,
                                borderLeft: "2px solid rgba(255,255,255,.08)",
                            }}
                        >
                            {tip}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
