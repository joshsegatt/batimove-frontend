import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calculator as CalculatorIcon, Package2, Send, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useVolumeCalculator } from '../hooks/useVolumeCalculator';
import { VolumeCalculatorItem } from '../components/VolumeCalculatorItem';
import { Button } from '../components/UIComponents';

const CATEGORIES = [
    { id: 'salon', label: 'Salon & Salle à Manger', icon: '🛋️' },
    { id: 'cuisine', label: 'Cuisine & Électroménager', icon: '🍳' },
    { id: 'chambre', label: 'Chambre(s) & Bureau', icon: '🛏️' },
    { id: 'divers', label: 'Divers (Garage, Cave...)', icon: '🚲' },
];

export default function Calculator() {
    const navigate = useNavigate();
    const {
        summary,
        updateQuantity,
        toggleDisassemble,
        resetCalculator,
        getItemsByCategory,
        getAllItems,
    } = useVolumeCalculator();

    const [expandedCategories, setExpandedCategories] = useState<string[]>(['salon']);

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleProceedToCheckout = () => {
        if (summary.totalVolume === 0) {
            alert('Veuillez sélectionner au moins un item');
            return;
        }

        // Get all items with their current state
        const allItems = getAllItems();

        // Prepare calculator data for localStorage
        const calculatorData = {
            items: allItems.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                volume: item.volume,
                needsDisassembly: item.needsDisassembly,
            })),
            totalVolume: summary.totalVolume,
            estimatedPrice: summary.estimatedPrice,
            totalItems: summary.totalItems,
            disassembleCount: summary.disassembleCount,
            timestamp: new Date().toISOString(),
        };

        // Save to localStorage
        localStorage.setItem('calculatorData', JSON.stringify(calculatorData));

        // Navigate to checkout page
        navigate('/calculator/checkout');
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* HERO SECTION */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-12 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Title */}
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight">
                            Calculez Votre{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-batimove-blue to-blue-400">
                                Volume
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Estimez précisément le volume de votre déménagement et obtenez un devis instantané
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* STICKY SUMMARY BAR */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-20 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 shadow-lg"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Summary Stats */}
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Package2 className="w-5 h-5 text-batimove-blue" />
                                <div>
                                    <p className="text-xs text-slate-400">Volume Total</p>
                                    <p className="text-lg font-bold text-white">
                                        {summary.totalVolume} m³
                                    </p>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-slate-700" />

                            <div>
                                <p className="text-xs text-slate-400">Prix Estimé</p>
                                <p className="text-lg font-bold text-batimove-blue">
                                    {summary.estimatedPrice > 0 ? `CHF ${summary.estimatedPrice}` : 'CHF 0'}
                                </p>
                            </div>

                            <div className="h-8 w-px bg-slate-700" />

                            <div>
                                <p className="text-xs text-slate-400">Items</p>
                                <p className="text-lg font-bold text-white">{summary.totalItems}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={resetCalculator}
                                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span className="text-sm font-medium">Réinitialiser</span>
                            </button>

                            <Button
                                onClick={handleProceedToCheckout}
                                disabled={summary.totalVolume === 0}
                                className="flex items-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Envoyer le Devis
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* CALCULATOR CONTENT */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="space-y-6">
                        {CATEGORIES.map((category, index) => {
                            const items = getItemsByCategory(category.id);
                            const isExpanded = expandedCategories.includes(category.id);
                            const categoryTotal = items.reduce((sum, item) => sum + (item.volume * item.quantity), 0);

                            return (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden"
                                >
                                    {/* Category Header */}
                                    <button
                                        onClick={() => toggleCategory(category.id)}
                                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-3xl">{category.icon}</span>
                                            <div className="text-left">
                                                <h3 className="text-xl font-bold text-white">{category.label}</h3>
                                                <p className="text-sm text-slate-400">
                                                    {items.filter(i => i.quantity > 0).length} items sélectionnés
                                                    {categoryTotal > 0 && ` • ${categoryTotal.toFixed(1)} m³`}
                                                </p>
                                            </div>
                                        </div>

                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-slate-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-slate-400" />
                                        )}
                                    </button>

                                    {/* Category Items */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6 space-y-2">
                                            {items.map(item => (
                                                <VolumeCalculatorItem
                                                    key={item.id}
                                                    item={item}
                                                    onIncrement={() => updateQuantity(item.id, 1)}
                                                    onDecrement={() => updateQuantity(item.id, -1)}
                                                    onToggleDisassemble={() => toggleDisassemble(item.id)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

        </div>
    );
}
