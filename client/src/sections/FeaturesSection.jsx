import useInView from "../hooks/useInView";
import FeatureCard from "../components/FeatureCard";
import { Y, BK, WH } from "../constants/theme";
import {
  BrainCircuit,
  MapPin,
  Bus,
  CloudRain,
  ShieldCheck,
  Wallet,
  Leaf,
  Languages,
  Rocket,
} from "lucide-react";

const FEATURES = [
  {
    Icon: BrainCircuit,
    title: "AI CHAT ASSISTANT",
    desc: "Describe your goal — 'I want sunset views under ₹500 in 2 hrs' — and get a full itinerary instantly.",
    color: Y,
  },
  {
    Icon: MapPin,
    title: "LIVE GPS TRACKING",
    desc: "Real-time location awareness with movement-based dynamic recommendations as you travel.",
    color: WH,
  },
  {
    Icon: Bus,
    title: "SMART TRANSPORT",
    desc: "Compare Walk · Bus · Auto · Cab on cost, comfort, time & carbon footprint. AI picks the best.",
    color: Y,
  },
  {
    Icon: CloudRain,
    title: "WEATHER + AQI",
    desc: "Real-time air quality index and rain alerts. We suggest activities based on current conditions.",
    color: WH,
  },
  {
    Icon: ShieldCheck,
    title: "WOMEN SAFETY MODE",
    desc: "Well-lit route prioritization, unsafe area alerts, and one-tap SOS emergency sharing.",
    color: Y,
  },
  {
    Icon: Wallet,
    title: "BUDGET ASSISTANT",
    desc: "Estimated trip cost, ₹-friendly alternatives, and live expense comparisons.",
    color: WH,
  },
  {
    Icon: Leaf,
    title: "ECO TRAVEL SCORE",
    desc: "Carbon footprint per journey. Sustainable route suggestions for the conscious traveler.",
    color: Y,
  },
  {
    Icon: Languages,
    title: "LANGUAGE HELPER",
    desc: "Hindi, Marathi, local phrases with translations to communicate with locals confidently.",
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
              23+ features engineered for the modern Indian traveler.
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
