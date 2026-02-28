import { useState, useEffect } from "react";
import { Y, BK, WH } from "../constants/theme";
import {
  MapPin,
  Navigation,
  Route,
  Compass,
  Waypoints,
  Locate,
} from "lucide-react";

/* ── SPINNING VORTEX TEXT ────────────────────────────────────────────────── */
function VortexText() {
  const words =
    "NAVIGATE · AI · TRAVEL · MUMBAI · SAFE · SMART · ROUTE · PLAN · INTENT · BUDGET · LOCAL · WEATHER · AQI · GPS · EXPLORE ·";
  const radius = [120, 90, 65, 44, 28, 16];

  return (
    <div
      style={{
        width: 280,
        height: 280,
        position: "relative",
        flexShrink: 0,
        opacity: 0.15,
        filter: "blur(0.7px)",
      }}
    >
      {radius.map((r, ri) => {
        const charCount = Math.floor((2 * Math.PI * r) / 13);
        return (
          <svg
            key={ri}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              animation: `${
                ri % 2 === 0 ? "spin" : "spin-r"
              } ${10 + ri * 3}s linear infinite`,
            }}
            width={r * 2 + 20}
            height={r * 2 + 20}
            viewBox={`${-r - 10} ${-r - 10} ${r * 2 + 20} ${r * 2 + 20}`}
          >
            {Array.from({ length: charCount }).map((_, i) => {
              const angle = (i / charCount) * 2 * Math.PI - Math.PI / 2;
              const x = r * Math.cos(angle);
              const y = r * Math.sin(angle);
              const ch = words[i % words.length];
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  transform={`rotate(${
                    (angle * 180) / Math.PI + 90
                  }, ${x}, ${y})`}
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: Math.max(6, 14 - ri * 2),
                    fill: ri === 0 ? "#fff" : ri === 5 ? BK : "#555",
                    textAnchor: "middle",
                  }}
                >
                  {ch}
                </text>
              );
            })}
          </svg>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: BK,
        }}
      />
    </div>
  );
}

