import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from './UIComponents';
import { Link } from 'react-router-dom';

interface HeroQuoteCardProps {
    className?: string;
}

// 1. Studio 3D Isometric Cube
const StudioIcon3D = ({ className = "w-7 h-7" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="cubeTop" x1="16" y1="4" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
            <linearGradient id="cubeLeft" x1="4" y1="10" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1E40AF" />
                <stop offset="1" stopColor="#0B1E33" />
            </linearGradient>
            <linearGradient id="cubeRight" x1="16" y1="16" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#1D4ED8" />
            </linearGradient>
        </defs>
        <path d="M16 4L28 10V16L16 10L4 16V10L16 4Z" fill="url(#cubeTop)" />
        <path d="M4 10L16 16V28L4 22V10Z" fill="url(#cubeLeft)" opacity="0.9" />
        <path d="M16 16L28 10V22L16 28V16Z" fill="url(#cubeRight)" />
        <path d="M16 4L28 10L16 16L4 10L16 4Z" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75" />
    </svg>
);

// 2. 2 Pieces 3D Modern House
const House2PIcon3D = ({ className = "w-7 h-7" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="h2Roof" x1="16" y1="3" x2="16" y2="15" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EF4444" />
                <stop offset="1" stopColor="#B91C1C" />
            </linearGradient>
            <linearGradient id="h2Front" x1="6" y1="14" x2="26" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
        </defs>
        <path d="M16 3L27 12H5L16 3Z" fill="url(#h2Roof)" />
        <path d="M7 12H25V27C25 27.5523 24.5523 28 24 28H8C7.44772 28 7 27.5523 7 27V12Z" fill="url(#h2Front)" />
        <rect x="12" y="18" width="8" height="10" rx="1" fill="#0F172A" opacity="0.8" />
        <rect x="14" y="20" width="4" height="8" rx="0.5" fill="#38BDF8" />
    </svg>
);

// 3. 3 Pieces 3D Residential Building
const Apartment3PIcon3D = ({ className = "w-7 h-7" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ap3Left" x1="5" y1="6" x2="16" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="1" stopColor="#1E3A8A" />
            </linearGradient>
            <linearGradient id="ap3Right" x1="16" y1="6" x2="27" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#93C5FD" />
                <stop offset="1" stopColor="#2563EB" />
            </linearGradient>
        </defs>
        <path d="M16 4L27 8V27L16 29L5 27V8L16 4Z" fill="url(#ap3Left)" />
        <path d="M16 4L27 8V27L16 29V4Z" fill="url(#ap3Right)" />
        <rect x="8" y="10" width="4" height="4" rx="0.5" fill="#F8FAFC" opacity="0.9" />
        <rect x="20" y="10" width="4" height="4" rx="0.5" fill="#F8FAFC" opacity="0.9" />
        <rect x="8" y="16" width="4" height="4" rx="0.5" fill="#F8FAFC" opacity="0.9" />
        <rect x="20" y="16" width="4" height="4" rx="0.5" fill="#F8FAFC" opacity="0.9" />
        <rect x="8" y="22" width="4" height="4" rx="0.5" fill="#F8FAFC" opacity="0.9" />
        <rect x="20" y="22" width="4" height="4" rx="0.5" fill="#F8FAFC" opacity="0.9" />
    </svg>
);

// 4. 4 Pieces 3D Apartment Complex
const Apartment4PIcon3D = ({ className = "w-7 h-7" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ap4Grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="0.5" stopColor="#0284C7" />
                <stop offset="1" stopColor="#0369A1" />
            </linearGradient>
        </defs>
        <rect x="4" y="6" width="24" height="22" rx="2" fill="url(#ap4Grad)" />
        <path d="M4 6L16 2L28 6H4Z" fill="#0284C7" />
        <rect x="7" y="9" width="4" height="4" rx="0.5" fill="#FFFFFF" opacity="0.95" />
        <rect x="14" y="9" width="4" height="4" rx="0.5" fill="#FFFFFF" opacity="0.95" />
        <rect x="21" y="9" width="4" height="4" rx="0.5" fill="#FFFFFF" opacity="0.95" />
        <rect x="7" y="15" width="4" height="4" rx="0.5" fill="#FFFFFF" opacity="0.95" />
        <rect x="14" y="15" width="4" height="4" rx="0.5" fill="#FFFFFF" opacity="0.95" />
        <rect x="21" y="15" width="4" height="4" rx="0.5" fill="#FFFFFF" opacity="0.95" />
        <rect x="7" y="21" width="4" height="4" rx="0.5" fill="#FFFFFF" opacity="0.95" />
        <rect x="14" y="21" width="4" height="4" rx="0.5" fill="#FFFFFF" opacity="0.95" />
        <rect x="21" y="21" width="4" height="4" rx="0.5" fill="#FFFFFF" opacity="0.95" />
    </svg>
);

// 5. 5+ Pieces 3D Glass Tower
const Building5PIcon3D = ({ className = "w-7 h-7" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="b5Grad" x1="16" y1="2" x2="16" y2="29" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818CF8" />
                <stop offset="0.5" stopColor="#4F46E5" />
                <stop offset="1" stopColor="#312E81" />
            </linearGradient>
        </defs>
        <path d="M16 2L26 6V28H6V6L16 2Z" fill="url(#b5Grad)" />
        <path d="M16 2V28" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1="9" y1="10" x2="23" y2="10" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
        <line x1="9" y1="15" x2="23" y2="15" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
        <line x1="9" y1="20" x2="23" y2="20" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
        <line x1="9" y1="25" x2="23" y2="25" stroke="white" strokeOpacity="0.8" strokeWidth="1.5" />
    </svg>
);

// 6. Villa 3D Luxury Mansion
const VillaIcon3D = ({ className = "w-7 h-7" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="vRoof" x1="16" y1="3" x2="16" y2="14" gradientUnits="userSpaceOnUse">
                <stop stopColor="#DC2626" />
                <stop offset="1" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="vBody" x1="3" y1="14" x2="29" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F8FAFC" />
                <stop offset="1" stopColor="#CBD5E1" />
            </linearGradient>
        </defs>
        <path d="M16 3L29 13H3L16 3Z" fill="url(#vRoof)" />
        <rect x="4" y="13" width="24" height="15" rx="1" fill="url(#vBody)" />
        <rect x="7" y="16" width="5" height="5" rx="0.5" fill="#0284C7" />
        <rect x="20" y="16" width="5" height="5" rx="0.5" fill="#0284C7" />
        <rect x="13" y="19" width="6" height="9" fill="#0F172A" />
        <circle cx="17.5" cy="23.5" r="0.75" fill="#F59E0B" />
    </svg>
);

const propertyTypes = [
    { value: 'studio', label: 'Studio', volume: 15, multiplier: 1, icon: StudioIcon3D },
    { value: '2p', label: '2 pièces', volume: 25, multiplier: 1.2, icon: House2PIcon3D },
    { value: '3p', label: '3 pièces', volume: 35, multiplier: 1.5, icon: Apartment3PIcon3D },
    { value: '4p', label: '4 pièces', volume: 50, multiplier: 2, icon: Apartment4PIcon3D },
    { value: '5p', label: '5+ pièces', volume: 70, multiplier: 2.5, icon: Building5PIcon3D },
    { value: 'villa', label: 'Villa', volume: 100, multiplier: 3, icon: VillaIcon3D }
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
                className="relative bg-slate-900/75 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] overflow-hidden transition-transform duration-300 ease-out hover:scale-[1.01] h-[460px] xl:h-[480px] flex flex-col"
                style={{ willChange: 'transform' }}
            >
                {/* Subtle Glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-batimove-blue/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative p-6 flex flex-col h-full">

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
                                                    className="flex flex-col items-center justify-center p-3 rounded-xl border border-white/20 hover:border-batimove-blue hover:bg-batimove-blue/10 bg-slate-800/60 transition-all group"
                                                >
                                                    <Icon className="w-7 h-7 mb-2 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
                                                    <span className="text-white text-sm font-semibold">{type.label}</span>
                                                    <span className="text-slate-300 text-[10px]">~{type.volume}m³</span>
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
                                        className="w-full bg-batimove-blue hover:bg-[#002f5e] text-white rounded-xl py-3.5 font-bold text-sm mt-auto relative"
                                        animate={{ 
                                            boxShadow: [
                                                "0 0 0 0px rgba(34, 211, 238, 0)", 
                                                "0 0 20px 4px rgba(34, 211, 238, 0.4)", 
                                                "0 0 0 0px rgba(34, 211, 238, 0)"
                                            ] 
                                        }}
                                        transition={{ 
                                            repeat: Infinity, 
                                            duration: 2.5, 
                                            ease: "easeInOut" 
                                        }}
                                    >
                                        Calculer mon volume instantanément
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
                                                Réservez votre créneau en 2 min
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

