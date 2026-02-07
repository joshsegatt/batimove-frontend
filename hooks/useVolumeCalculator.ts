import { useState, useMemo, useCallback } from 'react';
import { CalculatorItemState, CalculatorSummary } from '../types/calculator';
import { CALCULATOR_ITEMS, PRICE_PER_M3, DISASSEMBLE_SURCHARGE, MINIMUM_PRICE } from '../data/calculatorItems';

export function useVolumeCalculator() {
    const [items, setItems] = useState<CalculatorItemState[]>(() =>
        CALCULATOR_ITEMS.map(item => ({
            ...item,
            quantity: 0,
            disassemble: false,
        }))
    );

    const summary: CalculatorSummary = useMemo(() => {
        const totalVolume = items.reduce((sum, item) => {
            return sum + (item.volume * item.quantity);
        }, 0);

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

        const disassembleCount = items.reduce((sum, item) => {
            return sum + (item.disassemble && item.quantity > 0 ? item.quantity : 0);
        }, 0);

        // Calculate base price
        let estimatedPrice = totalVolume * PRICE_PER_M3;

        // Add disassembly surcharge
        const disassemblySurcharge = items.reduce((sum, item) => {
            if (item.disassemble && item.quantity > 0) {
                const itemPrice = item.volume * item.quantity * PRICE_PER_M3;
                return sum + (itemPrice * DISASSEMBLE_SURCHARGE);
            }
            return sum;
        }, 0);

        estimatedPrice += disassemblySurcharge;

        // Apply minimum price
        if (estimatedPrice > 0 && estimatedPrice < MINIMUM_PRICE) {
            estimatedPrice = MINIMUM_PRICE;
        }

        return {
            totalVolume: Math.round(totalVolume * 10) / 10, // Round to 1 decimal
            totalItems,
            estimatedPrice: Math.round(estimatedPrice),
            disassembleCount,
        };
    }, [items]);

    const updateQuantity = useCallback((itemId: string, delta: number) => {
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

    const resetCalculator = useCallback(() => {
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
        updateQuantity,
        toggleDisassemble,
        resetCalculator,
        getItemsByCategory,
        getAllItems,
    };
}
