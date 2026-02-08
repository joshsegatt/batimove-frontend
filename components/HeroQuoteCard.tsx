import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Home, MapPin, Package } from 'lucide-react';
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
    'Genève', 'Lausanne', 'Zurich', 'Vaud', 'Neuchâtel', 'Fribourg', 'Montreux', 'Nyon'
];

export const HeroQuoteCard: React.FC<HeroQuoteCardProps> = ({ className = '' }) => {
    const [from, setFrom] = useState('Genève');
    const [to, setTo] = useState('Lausanne');
    const [propertyType, setPropertyType] = useState('3p');

    const calculatePrice = () => {
        const basePrice = 500;
        const property = propertyTypes.find(p => p.value === propertyType);
        const distancePrice = from !== to ? 200 : 0;
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
            {/* 3D Card with Site Colors - FIXED HEIGHT */}
            <div
                className="relative bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.01] h-[580px] xl:h-[600px] 2xl:h-[620px] flex flex-col"
                style={{ willChange: 'transform' }}
            >
                {/* Subtle Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-batimove-blue/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative p-6 flex flex-col justify-between h-full">
                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-batimove-red" />
                            <span className="text-xs font-bold text-batimove-blue uppercase tracking-widest">Devis Instantané</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-white mb-1">
                            Calculateur de Prix
                        </h3>
                        <p className="text-slate-400 text-xs">
                            Estimation en temps réel
                        </p>
                    </div>

                    {/* Interactive Fields */}
                    <div className="space-y-3 mb-4 flex-1">
                        {/* From */}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                                <MapPin className="w-3.5 h-3.5 text-batimove-blue" />
                                Point de départ
                            </label>
                            <select
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-batimove-blue focus:border-transparent transition-colors duration-200"
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
                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-batimove-red focus:border-transparent transition-colors duration-200"
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
                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-batimove-blue focus:border-transparent transition-colors duration-200"
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
                    </div>

                    {/* Price Estimate */}
                    <motion.div
                        key={`${from}-${to}-${propertyType}`}
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-br from-batimove-blue/10 to-batimove-red/10 border border-batimove-blue/30 rounded-xl p-3 backdrop-blur-sm mb-4"
                    >
                        <div className="text-center">
                            <p className="text-batimove-blue text-xs font-semibold mb-1">Estimation</p>
                            <p className="text-white font-display text-2xl font-bold mb-1">
                                CHF {min.toLocaleString()} - {max.toLocaleString()}
                            </p>
                            <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Devis détaillé gratuit
                            </p>
                        </div>
                    </motion.div>

                    {/* CTA Button */}
                    <Link to="/quote" className="w-full">
                        <Button
                            type="button"
                            className="w-full bg-batimove-red hover:bg-[#c00500] text-white rounded-lg py-3 font-bold text-sm shadow-lg shadow-batimove-red/30 transition-all hover:shadow-xl hover:shadow-batimove-red/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            Obtenir mon devis détaillé
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};
