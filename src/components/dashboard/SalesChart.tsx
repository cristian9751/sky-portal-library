// Dependency-free stand-in for the demo's ApexCharts area chart: two smooth series in plain SVG.
// Swap this component for react-apexcharts / react-chartjs-2 when you need a real charting library.
const W = 640;
const H = 220;
const PAD = { t: 12, r: 12, b: 24, l: 12 };

type SalesChartProps = {
  labels: string[];
  series: {
    name: string;
    color: string;
    values: number[];
  }[];
};

function path(values: number[], max: number) {
  const step = (W - PAD.l - PAD.r) / (values.length - 1);
  const y = (v: number) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b);
  const pts: [number, number][] = values.map((v, i) => [PAD.l + i * step, y(v)]);
  const line = pts.reduce((d, [x, py], i) => {
    if (i === 0) return `M${x},${py}`;
    const [px, ppy] = pts[i - 1]!;
    const cx = (px + x) / 2;
    return `${d} C${cx},${ppy} ${cx},${py} ${x},${py}`;
  }, '');
  const last = pts[pts.length - 1]![0];
  return { line, area: `${line} L${last},${H - PAD.b} L${PAD.l},${H - PAD.b} Z` };
}

export default function SalesChart({ labels, series }: SalesChartProps) {
  const max = Math.max(...series.flatMap((s) => s.values)) * 1.1;
  const step = (W - PAD.l - PAD.r) / (labels.length - 1);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-100" role="img" aria-label="Sales value by month">
      {series.map((s) => {
        const p = path(s.values, max);
        return (
          <g key={s.name}>
            <path d={p.area} fill={s.color} opacity="0.15" />
            <path d={p.line} fill="none" stroke={s.color} strokeWidth="2.5" />
          </g>
        );
      })}
      {labels.map((l, i) => (
        <text key={l} x={PAD.l + i * step} y={H - 6} textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.6">
          {l}
        </text>
      ))}
    </svg>
  );
}
