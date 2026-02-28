import { Y, BK, WH } from "../constants/theme";

export default function Footer() {
  return (
    <footer
      style={{
        background: BK,
        borderTop: `8px solid ${Y}`,
        padding: "48px 32px 32px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            gap: 40,
            marginBottom: 40,
          }}
        >
          {/* Left links */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {["FACEBOOK", "INSTAGRAM", "LINKEDIN", "TIKTOK"].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 16,
                  color: "rgba(255,255,255,.4)",
                  letterSpacing: 2,
                  textDecoration: "none",
                  transition: "color .2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = Y)}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,.4)")
                }
              >
                {s}
              </a>
            ))}
          </div>

          {/* Center logo */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                background: Y,
                color: BK,
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 36,
                padding: "10px 20px",
                letterSpacing: 3,
                lineHeight: 1,
                border: `3px solid ${Y}`,
                display: "inline-block",
              }}
            >
              MARG
              <br />
              DARSHAK
            </div>
            <div
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 11,
                color: "rgba(255,255,255,.3)",
                marginTop: 12,
                letterSpacing: 2,
              }}
            >
              AI TRAVEL INTELLIGENCE OS
            </div>
          </div>

          {/* Right links */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              alignItems: "flex-end",
            }}
          >
            {["WORK", "ABOUT", "FEATURES", "CONTACT"].map((s) => (
              <a
                key={s}
                href={`#${s.toLowerCase()}`}
                style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 16,
                  color: "rgba(255,255,255,.4)",
                  letterSpacing: 2,
                  textDecoration: "none",
                  transition: "color .2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = Y)}
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,.4)")
                }
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 12,
              color: "rgba(255,255,255,.25)",
            }}
          >
            © 2025 MargDarshak · AI Travel Intelligence
          </span>
          <div
            style={{
              display: "flex",
              gap: 24,
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 12,
              letterSpacing: 2,
              color: "rgba(255,255,255,.25)",
            }}
          >
            <span>23+ AI MODULES</span>
            <span style={{ color: Y, fontSize: 8, lineHeight: 1 }}>◆</span>
            <span>6 LIVE APIs</span>
            <span style={{ color: Y, fontSize: 8, lineHeight: 1 }}>◆</span>
            <span>BUILT FOR INDIAN CITIES</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
