import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Home, MapPin, Package, ArrowLeft, Building2, Building, Box } from 'lucide-react';
import { Button } from './UIComponents';
import { Link } from 'react-router-dom';

interface HeroQuoteCardProps {
    className?: string;
}

const propertyTypes = [
    { value: 'studio', label: 'Studio', volume: 15, multiplier: 1, icon: Box },
    { value: '2p', label: '2 pièces', volume: 25, multiplier: 1.2, icon: Home },
    { value: '3p', label: '3 pièces', volume: 35, multiplier: 1.5, icon: Building },
    { value: '4p', label: '4 pièces', volume: 50, multiplier: 2, icon: Building },
    { value: '5p', label: '5+ pièces', volume: 70, multiplier: 2.5, icon: Building2 },
    { value: 'villa', label: 'Villa', volume: 100, multiplier: 3, icon: Home }
];

const cities = [
    'Genève', 'Lausanne', 'Zurich', 'Vaud', 'Neuchâtel', 'Fribourg', 'Montreux', 'Nyon'
];

export const HeroQuoteCard: React.FC<HeroQuoteCardProps> = ({ className = '' }) => {
    const [step, setStep] = useState(1);
    const [from, setFrom] = useState('Genève');
    const [to, setTo] = useState('Lausanne');
    const [propertyType, setPropertyType] = useState('');
    
    // Animation for calculating state
    const [isCalculating, setIsCalculating] = useState(false);

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

    const handlePropertySelect = (val: string) => {
        setPropertyType(val);
        setStep(2);
    };

    const handleCalculate = () => {
        setIsCalculating(true);
        setStep(3);
        // Simulate calculation delay for effect
        setTimeout(() => {
            setIsCalculating(false);
        }, 800);
    };

    const { min, max, volume } = calculatePrice();

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
            filter: "blur(4px)"
        }),
        center: {
            x: 0,
            opacity: 1,
            filter: "blur(0px)"
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
            filter: "blur(4px)"
        })
    };

    // Determine direction based on previous/next step theoretically
    // We'll just default to forward flow for simplicity, or 1 for forward, -1 for back
    const direction = 1;

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
                className="relative bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.01] h-[520px] xl:h-[540px] flex flex-col"
                style={{ willChange: 'transform' }}
            >
                {/* Subtle Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-batimove-blue/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative p-5 flex flex-col h-full">
                    {/* Header & Progress */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-batimove-red" />
                                <span className="text-[10px] font-bold text-batimove-blue uppercase tracking-widest">
                                    Devis Instantané
                                </span>
                            </div>
                            <div className="text-[10px] font-mono text-slate-400">
                                Étape {step}/3
                            </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-3">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-batimove-blue to-batimove-red"
                                initial={{ width: "33%" }}
                                animate={{ width: `${(step / 3) * 100}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <AnimatePresence mode="wait" custom={direction}>
                            {/* =========================================
                                STEP 1: PROPERTY TYPE
                                ========================================= */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex flex-col"
                                >
                                    <h3 className="font-display text-xl font-bold text-white mb-1">
                                        Quel est votre logement ?
                                    </h3>
                                    <p className="text-slate-400 text-xs mb-4">Sélectionnez pour estimer le volume</p>
                                    
                                    <div className="grid grid-cols-2 gap-3 flex-1 pb-4">
                                        {propertyTypes.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.value}
                                                    onClick={() => handlePropertySelect(type.value)}
                                                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-700/50 hover:border-batimove-blue hover:bg-batimove-blue/10 bg-slate-800/40 transition-all group"
                                                >
                                                    <Icon className="w-6 h-6 text-slate-400 group-hover:text-batimove-blue mb-2 transition-colors" />
                                                    <span className="text-white text-sm font-semibold">{type.label}</span>
                                                    <span className="text-slate-500 text-[10px]">~{type.volume}m³</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* =========================================
                                STEP 2: ROUTE (TRAJET)
                                ========================================= */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex flex-col"
                                >
                                    <button 
                                        onClick={() => setStep(1)}
                                        className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors mb-3 w-fit"
                                    >
                                        <ArrowLeft className="w-3 h-3" /> Retour
                                    </button>

                                    <h3 className="font-display text-xl font-bold text-white mb-1">
                                        Quel est le trajet ?
                                    </h3>
                                    <p className="text-slate-400 text-xs mb-6">De ville à ville</p>
                                    
                                    <div className="space-y-5 flex-1">
                                        {/* From */}
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                                                <MapPin className="w-4 h-4 text-batimove-blue" />
                                                Point de départ
                                            </label>
                                            <select
                                                value={from}
                                                onChange={(e) => setFrom(e.target.value)}
                                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-batimove-blue focus:border-transparent transition-colors duration-200"
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
                                            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                                                <MapPin className="w-4 h-4 text-batimove-red" />
                                                Destination
                                            </label>
                                            <select
                                                value={to}
                                                onChange={(e) => setTo(e.target.value)}
                                                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-batimove-red focus:border-transparent transition-colors duration-200"
                                            >
                                                {cities.map(city => (
                                                    <option key={city} value={city} className="bg-slate-900 text-white">
                                                        {city}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={handleCalculate}
                                        className="w-full bg-batimove-blue hover:bg-[#002f5e] text-white rounded-xl py-3.5 font-bold text-sm shadow-lg shadow-batimove-blue/30 transition-all mt-auto"
                                    >
                                        Calculer mon devis
                                    </Button>
                                </motion.div>
                            )}

                            {/* =========================================
                                STEP 3: RESULT
                                ========================================= */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="absolute inset-0 flex flex-col"
                                >
                                    <button 
                                        onClick={() => setStep(2)}
                                        className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition-colors mb-2 w-fit"
                                    >
                                        <ArrowLeft className="w-3 h-3" /> Modifier le trajet
                                    </button>

                                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                                        {isCalculating ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 border-4 border-slate-700 border-t-batimove-blue rounded-full animate-spin mb-4"></div>
                                                <p className="text-white font-medium animate-pulse">Calcul de l'IA en cours...</p>
                                            </div>
                                        ) : (
                                            <motion.div 
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
                                                className="w-full"
                                            >
                                                <div className="inline-block p-1 bg-green-500/20 rounded-full mb-4">
                                                    <div className="bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                        Succès
                                                    </div>
                                                </div>
                                                <h3 className="font-display text-3xl font-bold text-white mb-2">
                                                    CHF {min.toLocaleString()} - {max.toLocaleString()}
                                                </h3>
                                                <p className="text-slate-400 text-sm mb-6 max-w-[250px] mx-auto">
                                                    Estimation indicative incluant approx. {volume}m³ pour un {(propertyTypes.find(p => p.value === propertyType))?.label}.
                                                </p>

                                                <div className="flex bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 mb-8 max-w-[280px] mx-auto">
                                                    <div className="flex-1 border-r border-slate-700/50">
                                                        <p className="text-[10px] text-slate-500 mb-0.5">Départ</p>
                                                        <p className="text-xs font-semibold text-white">{from}</p>
                                                    </div>
                                                    <div className="flex-1 pl-3">
                                                        <p className="text-[10px] text-slate-500 mb-0.5">Destination</p>
                                                        <p className="text-xs font-semibold text-white">{to}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {!isCalculating && (
                                        <Link to="/quote" className="w-full mt-auto block">
                                            <Button
                                                type="button"
                                                className="w-full bg-batimove-red hover:bg-[#c00500] text-white rounded-xl py-3.5 font-bold text-sm shadow-lg shadow-batimove-red/30 transition-all hover:shadow-xl hover:shadow-batimove-red/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                            >
                                                Obtenir mon devis détaillé
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

