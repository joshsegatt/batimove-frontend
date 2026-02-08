import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './UIComponents';
import { Link } from 'react-router-dom';

interface HeroQuoteCardProps {
    className?: string;
}

export const HeroQuoteCard: React.FC<HeroQuoteCardProps> = ({ className = '' }) => {
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

                    {/* Simplified Info Display */}
                    <div className="space-y-3 mb-4">
                        <div className="bg-slate-800/30 border border-slate-600/30 rounded-lg px-3 py-2">
                            <p className="text-slate-400 text-xs mb-1">Déménagement Standard</p>
                            <p className="text-white font-mono text-sm">Genève → Lausanne</p>
                        </div>

                        <div className="bg-slate-800/30 border border-slate-600/30 rounded-lg px-3 py-2">
                            <p className="text-slate-400 text-xs mb-1">Appartement 3 pièces</p>
                            <p className="text-white font-mono text-sm">~35m³</p>
                        </div>
                    </div>

                    {/* Price Estimate */}
                    <div className="bg-gradient-to-br from-batimove-blue/10 to-batimove-red/10 border border-batimove-blue/30 rounded-xl p-3 backdrop-blur-sm mb-4">
                        <div className="text-center">
                            <p className="text-batimove-blue text-xs font-semibold mb-1">Estimation</p>
                            <p className="text-white font-display text-2xl font-bold mb-1">
                                CHF 1.500 - 2.100
                            </p>
                            <p className="text-slate-400 text-xs flex items-center justify-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Prix indicatif
                            </p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Link to="/quote" className="w-full">
                        <Button
                            type="button"
                            className="w-full bg-batimove-red hover:bg-[#c00500] text-white rounded-lg py-3 font-bold text-sm shadow-lg shadow-batimove-red/30 transition-all hover:shadow-xl hover:shadow-batimove-red/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            Obtenir mon devis
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};
