import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { CalculatorItemState } from '../types/calculator';

interface VolumeCalculatorItemProps {
    item: CalculatorItemState;
    onIncrement: () => void;
    onDecrement: () => void;
    onToggleDisassemble: () => void;
}

export const VolumeCalculatorItem: React.FC<VolumeCalculatorItemProps> = ({
    item,
    onIncrement,
    onDecrement,
    onToggleDisassemble,
}) => {
    const hasQuantity = item.quantity > 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-batimove-blue/30 transition-colors gap-3 sm:gap-4"
        >
            {/* Item Name */}
            <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-white block leading-snug">
                    {item.name}
                </span>
                <span className="text-xs text-slate-400 block mt-0.5">
                    {item.volume} m³
                </span>
            </div>

            {/* Quantity Controls and Checkbox */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                {/* Actions Group (Buttons + Quantity) */}
                <div className="flex items-center gap-3">
                    {/* Minus Button */}
                    <button
                        onClick={onDecrement}
                        disabled={item.quantity === 0}
                        className="w-8 h-8 rounded-lg bg-slate-700/50 border border-slate-600/50 flex items-center justify-center text-white hover:bg-slate-600/50 hover:border-batimove-blue/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 shrink-0"
                    >
                        <Minus className="w-4 h-4" />
                    </button>

                    {/* Quantity Display */}
                    <span className="w-6 sm:w-8 text-center text-white font-bold text-sm shrink-0">
                        {item.quantity}
                    </span>

                    {/* Plus Button */}
                    <button
                        onClick={onIncrement}
                        className="w-8 h-8 rounded-lg bg-batimove-blue/20 border border-batimove-blue/50 flex items-center justify-center text-batimove-blue hover:bg-batimove-blue/30 transition-colors duration-200 shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Disassemble Checkbox */}
                <label className="flex items-center gap-2 cursor-pointer group shrink-0 ml-1">
                    <input
                        type="checkbox"
                        checked={item.disassemble}
                        onChange={onToggleDisassemble}
                        disabled={!hasQuantity}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700/50 text-batimove-blue focus:ring-2 focus:ring-batimove-blue focus:ring-offset-0 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    />
                    <span className={`text-xs font-medium transition-colors ${hasQuantity ? 'text-slate-300 group-hover:text-white' : 'text-slate-500'}`}>
                        Démonter
                    </span>
                </label>
            </div>
        </motion.div>
    );
};