/* ── SUBTLE GRID BACKGROUND (replaces floating emoji doodles) ────────────── */
function GridBackground() {
  const GRID_ICONS = [
    { Icon: MapPin, row: 1, col: 1 },
    { Icon: Navigation, row: 1, col: 4 },
    { Icon: Route, row: 1, col: 7 },
    { Icon: Compass, row: 2, col: 2 },
    { Icon: Waypoints, row: 2, col: 5 },
    { Icon: Locate, row: 2, col: 8 },
    { Icon: MapPin, row: 3, col: 1 },
    { Icon: Navigation, row: 3, col: 4 },
    { Icon: Route, row: 3, col: 7 },
    { Icon: Compass, row: 4, col: 2 },
    { Icon: Waypoints, row: 4, col: 5 },
    { Icon: Locate, row: 4, col: 8 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {/* Dot grid pattern */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.04 }}>
        <defs>
          <pattern id="hero-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.5" fill={BK} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-dots)" />
      </svg>

      {/* Scattered subtle Lucide icons */}
      {GRID_ICONS.map(({ Icon, row, col }, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${col * 11}%`,
            top: `${row * 20 + 5}%`,
            opacity: 0.04,
            transform: `rotate(${(i * 30) % 360}deg)`,
          }}
        >
          <Icon size={28} color={BK} strokeWidth={1.5} />
        </div>
      ))}
    </div>
  );
}

/* ── HERO SECTION ────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const [typed, setTyped] = useState("");
  const words = ["PLAN.", "NAVIGATE.", "EXPLORE.", "ARRIVE."];
  const [wIdx, setWIdx] = useState(0);

  useEffect(() => {
    let i = 0,
      current = words[wIdx];
    const iv = setInterval(() => {
      setTyped(current.slice(0, i + 1));
      i++;
      if (i >= current.length) {
        clearInterval(iv);
        setTimeout(() => {
          let j = current.length;
          const del = setInterval(() => {
            setTyped(current.slice(0, j));
            j--;
            if (j < 0) {
              clearInterval(del);
              setWIdx((w) => (w + 1) % words.length);
            }
          }, 60);
        }, 1400);
      }
    }, 90);
    return () => clearInterval(iv);
  }, [wIdx]);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: WH,
        position: "relative",
        overflow: "hidden",
        paddingTop: 64,
      }}
    >
      {/* Yellow top stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: Y,
        }}
      />

      {/* BIG background text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: "clamp(120px,20vw,240px)",
          color: "rgba(0,0,0,0.04)",
          whiteSpace: "nowrap",
          letterSpacing: -5,
          userSelect: "none",
          zIndex: 0,
        }}
      >
        MARGDARSHAK
      </div>

      <GridBackground />

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          maxWidth: 1200,
          margin: "0 auto",
          padding: "80px 32px 60px",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {/* Logo badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
            animation: "fade-up .5s ease both",
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
            LIVE AI DECISION ENGINE
          </div>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(72px,13vw,160px)",
            lineHeight: 0.88,
            letterSpacing: -2,
            color: BK,
            animation: "fade-up .6s .1s ease both",
          }}
        >
          SMART
          <br />
          <span
            style={{
              color: Y,
              WebkitTextStroke: `4px ${BK}`,
              position: "relative",
            }}
          >
            AI
            <span
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                color: "transparent",
                WebkitTextStroke: `4px ${BK}`,
                zIndex: -1,
                opacity: 0.15,
              }}
            >
              AI
            </span>
          </span>
          <br />
          {typed}
          <span
            style={{
              animation: "blink-cur .9s step-end infinite",
              color: BK,
            }}
          >
            |
          </span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: 18,
            fontWeight: 500,
            color: "#444",
            maxWidth: 520,
            marginTop: 32,
            lineHeight: 1.7,
            animation: "fade-up .6s .25s ease both",
          }}
        >
          MargDarshak converts travel uncertainty into confident, safe, and
          intelligent real-time decisions using AI. Built for India, built for
          you.®
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
            flexWrap: "wrap",
            animation: "fade-up .6s .35s ease both",
          }}
        >
          <a
            href="#features"
            data-hover
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: Y,
              color: BK,
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 22,
              padding: "14px 36px",
              letterSpacing: 3,
              border: `3px solid ${BK}`,
              textDecoration: "none",
              transition: "transform .15s",
              boxShadow: "5px 5px 0 #000",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translate(-3px,-3px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translate(0,0)")
            }
          >
            EXPLORE FEATURES →
          </a>
          <a
            href="#contact"
            data-hover
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: WH,
              color: BK,
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 22,
              padding: "14px 36px",
              letterSpacing: 3,
              border: `3px solid ${BK}`,
              textDecoration: "none",
              transition: "transform .15s",
              boxShadow: "5px 5px 0 #000",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translate(-3px,-3px)";
              e.currentTarget.style.background = BK;
              e.currentTarget.style.color = Y;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translate(0,0)";
              e.currentTarget.style.background = WH;
              e.currentTarget.style.color = BK;
            }}
          >
            GET CONNECTED
          </a>
        </div>

        {/* Bottom row: vortex + stats preview */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 60,
            marginTop: 80,
            flexWrap: "wrap",
          }}
        >
          <VortexText />
          <div
            style={{
              display: "flex",
              gap: 48,
              animation: "fade-up .7s .5s ease both",
            }}
          >
            {[
              ["23+", "AI Features"],
              ["6", "Live APIs"],
              ["94%", "Accuracy"],
              ["₹0", "Walk Option"],
            ].map(([num, lbl]) => (
              <div key={lbl}>
                <div
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 56,
                    color: BK,
                    lineHeight: 1,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#666",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  {lbl}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Yellow diagonal border bottom-right */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: "45%",
          height: 12,
          background: Y,
        }}
      />
    </section>
  );
}
