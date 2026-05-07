const MiniBarChart = ({ data = [], height = 160 }) => {
  if (!data.length) return null;

  const maxTotal  = Math.max(...data.map((d) => d.total), 1);
  const barWidth  = 28;
  const gap       = 12;
  const paddingX  = 12;
  const paddingY  = 16;
  const chartH    = height - paddingY * 2 - 24;
  const totalW    = data.length * (barWidth + gap) - gap + paddingX * 2;

  const getBarH = (val) =>
    val === 0 ? 2 : Math.max(4, (val / maxTotal) * chartH);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${totalW} ${height}`}
        width="100%"
        style={{ display: "block", minWidth: `${Math.min(totalW, 320)}px` }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#818cf8" stopOpacity="1"   />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {data.map((d, i) => {
          const x        = paddingX + i * (barWidth + gap);
          const ghostH   = getBarH(d.total);
          const fillH    = getBarH(d.completed);
          const ghostY   = paddingY + chartH - ghostH;
          const fillY    = paddingY + chartH - fillH;
          const labelY   = height - 4;
          const isLast   = i === data.length - 1;
          const rateLabel = d.total > 0 ? `${d.rate}%` : "";

          return (
            <g key={i}>
              {/* Ghost bar — total */}
              <rect
                x={x} y={ghostY}
                width={barWidth} height={ghostH}
                rx={5}
                fill="var(--border)"
              />

              {/* Fill bar — completed */}
              {d.completed > 0 && (
                <rect
                  x={x} y={fillY}
                  width={barWidth} height={fillH}
                  rx={5}
                  fill={isLast ? "url(#barGradientActive)" : "url(#barGradient)"}
                  opacity={isLast ? 1 : 0.8}
                />
              )}

              {/* % label */}
              {rateLabel && (
                <text
                  x={x + barWidth / 2}
                  y={Math.min(fillY - 4, ghostY - 4)}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isLast ? "#6366f1" : "var(--text-muted)"}
                  fontFamily="var(--font-display)"
                  fontWeight="700"
                >
                  {rateLabel}
                </text>
              )}

              {/* X-axis label */}
              <text
                x={x + barWidth / 2}
                y={labelY}
                textAnchor="middle"
                fontSize="9.5"
                fill={isLast ? "var(--text-primary)" : "var(--text-muted)"}
                fontFamily="var(--font-body)"
                fontWeight={isLast ? "600" : "400"}
              >
                {d.label.length > 8 ? `${d.label.slice(0, 7)}…` : d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={legend.row}>
        <span style={legend.item}>
          <span style={{ ...legend.dot, background: "var(--border)" }} />
          Total
        </span>
        <span style={legend.item}>
          <span style={{ ...legend.dot, background: "#6366f1" }} />
          Completed
        </span>
      </div>
    </div>
  );
};

const legend = {
  row: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    marginTop: "8px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "11px",
    color: "var(--text-muted)",
    fontFamily: "var(--font-body)",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "2px",
    flexShrink: 0,
  },
};

export default MiniBarChart;