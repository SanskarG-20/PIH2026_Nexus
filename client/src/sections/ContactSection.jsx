import { useState } from "react";
import useInView from "../hooks/useInView";
import { Y, BK, WH } from "../constants/theme";
import { MapPin, BrainCircuit, Rocket, PartyPopper } from "lucide-react";

export default function ContactSection() {
  const [ref, vis] = useInView();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (form.name && form.email) {
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    }
  };

  const inputStyle = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid rgba(255,255,255,0.15)",
    color: WH,
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 16,
    padding: "12px 0",
    outline: "none",
    transition: "border-color .2s",
  };
  const labelStyle = {
    fontFamily: "'Bebas Neue',sans-serif",
    fontSize: 13,
    color: "rgba(255,255,255,.4)",
    letterSpacing: 3,
    display: "block",
    marginBottom: 8,
  };

  return (
    <section
      id="contact"
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
          top: -40,
          left: -10,
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 240,
          color: "rgba(0,0,0,0.04)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        CONTACT!
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 80,
          alignItems: "start",
        }}
      >
        {/* Left */}
        <div ref={ref}>
          <div
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 13,
              color: BK,
              letterSpacing: 4,
              opacity: 0.45,
              marginBottom: 12,
            }}
          >
            // GET IN TOUCH
          </div>
          <h2
            style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(56px,7vw,88px)",
              color: BK,
              lineHeight: 0.88,
              marginBottom: 32,
              animation: vis ? "slide-right .7s ease both" : "none",
            }}
          >
            CONNECT
            <span style={{ color: Y, WebkitTextStroke: `3px ${BK}` }}>!</span>
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 16,
              color: "#444",
              lineHeight: 1.8,
              marginBottom: 40,
              animation: vis ? "fade-up .7s .15s ease both" : "none",
            }}
          >
            Whether you're a traveler, an investor, or a potential partner — we'd
            love to connect. Ask us anything about MargDarshak.®
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              opacity: vis ? 1 : 0,
              transition: "opacity .6s .3s",
            }}
          >
            {[
              { Icon: MapPin, text: "Mumbai, Maharashtra, India" },
              { Icon: BrainCircuit, text: "AI · GPS · Safety · AQI · Budget" },
              { Icon: Rocket, text: "AI Travel Intelligence · Team Nexus" },
            ].map(({ Icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 15,
                  color: "#333",
                }}
              >
                <Icon size={20} color={BK} strokeWidth={2} /> {text}
              </div>
            ))}
          </div>
          {/* Ticker small */}
          <div
            style={{
              marginTop: 48,
              overflow: "hidden",
              borderTop: `3px solid ${BK}`,
              borderBottom: `3px solid ${BK}`,
              padding: "8px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                whiteSpace: "nowrap",
                animation: "marquee 20s linear infinite",
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 18,
                letterSpacing: 3,
              }}
            >
              {["LOGO DESIGN", "BRAND IDENTITY", "WEB DESIGN", "PRODUCT", "UI/UX", "FRAMER"]
                .map((t) => `${t}  ·  `)
                .join("")
                .repeat(3)}
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div
          style={{
            background: BK,
            padding: 40,
            border: `3px solid ${BK}`,
            opacity: vis ? 1 : 0,
            animation: vis ? "slide-left .7s .2s ease both" : "none",
          }}
        >
          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ marginBottom: 20 }}><PartyPopper size={52} color={Y} strokeWidth={2} /></div>
              <div
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 40,
                  color: Y,
                }}
              >
                MESSAGE SENT!
              </div>
              <div
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 15,
                  color: "rgba(255,255,255,.6)",
                  marginTop: 12,
                }}
              >
                We'll be in touch soon.
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 32,
              }}
            >
              <div>
                <span style={labelStyle}>NAME</span>
                <input
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Write your name..."
                  style={{ ...inputStyle }}
                  onFocus={(e) => (e.target.style.borderColor = Y)}
                  onBlur={(e) =>
                    (e.target.style.borderColor =
                      "rgba(255,255,255,0.15)")
                  }
                />
              </div>
              <div>
                <span style={labelStyle}>EMAIL</span>
                <input
                  value={form.email}
                  onChange={update("email")}
                  placeholder="Enter your email..."
                  style={{ ...inputStyle }}
                  onFocus={(e) => (e.target.style.borderColor = Y)}
                  onBlur={(e) =>
                    (e.target.style.borderColor =
                      "rgba(255,255,255,0.15)")
                  }
                />
              </div>
              <div>
                <span style={labelStyle}>MESSAGE</span>
                <textarea
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Enter your message here..."
                  rows={4}
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={(e) => (e.target.style.borderColor = Y)}
                  onBlur={(e) =>
                    (e.target.style.borderColor =
                      "rgba(255,255,255,0.15)")
                  }
                />
              </div>
              <button
                onClick={submit}
                data-hover
                style={{
                  background: Y,
                  color: BK,
                  border: `3px solid ${Y}`,
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 22,
                  padding: "16px",
                  letterSpacing: 3,
                  cursor: "pointer",
                  transition: "all .2s",
                  boxShadow: "4px 4px 0 rgba(255,255,255,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = WH;
                  e.currentTarget.style.transform = "translate(-2px,-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = Y;
                  e.currentTarget.style.transform = "translate(0,0)";
                }}
              >
                SEND MESSAGE →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
