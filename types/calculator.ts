// Types for Volume Calculator
export type ItemCategory = 'salon' | 'cuisine' | 'chambre' | 'divers';

export interface CalculatorItem {
    id: string;
    name: string;
    volume: number; // m³
    category: ItemCategory;
}

export interface CalculatorItemState extends CalculatorItem {
    quantity: number;
    disassemble: boolean;
}

export interface CalculatorSummary {
    totalVolume: number; // m³
    totalItems: number;
    estimatedPrice: number; // CHF
    disassembleCount: number;
}
