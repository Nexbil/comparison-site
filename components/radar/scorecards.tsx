"use client";

import { useState } from "react";
import type { Metric, Product } from "@/lib/types";

interface ScoreCardsProps {
  products: Product[];
  metrics: Metric[];
}

export default function ScoreCards({ products, metrics }: ScoreCardsProps) {
  const [activeMetricId, setActiveMetricId] = useState<string>(metrics[0]?.id ?? "");

  const activeMetric = metrics.find((m) => m.id === activeMetricId) ?? metrics[0];

  if (!activeMetric || products.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[420px]">

      {/* Metric icon pills — one per metric */}
      <div className="flex flex-wrap justify-center gap-2">
        {metrics.map((m, i) => {
          const isActive = m.id === activeMetricId;
          return (
            <button
              key={m.id}
              onClick={() => setActiveMetricId(m.id)}
              title={m.name}
              className={`flex items-center justify-center w-10 h-10 rounded-xl border text-[10px] font-bold tracking-wider transition-all duration-150 ${
                isActive
                  ? "bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-200"
                  : "bg-white border-gray-200 text-gray-400 hover:bg-gray-300 hover:textgray-600"
              }`}
            >
              {/* Show metric initial as icon placeholder */}
              {m.name.charAt(0)}
            </button>
          );
        })}
      </div>

      {/* Active metric name */}
      <p className="text-[10px] tracking-widest text-gray-400 uppercase">
        {activeMetric.name}
      </p>

      {/* Score row — one per product */}
      <div className="flex justify-center gap-10">
        {products.map((p) => {
          const raw   = activeMetric.scores[p.id] ?? 0;   // 0–5
          const score = Math.round((raw / 5) * 100);       // scale to 100

          return (
            <div key={p.id} className="flex flex-col items-center gap-1">
              <span
                className="text-3xl font-black tabular-nums leading-none"
                style={{ color: p.color }}
              >
                {score}
              </span>
              <span className="text-[9px] text-gray-400 tracking-widest">POINTS</span>
              <span className="text-[10px] text-gray-400 max-w-[90px] text-center leading-tight mt-0.5">
                {p.name}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}