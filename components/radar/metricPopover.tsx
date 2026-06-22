"use client";

import { useEffect, useRef } from "react";
import MetricSlider from "./metricSlider";
import type { Metric, Product } from "@/lib/types";

interface MetricPopoverProps {
  metric: Metric;
  products: Product[];
  anchorX: number;
  anchorY: number;
  onScoreChange: (metricId: string, productId: string, value: number) => void;
  onClose: () => void;
}

export default function MetricPopover({
  metric,
  products,
  anchorX,
  anchorY,
  onScoreChange,
  onClose,
}: MetricPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const t = setTimeout(() => document.addEventListener("mousedown", handle), 50);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handle); };
  }, [onClose]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onClose]);

  useEffect(() => {
    if (!popoverRef.current) return;
    const el = popoverRef.current;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (rect.right  > vw - 12) el.style.left = `${anchorX - rect.width  - 12}px`;
    if (rect.bottom > vh - 12) el.style.top  = `${anchorY - rect.height - 12}px`;
  }, [anchorX, anchorY]);

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 w-56 rounded-2xl border border-white/10 bg-gray-100 backdrop-blur-md p-4 shadow-2xl"
      style={{ left: anchorX + 12, top: anchorY - 20 }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-bold tracking-widest text-black/70">
          {metric.name}
        </span>
        <button
          onClick={onClose}
          className="text-grey-300 hover:text-gray-500 text-xs leading-none transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {products.map((p) => (
          <MetricSlider
            key={p.id}
            label={p.name}
            color={p.color}
            value={metric.scores[p.id] ?? 0}
            max={metric.max}
            onChange={(v) => onScoreChange(metric.id, p.id, v)}
          />
        ))}
      </div>
    </div>
  );
}