import { Slider } from "@/components/ui/slider";

interface MetricSliderProps {
  label: string;
  color: string;
  value: number;   
  max?: number;
  onChange: (v: number) => void;
}

export default function MetricSlider({
  label,
  color,
  value,
  max = 5,
  onChange,
}: MetricSliderProps) {
  return (
    <div className="flex flex-col gap-2">

      <div className="flex justify-between items-center">
        <span className="text-[10px] font-semibold tracking-widest" style={{ color }}>
          {label}
        </span>
        <span className="text-[10px] font-bold tabular-nums text-gray-400">
          {value.toFixed(1)} <span className="text-gray-300">/ {max}</span>
        </span>
      </div>

      <Slider
        min={0}
        max={max}
        step={0.1}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="w-full"
        style={{ "--slider-color": color } as React.CSSProperties}
      />

    </div>
  );
}