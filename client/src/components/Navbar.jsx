import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Y, BK } from "../constants/theme";
import { useClerkAvailable } from "../hooks/useClerkAvailable";

const NavAuthButtons = lazy(() => import("./NavAuthButtons"));

function FallbackLoginButton({ scrolled, onLogin }) {
  return (
    <button
      onClick={onLogin}
      data-hover
      style={{
        background: "transparent",
        border: `2px solid ${Y}`,
        color: scrolled ? Y : BK,
        fontFamily: "'Bebas Neue',sans-serif",
        fontSize: 16,
        letterSpacing: 2,
        padding: "6px 16px",
        cursor: "pointer",
        transition: "all .2s",
      }}
      onMouseEnter={(e) => {
        e.target.style.background = Y;
        e.target.style.color = BK;
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "transparent";
        e.target.style.color = scrolled ? Y : BK;
      }}
    >
      LOGIN
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const clerkAvailable = useClerkAvailable();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogin = () => navigate("/sign-in");

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        background: scrolled ? "rgba(0,0,0,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `3px solid ${Y}` : "none",
        transition: "all .3s",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            background: scrolled ? Y : BK,
            color: scrolled ? BK : Y,
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 28,
            padding: "4px 10px",
            lineHeight: 1,
            letterSpacing: 2,
            border: `3px solid ${Y}`,
          }}
        >
          MARG
          <br />
          DARSHAK
        </div>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: Y,
            animation: "pulse-ring 2s ease-out infinite",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 32,
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 18,
          letterSpacing: 2,
        }}
      >
        {["Hero", "Intro", "Features", "Stats", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{
              color: scrolled ? Y : BK,
              textDecoration: "none",
              transition: "color .2s",
            }}
            data-hover
            onMouseEnter={(e) => (e.target.style.color = Y)}
            onMouseLeave={(e) =>
              (e.target.style.color = scrolled ? Y : BK)
            }
          >
            {item}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {clerkAvailable ? (
          <Suspense fallback={<FallbackLoginButton scrolled={scrolled} onLogin={handleLogin} />}>
            <NavAuthButtons scrolled={scrolled} onLogin={handleLogin} />
          </Suspense>
        ) : (
          <FallbackLoginButton scrolled={scrolled} onLogin={handleLogin} />
        )}

        {/* Hamburger menu */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            cursor: "pointer",
          }}
          data-hover
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div
            style={{
              width: 28,
              height: 3,
              background: scrolled ? Y : BK,
              transition: "all .3s",
              transform: menuOpen
                ? "rotate(45deg) translate(5px,5px)"
                : "none",
            }}
          />
          <div
            style={{
              width: 28,
              height: 3,
              background: scrolled ? Y : BK,
              transition: "all .3s",
              opacity: menuOpen ? 0 : 1,
            }}
          />
        </div>
      </div>
    </nav>
  );
}
