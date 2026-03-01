import { useState, useEffect } from "react";
import useInView from "../hooks/useInView";
import { Y } from "../constants/theme";

/* ── Count-up animation hook ─────────────────────────────────────────────── */
function useCountUp(target, visible, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / (duration / 16);
    const iv = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(iv);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(iv);
  }, [visible, target]);

  return count;
}

/* ── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({ num, suffix, label, delay, visible }) {
  const count = useCountUp(num, visible);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px 20px",
        opacity: visible ? 1 : 0,
        animation: visible
          ? `counter-up .6s ${delay}s ease both`
          : "none",
      }}
    >
      <div
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: "clamp(72px,9vw,120px)",
          color: Y,
          lineHeight: 0.9,
          letterSpacing: -2,
        }}
      >
        {count}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 13,
          color: "rgba(255,255,255,.5)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginTop: 10,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ── Stats Section ───────────────────────────────────────────────────────── */
export default function StatsSection() {
  const [ref, vis] = useInView(0.3);

  const stats = [
    { num: 6, suffix: "", label: "Transport Modes", d: 0 },
    { num: 61, suffix: "", label: "Safety Zones", d: 0.1 },
    { num: 5, suffix: "", label: "Live APIs", d: 0.2 },
    { num: 100, suffix: "%", label: "Offline Ready", d: 0.3 },
  ];

  return (
    <section
      id="stats"
      style={{
        background: "#000",
        borderTop: `8px solid ${Y}`,
        borderBottom: `8px solid ${Y}`,
        scrollMarginTop: 80,
      }}
    >
      <div
        ref={ref}
        className="stats-grid"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          padding: "0 16px",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className={i < 3 ? "stats-divider" : ""}
            style={{
              borderRight:
                i < 3
                  ? "2px solid rgba(255,255,255,0.08)"
                  : "none",
            }}
          >
            <StatCard
              num={s.num}
              suffix={s.suffix}
              label={s.label}
              delay={s.d}
              visible={vis}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
