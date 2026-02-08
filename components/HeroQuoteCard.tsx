import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Home, MapPin } from 'lucide-react';
import { Button } from './UIComponents';
import { Link } from 'react-router-dom';

interface HeroQuoteCardProps {
    className?: string;
}

const propertyTypes = [
    { value: 'studio', label: 'Studio', volume: 15, multiplier: 1 },
    { value: '2p', label: '2 pièces', volume: 25, multiplier: 1.2 },
    { value: '3p', label: '3 pièces', volume: 35, multiplier: 1.5 },
    { value: '4p', label: '4 pièces', volume: 50, multiplier: 2 },
    { value: '5p', label: '5+ pièces', volume: 70, multiplier: 2.5 },
    { value: 'villa', label: 'Villa', volume: 100, multiplier: 3 }
];

const cities = [
    'Genève', 'Lausanne', 'Zurich', 'Vaud', 'Neuchâtel', 'Fribourg'
];

export const HeroQuoteCard: React.FC<HeroQuoteCardProps> = ({ className = '' }) => {
    const [propertyType, setPropertyType] = useState('3p');
    const [city, setCity] = useState('Lausanne');

    const calculatePrice = () => {
        const basePrice = 500;
        const property = propertyTypes.find(p => p.value === propertyType);
        const distancePrice = 200;
        const volumePrice = (property?.volume || 30) * 15;
        const total = (basePrice + distancePrice + volumePrice) * (property?.multiplier || 1);

        const min = Math.floor(total * 0.85);
        const max = Math.floor(total * 1.15);

        return { min, max, volume: property?.volume || 30 };
    };

    const { min, max, volume } = calculatePrice();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className={`relative ${className}`}
            style={{ willChange: 'transform, opacity' }}
        >
            {/* 3D Card with Site Colors - SQUARE FORMAT */}
            <div
                className="relative bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.02] aspect-square flex flex-col"
                style={{ willChange: 'transform' }}
            >
                {/* Subtle Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-batimove-blue/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative p-5 flex flex-col justify-between h-full">
                    {/* Header */}
                    <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-batimove-red" />
                            <span className="text-[10px] font-bold text-batimove-blue uppercase tracking-widest">Devis Instantané</span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-white mb-0.5">
                            Calculateur de Prix
                        </h3>
                        <p className="text-slate-400 text-[10px]">
                            Estimation en temps réel
                        </p>
                    </div>

                    {/* Interactive Fields - COMPACT */}
                    <div className="space-y-2 mb-3">
                        {/* Property Type */}
                        <div className="space-y-1">
                            <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-300">
                                <Home className="w-3 h-3 text-batimove-blue" />
                                Type de logement
                            </label>
                            <select
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-batimove-blue focus:border-transparent transition-colors duration-200"
                            >
                                {propertyTypes.map(type => (
                                    <option key={type.value} value={type.value} className="bg-slate-900 text-white">
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* City */}
                        <div className="space-y-1">
                            <label className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-300">
                                <MapPin className="w-3 h-3 text-batimove-red" />
                                Destination
                            </label>
                            <select
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-batimove-red focus:border-transparent transition-colors duration-200"
                            >
                                {cities.map(c => (
                                    <option key={c} value={c} className="bg-slate-900 text-white">
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Volume Display - COMPACT */}
                    <div className="bg-slate-800/30 border border-slate-600/30 rounded-lg px-2.5 py-1.5 mb-3">
                        <p className="text-slate-400 text-[10px]">Volume estimé</p>
                        <p className="text-white font-mono text-xs">~{volume}m³</p>
                    </div>

                    {/* Price Estimate - COMPACT */}
                    <motion.div
                        key={`${propertyType}-${city}`}
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-batimove-blue/10 to-batimove-red/10 border border-batimove-blue/30 rounded-xl p-2.5 backdrop-blur-sm mb-3"
                    >
                        <div className="text-center">
                            <p className="text-batimove-blue text-[10px] font-semibold mb-0.5">Estimation</p>
                            <p className="text-white font-display text-xl font-bold mb-0.5">
                                CHF {min.toLocaleString()} - {max.toLocaleString()}
                            </p>
                            <p className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
                                <Sparkles className="w-2.5 h-2.5" />
                                Prix indicatif
                            </p>
                        </div>
                    </motion.div>

                    {/* CTA Button - COMPACT */}
                    <Link to="/quote" className="w-full">
                        <Button
                            type="button"
                            className="w-full bg-batimove-red hover:bg-[#c00500] text-white rounded-lg py-2.5 font-bold text-xs shadow-lg shadow-batimove-red/30 transition-all hover:shadow-xl hover:shadow-batimove-red/40 hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                        >
                            Obtenir mon devis
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};
