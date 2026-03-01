import { useNavigate } from "react-router-dom";
import { useClerkAvailable } from "../hooks/useClerkAvailable";
import useInView from "../hooks/useInView";
import { Y, BK, WH } from "../constants/theme";
import { Map, BrainCircuit, Bus, ShieldCheck } from "lucide-react";

export default function WorkSection() {
  const [ref, vis] = useInView();
  const navigate = useNavigate();
  const clerkAvailable = useClerkAvailable();

  const screens = [
    {
      title: "HOME MAP",
      sub: "Live GPS + AI Alert",
      bg: "linear-gradient(135deg,#003355,#006688)",
      Icon: Map,
    },
    {
      title: "AI CHAT",
      sub: "Intent → Itinerary",
      bg: "linear-gradient(135deg,#1a0a00,#4a2000)",
      Icon: BrainCircuit,
    },
    {
      title: "TRANSPORT",
      sub: "Smart Comparison",
      bg: "linear-gradient(135deg,#001a00,#004400)",
      Icon: Bus,
    },
    {
      title: "SAFETY MODE",
      sub: "SOS + Lit Routes",
      bg: "linear-gradient(135deg,#1a0022,#440055)",
      Icon: ShieldCheck,
    },
  ];

  return (
    <section
      id="work"
      style={{
        background: BK,
        padding: "80px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div ref={ref} style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(48px,12vw,160px)",
              color: WH,
              lineHeight: 0.88,
              animation: vis ? "fade-up .7s ease both" : "none",
            }}
          >
            PRODUCT PREVIEW<span style={{ color: Y }}>.</span>
          </h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 12,
          }}
        >
          {screens.map((s, i) => (
            <div
              key={i}
              onClick={() => {
                const authed = clerkAvailable && window.Clerk?.user;
                navigate(authed ? "/app" : "/sign-in");
              }}
              style={{
                background: s.bg,
                padding: "36px 24px",
                border: "2px solid rgba(255,255,255,0.1)",
                position: "relative",
                overflow: "hidden",
                opacity: vis ? 1 : 0,
                transition: `all .6s ${i * 0.12}s`,
                transform: vis ? "translateY(0)" : "translateY(40px)",
                cursor: "pointer",
                minHeight: 160,
              }}
              data-hover
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = Y;
                e.currentTarget.style.transform = "translate(-4px,-4px)";
                e.currentTarget.style.boxShadow = `8px 8px 0 ${Y}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translate(0,0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  right: -10,
                  opacity: 0.08,
                  lineHeight: 1,
                }}
              >
                <s.Icon size={120} color={WH} strokeWidth={1} />
              </div>
              <div
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 40,
                  color: WH,
                  letterSpacing: 1,
                  lineHeight: 1,
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 14,
                  color: "rgba(255,255,255,.55)",
                  marginTop: 8,
                }}
              >
                {s.sub}
              </div>
              <div style={{ marginTop: 32 }}><s.Icon size={40} color={WH} strokeWidth={2} /></div>
            </div>
          ))}
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 60,
            opacity: vis ? 1 : 0,
            transition: "opacity .6s .4s",
          }}
        >
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(48px,8vw,100px)",
              color: "rgba(255,255,255,0.06)",
              letterSpacing: -2,
            }}
          >
            PLAY REEL
          </div>
        </div>
      </div>
    </section>
  );
}
