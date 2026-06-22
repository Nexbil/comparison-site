"use client";

import { useState } from "react";
import { PALETTE } from "@/lib/constants";
import type { Product } from "@/lib/types";

interface ProductBuilderProps {
  existingColors: string[];
  onAdd: (product: Product) => void;
}

export default function ProductBuilder({ existingColors, onAdd }: ProductBuilderProps) {
  const availableColors = PALETTE.filter((p) => !existingColors.includes(p.value));
  const [name, setName] = useState("");
  const [color, setColor] = useState(availableColors[0]?.value ?? PALETTE[0].value);

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd({ id: crypto.randomUUID(), name: trimmed, color });
    setName("");
    const next = availableColors.find((c) => c.value !== color);
    if (next) setColor(next.value);
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-60 bg-gray-100 p-4">
      <p className="text-[14px] text-gray-600 font-bold tracking-wide uppercase">Add Product</p>

      {/* Name input */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Product name…"
        className="rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm text-black placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
      />

      {/* Color swatches */}
      <div className="flex flex-wrap gap-2">
        {PALETTE.map((p) => {
          const taken = existingColors.includes(p.value);
          return (
            <button
              key={p.value}
              title={p.label}
              disabled={taken}
              onClick={() => setColor(p.value)}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-150 ${
                taken
                  ? "opacity-20 cursor-not-allowed border-transparent"
                  : color === p.value
                  ? "border-gray-800 scale-110"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ background: p.value }}
            />
          );
        })}
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        disabled={!name.trim()}
        className="rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold tracking-wide py-2 transition-colors"
      >
        Add Product
      </button>
    </div>
  );
}