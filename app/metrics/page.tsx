import ProductRadarChart from "@/components/radar/productRadarChart";
import type { Metric, Product } from "@/lib/types";

const seedProducts: Product[] = [
  { id: "A",   name: "Product A",   color: "#7c3aed" },
  { id: "B", name: "Product B", color: "#0ea5e9" },
];

const metrics: Metric[] = [
  { id: "A",      name: "A", max:5, scores: { A: 4.5, B: 3.0 } },
  { id: "B",      name: "B", max:5, scores: { A: 4.0, B: 2.5 } },
  { id: "C",     name: "C", max:5, scores: { A: 4.8, B: 3.5 } },
  { id: "D",     name: "D", max:5, scores: { A: 4.8, B: 3.5 } },
  { id: "E",   name: "E", max:5, scores: { A: 3.0, B: 4.5 } },
  { id: "F", name: "F", max:5, scores: { A: 4.2, B: 3.8 } },
];

export default function ComparePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <ProductRadarChart metrics={metrics} products={seedProducts} />
    </div>
  );
}