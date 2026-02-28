import { Y, BK, WH } from "../constants/theme";

const ITEM_GAP = 48;

function TickerGroup({ items, color, keyPrefix }) {
  return (
    <div
      style={{
        display: "flex",
        gap: ITEM_GAP,
        paddingRight: ITEM_GAP,
        flexShrink: 0,
      }}
    >
      {items.map((item, i) => (
        <span
          key={`${keyPrefix}-${i}`}
          style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: 22,
            color,
            letterSpacing: 3,
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {item}
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            style={{ flexShrink: 0 }}
          >
            <rect
              x="2"
              y="2"
              width="6"
              height="6"
              transform="rotate(45 5 5)"
              fill={Y}
            />
          </svg>
        </span>
      ))}
    </div>
  );
}

export default function Ticker({
  items,
  reverse = false,
  bg = BK,
  color = WH,
  speed = 30,
}) {
  return (
    <div
      style={{
        background: bg,
        overflow: "hidden",
        padding: "10px 0",
        borderTop: `3px solid ${Y}`,
        borderBottom: `3px solid ${Y}`,
      }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          willChange: "transform",
          animation: `${
            reverse ? "marquee-r" : "marquee"
          } ${speed}s linear infinite`,
        }}
      >
        <TickerGroup items={items} color={color} keyPrefix="a" />
        <TickerGroup items={items} color={color} keyPrefix="b" />
      </div>
    </div>
  );
}
