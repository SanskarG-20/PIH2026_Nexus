import useInView from "../hooks/useInView";
import { Y, BK } from "../constants/theme";
import {
  BrainCircuit,
  Rocket,
  ShieldCheck,
  Thermometer,
} from "lucide-react";

export default function IntroSection() {
  const [ref, vis] = useInView();
  const [ref2, vis2] = useInView();

  return (
    <section
      id="intro"
      style={{
        background: BK,
        padding: "100px 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Big faint BG text */}
      <div
        style={{
          position: "absolute",
          bottom: -20,
          left: -10,
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 200,
          color: "rgba(255,255,255,0.03)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        INTRO
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "center",
        }}
      >
        {/* Left */}
        <div ref={ref}>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 13,
              color: Y,
              letterSpacing: 4,
              marginBottom: 16,
              opacity: vis ? 1 : 0,
              transition: "opacity .5s",
            }}
          >
            // JUST AN INTRO
          </div>
          <h2
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(56px,7vw,88px)",
              color: Y,
              lineHeight: 0.9,
              marginBottom: 32,
              animation: vis ? "slide-right .7s ease both" : "none",
            }}
          >
            YOUR AI
            <br />
            TRAVEL
            <br />
            COMPANION.®
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 17,
              color: "rgba(255,255,255,.75)",
              lineHeight: 1.8,
              marginBottom: 32,
              animation: vis ? "fade-up .7s .15s ease both" : "none",
            }}
          >
            Unlike basic map apps, MargDarshak understands your{" "}
            <strong style={{ color: Y }}>intent</strong>. Tell it what
            experience you want — sunset views, street food, adventure — and it
            builds a complete, budget-aware, safety-checked itinerary in
            seconds.
          </p>
          <a
            href="#features"
            data-hover
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              color: BK,
              background: Y,
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 20,
              padding: "12px 28px",
              letterSpacing: 3,
              border: `3px solid ${Y}`,
              textDecoration: "none",
              boxShadow: "4px 4px 0 rgba(255,255,255,0.3)",
              animation: vis ? "fade-up .7s .3s ease both" : "none",
            }}
          >
            CONNECT →
          </a>
        </div>

        {/* Right: skill tags */}
        <div ref={ref2} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { Icon: BrainCircuit, badge: "LOGO +", label: "Intent-Based AI Planning" },
            { Icon: Rocket, badge: "BRAND IDENTITY +", label: "Real-Time Route Optimization" },
            { Icon: ShieldCheck, badge: "WEB DESIGN +", label: "Women & Solo Safety Mode" },
            { Icon: Thermometer, badge: "PRODUCT +", label: "AQI + Weather Intelligence" },
          ].map(({ Icon, badge, label }, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 20px",
                border: "2px solid rgba(255,255,255,0.08)",
                borderLeft: `5px solid ${Y}`,
                background: "rgba(255,255,255,0.02)",
                opacity: vis2 ? 1 : 0,
                transform: vis2 ? "translateX(0)" : "translateX(40px)",
                transition: `all .5s ${i * 0.1}s`,
              }}
            >
              <span style={{ display: "inline-flex" }}><Icon size={24} color={Y} strokeWidth={2} /></span>
              <div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue',sans-serif",
                    fontSize: 20,
                    color: Y,
                    letterSpacing: 2,
                  }}
                >
                  {badge}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Sans',sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,.55)",
                  }}
                >
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
