"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import type { Metric, Product } from "@/lib/types";

interface CustomTickProps {
  x?: string | number;
  y?: string | number;
  payload?: { value: string };
  activeMetric: string | null;
  onTickClick: (name: string, x: number, y: number) => void;
}

function CustomAxisTick({ x, y, payload, activeMetric, onTickClick }: CustomTickProps) {
  if (!payload) return null;
  const isActive = activeMetric === payload.value;
  const nx = Number(x);
  const ny = Number(y);

  return (
    <text
      x={nx}
      y={ny}
      textAnchor="middle"
      dominantBaseline="middle"
      onClick={() => onTickClick(payload.value, nx, ny)}
      fill={isActive ? "#7c3aed" : "#9ca3af"}
      fontSize={isActive ? 11 : 10}
      fontWeight={isActive ? 700 : 500}
      letterSpacing={2}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      {payload.value}
    </text>
  );
}

interface RadarChartDisplayProps {
  metrics: Metric[];
  products: Product[];
  activeMetric: string | null;
  onMetricClick: (name: string, svgX: number, svgY: number) => void;
}

export default function RadarChartDisplay({
  metrics,
  products,
  activeMetric,
  onMetricClick,
}: RadarChartDisplayProps) {
  const chartData = metrics.map((m) => {
    const entry: Record<string, string | number> = { subject: m.name, fullMark: 100 };
    products.forEach((p) => {
      entry[p.id] = ((m.scores[p.id] ?? 0) / 5) * 100;
    });
    return entry;
  });

  const chartConfig = Object.fromEntries(
    products.map((p) => [p.id, { label: p.name, color: p.color }])
  );

  return (
    <ChartContainer config={chartConfig} className="w-full aspect-square max-w-[420px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} margin={{ top: 30, right: 40, bottom: 30, left: 40 }}>

          <defs>
            {products.map((p) => (
              <linearGradient key={p.id} id={`gradient-${p.id}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"   stopColor={p.color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={p.color} stopOpacity={0.5} />
              </linearGradient>
            ))}
          </defs>

          <PolarGrid stroke="#e5e7eb" gridType="polygon" />

          <PolarAngleAxis
            dataKey="subject"
            tickLine={false}
            tick={(props) => (
              <CustomAxisTick
                {...props}
                activeMetric={activeMetric}
                onTickClick={onMetricClick}
              />
            )}
          />

          {products.map((p, i) => (
            <Radar
              key={p.id}
              name={p.name}
              dataKey={p.id}
              stroke={p.color}
              strokeWidth={i === 0 ? 2 : 1.5}
              fill={`url(#gradient-${p.id})`}
              fillOpacity={i === 0 ? 0.75 : 0.45}
              dot={i === 0 ? { r: 4, fill: "#fff", strokeWidth: 2, stroke: p.color } : false}
            />
          ))}

        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}