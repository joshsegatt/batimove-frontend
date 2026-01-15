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
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`relative ${className}`}
        >
            {/* 3D Card with Site Colors */}
            <div
                className="relative bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
            >
                {/* Subtle Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-batimove-blue/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative p-6 lg:p-7">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-batimove-red" />
                            <span className="text-xs font-bold text-batimove-blue uppercase tracking-widest">Devis Instantané</span>
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white mb-1">
                            Calculateur de Prix
                        </h3>
                        <p className="text-slate-400 text-xs">
                            Estimation en temps réel
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* From */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                <MapPin className="w-3.5 h-3.5 text-batimove-blue" />
                                Point de départ
                            </label>
                            <select
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-batimove-blue focus:border-transparent transition-all hover:bg-slate-800/70"
                            >
                                {cities.map(city => (
                                    <option key={city} value={city} className="bg-slate-900 text-white">
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* To */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                <MapPin className="w-3.5 h-3.5 text-batimove-red" />
                                Destination
                            </label>
                            <select
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-batimove-red focus:border-transparent transition-all hover:bg-slate-800/70"
                            >
                                {cities.map(city => (
                                    <option key={city} value={city} className="bg-slate-900 text-white">
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Property Type */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                <Home className="w-3.5 h-3.5 text-slate-400" />
                                Type de logement
                            </label>
                            <select
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-batimove-blue focus:border-transparent transition-all hover:bg-slate-800/70"
                            >
                                {propertyTypes.map(type => (
                                    <option key={type.value} value={type.value} className="bg-slate-900 text-white">
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Volume Display */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                <Package className="w-3.5 h-3.5 text-slate-400" />
                                Volume estimé
                            </label>
                            <div className="bg-slate-800/30 border border-slate-600/30 rounded-lg px-3 py-2 text-white font-mono text-sm">
                                ~{volume}m³
                            </div>
                        </div>

                        {/* Price Estimate */}
                        <motion.div
                            animate={isCalculating ? { scale: [1, 1.02, 1] } : {}}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-br from-batimove-blue/10 to-batimove-red/10 border border-batimove-blue/30 rounded-xl p-4 backdrop-blur-sm"
                        >
                            <div className="text-center">
                                <p className="text-batimove-blue text-xs font-semibold mb-1">Estimation</p>
                                <p className="text-white font-display text-3xl font-bold mb-1">
                                    CHF {min.toLocaleString()} - {max.toLocaleString()}
                                </p>
                                <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Devis détaillé gratuit
                                </p>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isCalculating}
                            className="w-full bg-batimove-red hover:bg-[#c00500] text-white rounded-lg py-3 font-bold text-base shadow-lg shadow-batimove-red/30 transition-all hover:shadow-xl hover:shadow-batimove-red/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
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
                        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-1">
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
