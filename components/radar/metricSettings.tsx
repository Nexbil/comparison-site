"use client";

import { useState } from "react";
import type { Metric } from "@/lib/types";

interface MetricSettingsProps {
  metrics: Metric[];
  onUpdate: (id: string, changes: Partial<Pick<Metric, "name" | "max">>) => void;
  onClose: () => void;
}

const MAX_OPTIONS = [5, 10, 20, 50, 100];

export default function MetricSettings({ metrics, onUpdate, onClose }: MetricSettingsProps) {
  const [drafts, setDrafts] = useState<Record<string, string>>(
    Object.fromEntries(metrics.map((m) => [m.id, m.name]))
  );

  const commitName = (id: string) => {
    const trimmed = drafts[id]?.trim().toUpperCase();
    if (trimmed) onUpdate(id, { name: trimmed });
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-5">

      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-bold text-gray-700">Metric Settings</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Rename metrics and set each upper bound</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-gray-500 text-sm transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {metrics.map((m) => (
          <div
            key={m.id}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            <input
              value={drafts[m.id] ?? m.name}
              onChange={(e) =>
                setDrafts((prev) => ({ ...prev, [m.id]: e.target.value }))
              }
              onBlur={() => commitName(m.id)}
              onKeyDown={(e) => e.key === "Enter" && commitName(m.id)}
              className="flex-1 text-xs font-semibold tracking-widest text-gray-700 bg-transparent outline-none border-b border-transparent focus:border-gray-300 transition-colors uppercase"
            />

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] text-gray-400">Max</span>
              <div className="flex gap-1">
                {MAX_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => onUpdate(m.id, { max: opt })}
                    className={`w-8 h-7 rounded-lg text-[10px] font-bold transition-all duration-150 ${
                      m.max === opt
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}