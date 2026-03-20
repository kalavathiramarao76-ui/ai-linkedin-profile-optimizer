'use client';

interface RadarChartProps {
  data: { label: string; value: number }[];
  size?: number;
}

export function RadarChart({ data, size = 300 }: RadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - 40;
  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const gridLevels = [20, 40, 60, 80, 100];

  const dataPoints = data.map((d, i) => getPoint(i, d.value));
  const pathD = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid */}
      {gridLevels.map((level) => {
        const points = data.map((_, i) => {
          const p = getPoint(i, level);
          return `${p.x},${p.y}`;
        });
        return (
          <polygon
            key={level}
            points={points.join(' ')}
            fill="none"
            stroke="hsl(240 3.7% 15.9%)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axes */}
      {data.map((_, i) => {
        const p = getPoint(i, 100);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="hsl(240 3.7% 15.9%)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data area */}
      <path d={pathD} fill="rgba(99, 102, 241, 0.15)" stroke="rgb(99, 102, 241)" strokeWidth="2" />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="rgb(99, 102, 241)" stroke="white" strokeWidth="1" />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const p = getPoint(i, 120);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-zinc-400 text-xs"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
