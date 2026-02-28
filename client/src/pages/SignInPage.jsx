import { SignIn } from "@clerk/clerk-react";
import { Y, BK, WH } from "../constants/theme";
import Cursor from "../components/Cursor";

export default function SignInPage() {
    return (
        <div
            className="dark-page"
            style={{
                minHeight: "100vh",
                background: WH,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 20px",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Cursor />

            {/* Big watermark text — matches hero section */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: "clamp(100px, 18vw, 220px)",
                    color: "rgba(0,0,0,0.04)",
                    whiteSpace: "nowrap",
                    letterSpacing: -5,
                    userSelect: "none",
                    pointerEvents: "none",
                    zIndex: 0,
                }}
            >
                MARGDARSHAK
            </div>

            {/* Dot grid background — same as hero */}
            <svg
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0.04,
                    pointerEvents: "none",
                }}
            >
                <defs>
                    <pattern
                        id="auth-dots"
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="20" cy="20" r="1.5" fill={BK} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#auth-dots)" />
            </svg>

            {/* Yellow top stripe — matches hero */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 8,
                    background: Y,
                    zIndex: 10,
                }}
            />

            {/* Bottom-right yellow bar — matches hero */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "45%",
                    height: 12,
                    background: Y,
                    zIndex: 10,
                }}
            />

            {/* Left vertical accent line */}
            <div
                style={{
                    position: "absolute",
                    top: 60,
                    left: 32,
                    width: 3,
                    height: 100,
                    background: BK,
                    opacity: 0.1,
                }}
            />

            {/* Content */}
            <div style={{ position: "relative", zIndex: 2 }}>
                {/* Logo badge — same style as hero section */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 24,
                    }}
                >
                    <div
                        style={{
                            background: BK,
                            color: Y,
                            fontFamily: "'Bebas Neue',sans-serif",
                            fontSize: 14,
                            padding: "6px 14px",
                            letterSpacing: 3,
                            border: `2px solid ${BK}`,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#22c55e",
                                boxShadow: "0 0 8px #22c55e",
                                animation: "pulse-ring 2s ease infinite",
                            }}
                        />
                        SECURE LOGIN
                    </div>
                </div>

                {/* Title */}
                <h1
                    style={{
                        fontFamily: "'Bebas Neue',sans-serif",
                        fontSize: "clamp(48px, 8vw, 80px)",
                        lineHeight: 0.88,
                        letterSpacing: -2,
                        color: BK,
                        marginBottom: 12,
                    }}
                >
                    SIGN
                    <br />
                    <span
                        style={{
                            color: Y,
                            WebkitTextStroke: `3px ${BK}`,
                        }}
                    >
                        IN
                    </span>
                    <span style={{ color: "rgba(0,0,0,.15)" }}>.</span>
                </h1>
                <p
                    style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: 15,
                        color: "#666",
                        marginBottom: 32,
                        maxWidth: 380,
                        lineHeight: 1.6,
                    }}
                >
                    Access your AI travel intelligence dashboard.
                    <br />
                    Plan smarter. Navigate safer.
                </p>

                {/* Clerk card */}
                <SignIn
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    forceRedirectUrl="/app"
                    appearance={{
                        variables: {
                            colorPrimary: "#000",
                            colorBackground: WH,
                            colorText: BK,
                            colorTextSecondary: "#666",
                            colorInputBackground: "#f5f5f5",
                            colorInputText: BK,
                            borderRadius: "0px",
                        },
                        elements: {
                            card: {
                                border: `3px solid ${BK}`,
                                boxShadow: `6px 6px 0 ${BK}`,
                            },
                            headerTitle: {
                                fontFamily: "'Bebas Neue',sans-serif",
                                letterSpacing: "2px",
                                color: BK,
                            },
                            headerSubtitle: {
                                fontFamily: "'DM Sans',sans-serif",
                                color: "#666",
                            },
                            formButtonPrimary: {
                                background: Y,
                                color: BK,
                                fontFamily: "'Bebas Neue',sans-serif",
                                letterSpacing: "2px",
                                fontSize: "16px",
                                borderRadius: "0px",
                                border: `2px solid ${BK}`,
                                boxShadow: `3px 3px 0 ${BK}`,
                            },
                            socialButtonsBlockButton: {
                                border: `2px solid ${BK}`,
                                borderRadius: "0px",
                                color: BK,
                                fontFamily: "'DM Sans',sans-serif",
                                fontWeight: 500,
                                padding: "12px 16px",
                                transition: "all .15s",
                                boxShadow: `3px 3px 0 ${BK}`,
                            },
                            socialButtonsBlockButtonText: {
                                color: BK,
                                fontFamily: "'DM Sans',sans-serif",
                                fontWeight: 600,
                            },
                            formFieldInput: {
                                border: `2px solid ${BK}`,
                                borderRadius: "0px",
                                fontFamily: "'DM Sans',sans-serif",
                            },
                            footerActionLink: { color: BK, fontWeight: 700 },
                            dividerLine: { background: "rgba(0,0,0,.15)" },
                            dividerText: { color: "#999" },
                        },
                    }}
                />
            </div>
        </div>
    );
}
