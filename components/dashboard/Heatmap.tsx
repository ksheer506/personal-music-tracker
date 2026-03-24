import Card from "@components/Card/Card";

type HeatmapProps = {
  title: string;
  values: number[];
};

function getHeatColor(value: number) {
  const alpha = 0.18 + value * 0.72;
  return `color-mix(in srgb, var(--color-primary) ${Math.round(alpha * 100)}%, transparent)`;
}

export default function Heatmap({ title, values }: HeatmapProps) {
  return (
    <Card>
      <h3 className="mb-3 text-base font-medium">{title}</h3>
      <div className="grid grid-cols-7 gap-2">
        {values.map((value, idx) => (
          <div
            key={idx}
            className="aspect-square rounded-[7px] border border-slate-200 transition-transform duration-150 ease-out hover:scale-105 dark:border-slate-700"
            title={`${idx}시`}
            style={{ background: getHeatColor(value) }}
          />
        ))}
      </div>
    </Card>
  );
}
