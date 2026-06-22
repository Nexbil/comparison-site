"use client";

import { useState, useCallback, useRef } from "react";
import { Settings } from "lucide-react";
import { MAX_PRODUCTS } from "@/lib/constants";
import type { Metric, Product } from "@/lib/types";
import ProductLegend from "./productLegend";
import ProductBuilder from "./productBuilder";
import RadarChartDisplay from "./radarChartDisplay";
import MetricPopover from "./metricPopover";
import MetricSettings from "./metricSettings";
import ScoreCards from "./scorecards";

interface ProductRadarChartProps {
  metrics: Metric[];
  products: Product[];
}

interface PopoverState {
  metricId: string;
  x: number;
  y: number;
}

export default function ProductRadarChart({
  metrics: initialMetrics,
  products: initialProducts,
}: ProductRadarChartProps) {
  const [products, setProducts]         = useState<Product[]>(initialProducts);
  const [metrics, setMetrics]           = useState<Metric[]>(initialMetrics);
  const [popover, setPopover]           = useState<PopoverState | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const containerRef                    = useRef<HTMLDivElement>(null);

  // ── Products ─────────────────────────────────────────────────────────────────

  const addProduct = (product: Product) => {
    if (products.length >= MAX_PRODUCTS) return;
    setProducts((prev) => [...prev, product]);
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Metric scores ─────────────────────────────────────────────────────────────

  const updateScore = useCallback((metricId: string, productId: string, value: number) => {
    setMetrics((prev) =>
      prev.map((m) =>
        m.id === metricId
          ? { ...m, scores: { ...m.scores, [productId]: value } }
          : m
      )
    );
  }, []);

  // ── Metric settings (name + max) ──────────────────────────────────────────────

  const updateMetric = useCallback(
    (id: string, changes: Partial<Pick<Metric, "name" | "max">>) => {
      setMetrics((prev) =>
        prev.map((m) => {
          if (m.id !== id) return m;
          const newMax = changes.max ?? m.max;
          // Clamp all scores to new max if max is being lowered
          const clampedScores = Object.fromEntries(
            Object.entries(m.scores).map(([pid, score]) => [
              pid,
              Math.min(score, newMax),
            ])
          );
          return { ...m, ...changes, scores: clampedScores };
        })
      );
    },
    []
  );

  // ── Popover ───────────────────────────────────────────────────────────────────

  const handleMetricClick = (name: string, svgX: number, svgY: number) => {
    const metric = metrics.find((m) => m.name === name);
    if (!metric) return;
    if (popover?.metricId === metric.id) { setPopover(null); return; }

    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setPopover({ metricId: metric.id, x: rect.left + svgX, y: rect.top + svgY });
  };

  const activeMetric     = popover ? (metrics.find((m) => m.id === popover.metricId) ?? null) : null;
  const activeMetricName = activeMetric?.name ?? null;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">

      {/* Top row: legend + settings toggle */}
      <div className="flex items-center justify-between w-full">
        <ProductLegend products={products} onRemove={removeProduct} />
        <button
          onClick={() => { setShowSettings((v) => !v); setPopover(null); }}
          title="Metric settings"
          className={`p-2 rounded-xl border transition-all duration-150 ${
            showSettings
              ? "bg-violet-600 border-violet-600 text-white shadow-sm"
              : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
          }`}
        >
          <Settings size={15} />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <MetricSettings
          metrics={metrics}
          onUpdate={updateMetric}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Chart */}
      <div ref={containerRef} className="relative w-full flex justify-center">
        <RadarChartDisplay
          metrics={metrics}
          products={products}
          activeMetric={activeMetricName}
          onMetricClick={handleMetricClick}
        />
      </div>

      {/* Score cards */}
      <ScoreCards products={products} metrics={metrics} />

      {/* Floating metric popover */}
      {popover && activeMetric && (
        <MetricPopover
          metric={activeMetric}
          products={products}
          anchorX={popover.x}
          anchorY={popover.y}
          onScoreChange={updateScore}
          onClose={() => setPopover(null)}
        />
      )}

      {/* Add product */}
      {products.length < MAX_PRODUCTS ? (
        <div className="w-full">
          <ProductBuilder
            existingColors={products.map((p) => p.color)}
            onAdd={addProduct}
          />
        </div>
      ) : (
        <p className="text-[11px] text-gray-400 tracking-wide">
          Maximum of {MAX_PRODUCTS} products reached. Remove one to add another.
        </p>
      )}

    </div>
  );
}