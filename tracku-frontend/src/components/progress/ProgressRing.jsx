/**
 * Animated SVG circular progress ring.
 */
const ProgressRing = ({ pct = 0, size = 120, stroke = 8, label, sublabel }) => {
  const r          = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset     = circumference - (pct / 100) * circumference;
  const center     = size / 2;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={center} cy={center} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {/* Fill */}
        <circle
          cx={center} cy={center} r={r}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
        {/* Glow circle at tip */}
        {pct > 0 && (
          <circle
            cx={center + r * Math.cos((2 * Math.PI * pct) / 100 - Math.PI / 2)}
            cy={center + r * Math.sin((2 * Math.PI * pct) / 100 - Math.PI / 2)}
            r={stroke / 2 + 1}
            fill="#818cf8"
            opacity="0.7"
          />
        )}
        {/* Center text */}
        <text
          x={center} y={center - 6}
          textAnchor="middle"
          fontSize={size * 0.18}
          fill="var(--text-primary)"
          fontFamily="var(--font-display)"
          fontWeight="800"
        >
          {pct}%
        </text>
        <text
          x={center} y={center + size * 0.13}
          textAnchor="middle"
          fontSize={size * 0.09}
          fill="var(--text-muted)"
          fontFamily="var(--font-body)"
        >
          done
        </text>

        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>

      {label && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            {label}
          </p>
          {sublabel && (
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
              {sublabel}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;