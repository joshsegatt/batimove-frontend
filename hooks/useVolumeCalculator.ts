import { useState, useMemo, useCallback } from 'react';
import { CalculatorItemState, CalculatorSummary } from '../types/calculator';
import { CALCULATOR_ITEMS, PRICE_PER_M3, DISASSEMBLE_SURCHARGE, MINIMUM_PRICE } from '../data/calculatorItems';

export const HOUSING_PRESETS = [
    {
        id: 'studio',
        name: 'Studio',
        rooms: '1 - 1.5 pièce',
        badge: '10 m³',
        defaultItems: {
            'salon-4': 1,
            'salon-18': 1,
            'salon-15': 1,
            'chambre-3': 1,
            'chambre-7': 1,
            'chambre-22': 1,
            'cuisine-4': 1,
            'cuisine-18': 2,
            'cuisine-2': 1,
            'divers-10': 6,
        }
    },
    {
        id: '2pieces',
        name: '2 - 2.5 pièces',
        rooms: 'Appartement 2p',
        badge: '18 m³',
        defaultItems: {
            'salon-3': 1,
            'salon-18': 1,
            'salon-15': 1,
            'salon-6': 1,
            'cuisine-18': 4,
            'chambre-2': 1,
            'chambre-4': 1,
            'chambre-7': 1,
            'chambre-22': 2,
            'cuisine-3': 1,
            'cuisine-10': 1,
            'divers-10': 12,
        }
    },
    {
        id: '3pieces',
        name: '3 - 3.5 pièces',
        rooms: 'Appartement 3p',
        badge: '28 m³',
        defaultItems: {
            'salon-1': 1,
            'salon-18': 1,
            'salon-15': 1,
            'salon-2': 1,
            'cuisine-18': 6,
            'salon-5': 1,
            'chambre-2': 1,
            'chambre-1': 1,
            'chambre-7': 2,
            'chambre-22': 2,
            'chambre-13': 1,
            'chambre-8': 1,
            'chambre-6': 1,
            'cuisine-1': 1,
            'cuisine-10': 1,
            'cuisine-9': 1,
            'divers-10': 16,
        }
    },
    {
        id: '4pieces',
        name: '4 - 4.5 pièces',
        rooms: 'Appartement 4p',
        badge: '38 m³',
        defaultItems: {
            'salon-1': 1,
            'salon-18': 1,
            'salon-15': 1,
            'salon-2': 1,
            'cuisine-18': 6,
            'salon-5': 2,
            'chambre-2': 1,
            'chambre-1': 1,
            'chambre-7': 2,
            'chambre-22': 4,
            'chambre-13': 2,
            'chambre-4': 1,
            'chambre-6': 2,
            'cuisine-1': 1,
            'cuisine-10': 1,
            'cuisine-9': 1,
            'cuisine-11': 1,
            'divers-5': 2,
            'divers-10': 24,
        }
    },
    {
        id: 'maison',
        name: 'Maison 5p+',
        rooms: 'Villa & Maison',
        badge: '50 m³',
        defaultItems: {
            'salon-1': 1,
            'salon-3': 1,
            'salon-18': 2,
            'salon-15': 2,
            'salon-2': 1,
            'cuisine-18': 8,
            'salon-5': 2,
            'chambre-2': 2,
            'chambre-1': 2,
            'chambre-7': 3,
            'chambre-22': 4,
            'chambre-13': 2,
            'chambre-4': 2,
            'chambre-6': 2,
            'cuisine-1': 1,
            'cuisine-10': 1,
            'cuisine-9': 1,
            'cuisine-11': 1,
            'divers-2': 1,
            'divers-8': 1,
            'divers-5': 2,
            'divers-10': 32,
        }
    }
];

export function useVolumeCalculator() {
    const [items, setItems] = useState<CalculatorItemState[]>(() =>
        CALCULATOR_ITEMS.map(item => ({
            ...item,
            quantity: 0,
            disassemble: false,
        }))
    );
    const [activePreset, setActivePreset] = useState<string | null>(null);

    const summary: CalculatorSummary = useMemo(() => {
        const totalVolume = items.reduce((sum, item) => {
            return sum + (item.volume * item.quantity);
        }, 0);

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        const disassembleCount = items.reduce((sum, item) => {
            return sum + (item.disassemble && item.quantity > 0 ? item.quantity : 0);
        }, 0);

        // Highly competitive Swiss pricing (Anti-Harsch model: transparent, accessible, volume-optimized)
        let estimatedPrice = 0;
        if (totalVolume > 0) {
            if (totalVolume <= 8) {
                estimatedPrice = 550; // Minimum Swiss base
            } else if (totalVolume <= 18) {
                estimatedPrice = 550 + (totalVolume - 8) * 55;
            } else if (totalVolume <= 30) {
                estimatedPrice = 1100 + (totalVolume - 18) * 45;
            } else {
                estimatedPrice = 1640 + (totalVolume - 30) * 40;
            }

            // Disassembly surcharge (+25 CHF per item)
            estimatedPrice += disassembleCount * 25;
        }

        return {
            totalVolume: Math.round(totalVolume * 10) / 10,
            totalItems,
            estimatedPrice: Math.round(estimatedPrice),
            disassembleCount,
        };
    }, [items]);

    const updateQuantity = useCallback((itemId: string, delta: number) => {
        setActivePreset(null); // Clear preset selection when manually adjusted
        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    }, []);

    const toggleDisassemble = useCallback((itemId: string) => {
        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                return { ...item, disassemble: !item.disassemble };
            }
            return item;
        }));
    }, []);

    const applyPreset = useCallback((presetId: string) => {
        const preset = HOUSING_PRESETS.find(p => p.id === presetId);
        if (!preset) return;

        setActivePreset(presetId);
        const defaults = preset.defaultItems as Record<string, number>;

        setItems(CALCULATOR_ITEMS.map(item => ({
            ...item,
            quantity: defaults[item.id] || 0,
            disassemble: false,
        })));
    }, []);

    const resetCalculator = useCallback(() => {
        setActivePreset(null);
        setItems(CALCULATOR_ITEMS.map(item => ({
            ...item,
            quantity: 0,
            disassemble: false,
        })));
    }, []);

    const getItemsByCategory = useCallback((category: string) => {
        return items.filter(item => item.category === category);
    }, [items]);

    const getAllItems = useCallback(() => {
        return items;
    }, [items]);

    return {
        items,
        summary,
        activePreset,
        applyPreset,
        updateQuantity,
        toggleDisassemble,
        resetCalculator,
        getItemsByCategory,
        getAllItems,
    };
}
