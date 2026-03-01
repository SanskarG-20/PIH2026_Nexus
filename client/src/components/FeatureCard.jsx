import { useState } from "react";
import { Y, BK, WH } from "../constants/theme";

export default function FeatureCard({ f, i, isBk, vis }) {
  const [hovered, setHovered] = useState(false);
  const IconComponent = f.Icon;

  // Determine icon color based on card state
  const iconColor = hovered ? (isBk ? Y : BK) : isBk ? BK : WH;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        background: hovered ? (isBk ? BK : Y) : isBk ? "#f5f5f5" : BK,
        color: hovered ? (isBk ? Y : BK) : isBk ? BK : WH,
        padding: "28px 20px",
        border: `2px solid ${BK}`,
        cursor: "pointer",
        transition: "all .25s cubic-bezier(.4,0,.2,1)",
        transform: hovered ? "translate(-3px,-3px)" : "translate(0,0)",
        boxShadow: hovered ? `6px 6px 0 ${BK}` : "none",
        opacity: vis ? 1 : 0,
        animation: vis ? `fade-up .5s ${i * 0.06}s ease both` : "none",
      }}
    >
      <div
        style={{
          marginBottom: 20,
          transition: "transform .25s",
          transform: hovered ? "scale(1.1) rotate(6deg)" : "none",
          display: "inline-flex",
        }}
      >
        <IconComponent size={36} color={iconColor} strokeWidth={2} />
      </div>
      <div
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 24,
          letterSpacing: 2,
          marginBottom: 14,
          lineHeight: 1,
        }}
      >
        {f.title}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: 14,
          lineHeight: 1.75,
          opacity: 0.75,
        }}
      >
        {f.desc}
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 14,
          letterSpacing: 2,
          opacity: hovered ? 1 : 0,
          transition: "opacity .2s",
          color: hovered ? (isBk ? Y : BK) : "transparent",
        }}
      >
        LEARN MORE →
      </div>
    </div>
  );
}
