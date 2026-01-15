import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Home, Package, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './UIComponents';

interface QuoteCalculatorProps {
    className?: string;
}

const cities = [
    'Genève', 'Lausanne', 'Zurich', 'Vaud', 'Neuchâtel', 'Fribourg', 'Montreux', 'Nyon'
];

const propertyTypes = [
    { value: 'studio', label: 'Studio', multiplier: 1, volume: 15 },
    { value: '2p', label: 'Appartement 2 pièces', multiplier: 1.2, volume: 25 },
    { value: '3p', label: 'Appartement 3 pièces', multiplier: 1.5, volume: 35 },
    { value: '4p', label: 'Appartement 4 pièces', multiplier: 2, volume: 50 },
    { value: '5p', label: 'Appartement 5+ pièces', multiplier: 2.5, volume: 70 },
    { value: 'villa', label: 'Villa / Maison', multiplier: 3, volume: 100 }
];

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ className = '' }) => {
    const [from, setFrom] = useState('Genève');
    const [to, setTo] = useState('Lausanne');
    const [propertyType, setPropertyType] = useState('3p');
    const [isCalculating, setIsCalculating] = useState(false);

    const calculatePrice = () => {
        const basePrice = 500;
        const property = propertyTypes.find(p => p.value === propertyType);

        // Simple distance calculation (simplified)
        const distancePrice = from !== to ? 200 : 0;

        const volumePrice = (property?.volume || 30) * 15;
        const total = (basePrice + distancePrice + volumePrice) * (property?.multiplier || 1);

        const min = Math.floor(total * 0.85);
        const max = Math.floor(total * 1.15);

        return { min, max, volume: property?.volume || 30 };
    };

    const { min, max, volume } = calculatePrice();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsCalculating(true);
        setTimeout(() => {
            setIsCalculating(false);
            // Redirect to quote page with params
            window.location.href = `/#/quote?from=${from}&to=${to}&type=${propertyType}`;
        }, 800);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`relative ${className}`}
        >
            {/* 3D Card with Glassmorphism */}
            <div
                className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
                style={{
                    transform: 'perspective(1000px) rotateY(-3deg)',
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Gradient Glow */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative p-8 lg:p-10">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Devis Instantané</span>
                        </div>
                        <h3 className="font-display text-3xl font-bold text-white mb-2">
                            Calculateur Premium
                        </h3>
                        <p className="text-slate-300 text-sm">
                            Estimation en temps réel • Sans engagement
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* From */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-white">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                Point de départ
                            </label>
                            <select
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all hover:bg-white/15"
                            >
                                {cities.map(city => (
                                    <option key={city} value={city} className="bg-slate-900 text-white">
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* To */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-white">
                                <MapPin className="w-4 h-4 text-green-400" />
                                Destination
                            </label>
                            <select
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all hover:bg-white/15"
                            >
                                {cities.map(city => (
                                    <option key={city} value={city} className="bg-slate-900 text-white">
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Property Type */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-white">
                                <Home className="w-4 h-4 text-purple-400" />
                                Type de logement
                            </label>
                            <select
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all hover:bg-white/15"
                            >
                                {propertyTypes.map(type => (
                                    <option key={type.value} value={type.value} className="bg-slate-900 text-white">
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Volume Display */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-white">
                                <Package className="w-4 h-4 text-orange-400" />
                                Volume estimé
                            </label>
                            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-lg">
                                ~{volume}m³
                            </div>
                        </div>

                        {/* Price Estimate */}
                        <motion.div
                            animate={isCalculating ? { scale: [1, 1.02, 1] } : {}}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-6 backdrop-blur-sm"
                        >
                            <div className="text-center">
                                <p className="text-blue-200 text-sm font-semibold mb-2">Estimation</p>
                                <p className="text-white font-display text-4xl font-bold mb-1">
                                    CHF {min.toLocaleString()} - {max.toLocaleString()}
                                </p>
                                <p className="text-slate-300 text-xs flex items-center justify-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Devis détaillé gratuit
                                </p>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isCalculating}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-blue-900/50 transition-all hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            {isCalculating ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    Calcul en cours...
                                </>
                            ) : (
                                <>
                                    Obtenir mon devis détaillé
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </Button>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-6 text-xs text-slate-300 pt-2">
                            <span className="flex items-center gap-1">
                                ✓ Réponse en 2h
                            </span>
                            <span className="flex items-center gap-1">
                                ✓ Sans engagement
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};
