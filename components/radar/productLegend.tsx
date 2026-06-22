import type { Product } from "@/lib/types";

interface ProductLegendProps {
    products: Product[];
    onRemove: (id: string) => void;
}

export default function ProductLegend({ products, onRemove }: ProductLegendProps) {
    return (
        <div className="flex flex-wrap justify-center gap-4">
        {products.map((p) => (
            <div key={p.id} className="flex items-center gap-2 group">
            <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: p.color }}
            />
            <span className="text-xs text-gray">{p.name}</span>
            <button
                onClick={() => onRemove(p.id)}
                title={`Remove ${p.name}`}
                className="text-gray-300 hover:text-gray-500 text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity"
            >
                ✕
            </button>
            </div>
        ))}
        </div>
    );
}