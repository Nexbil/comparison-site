export interface Product {
    id: string;
    name: string;
    color: string;
}

export interface Metric {
    id: string;
    name: string;
    max: number;
    scores: Record<string, number>
}