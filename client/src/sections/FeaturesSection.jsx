import useInView from "../hooks/useInView";
import FeatureCard from "../components/FeatureCard";
import { Y, BK, WH } from "../constants/theme";
import {
  BrainCircuit,
  MapPin,
  Bus,
  CloudRain,
  ShieldCheck,
  AlertTriangle,
  Leaf,
  WifiOff,
  Rocket,
} from "lucide-react";

const FEATURES = [
  {
    Icon: BrainCircuit,
    title: "AI CHAT ASSISTANT",
    desc: "Describe your intent — 'rainy day date under ₹500' — and get multi-modal routes, safety scores, and smart suggestions instantly.",
    color: Y,
  },
  {
    Icon: MapPin,
    title: "LIVE LOCATION",
    desc: "GPS-based origin detection with reverse geocoding. Your current position feeds directly into route and safety analysis.",
    color: WH,
  },
  {
    Icon: Bus,
    title: "SMART TRANSPORT",
    desc: "Compare Walk · Metro · Train · Bus · Auto · Cab on cost, duration, and CO₂ — with eco scores per mode.",
    color: Y,
  },
  {
    Icon: CloudRain,
    title: "WEATHER + AQI",
    desc: "Real-time air quality index and weather conditions. Route suggestions adapt to rain, heat, and pollution levels.",
    color: WH,
  },
  {
    Icon: ShieldCheck,
    title: "SAFETY INTELLIGENCE",
    desc: "61 mapped safety zones with real-time scoring, night-awareness alerts, and explainable AI route reasoning.",
    color: Y,
  },
  {
    Icon: AlertTriangle,
    title: "SOS EMERGENCY",
    desc: "One-tap SOS with GPS coordinates, reverse-geocoded address, emergency call (112), and audio alert — works offline.",
    color: WH,
  },
  {
    Icon: Leaf,
    title: "ECO TRAVEL SCORE",
    desc: "Per-mode CO₂ emissions (g/km), green badges for low-carbon options, and savings vs. cab comparison.",
    color: Y,
  },
  {
    Icon: WifiOff,
    title: "OFFLINE MODE",
    desc: "Cached AI responses, weather data, and route intel with automatic TTL. Travel confidently without connectivity.",
    color: WH,
  },
];

export default function FeaturesSection() {
  const [ref, vis] = useInView(0.08);

  return (
    <section
      id="features"
      style={{
        background: WH,
        padding: "100px 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
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
      <div
        style={{
          position: "absolute",
          bottom: -60,
          right: -20,
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 220,
          color: "rgba(0,0,0,0.04)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        FEAT
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          ref={ref}
          style={{
            marginBottom: 64,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 13,
                color: BK,
                letterSpacing: 4,
                opacity: 0.5,
                marginBottom: 10,
              }}
            >
              // ALL MODULES
            </div>
            <h2
              style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(60px,9vw,110px)",
                lineHeight: 0.88,
                color: BK,
                animation: vis ? "slide-right .7s ease both" : "none",
              }}
            >
              EXPERI
              <span style={{ color: Y, WebkitTextStroke: `3px ${BK}` }}>
                ENCE
              </span>
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: vis ? 1 : 0,
              transition: "opacity .6s .3s",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                animation: "float-c 3s ease-in-out infinite",
              }}
            >
              <Rocket size={36} color={BK} strokeWidth={2} />
            </span>
            <div
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                color: "#555",
                maxWidth: 220,
                lineHeight: 1.6,
              }}
            >
              10+ modules engineered for the modern Indian traveler.
            </div>
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 0,
          }}
        >
          {FEATURES.map((f, i) => {
            const isBk = f.color === WH;
            return (
              <FeatureCard key={i} f={f} i={i} isBk={isBk} vis={vis} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
