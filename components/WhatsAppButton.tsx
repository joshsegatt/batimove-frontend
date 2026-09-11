import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, ShieldCheck } from 'lucide-react';

export const WhatsappIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 2c-5.508 0-9.985 4.477-9.985 9.985 0 1.761.459 3.477 1.332 4.992L2 22l5.16-1.354c1.465.799 3.119 1.223 4.871 1.223 5.508 0 9.985-4.477 9.985-9.985S17.539 2 12.031 2zm5.836 14.186c-.244.686-1.423 1.309-1.97 1.393-.524.08-1.207.114-1.956-.124-.48-.152-1.099-.356-1.895-.7-3.332-1.442-5.5-4.819-5.666-5.041-.166-.222-1.353-1.8-1.353-3.433s.853-2.437 1.156-2.769c.303-.332.66-.415.88-.415.22 0 .44.002.633.012.203.01.475-.077.744.569.278.666.948 2.31.948 2.31s.087.178.02.378c-.068.2-.102.324-.204.444-.102.12-.214.268-.306.36-.102.102-.208.213-.09.415.118.202.524.864 1.124 1.398.772.688 1.422.9 1.624.99.202.09.32.078.438-.058.118-.136.507-.589.642-.791.135-.202.27-.168.455-.101.185.067 1.173.553 1.375.654.202.101.337.152.388.236.051.084.051.49-.193 1.176z"/>
    </svg>
);

export const WhatsAppButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const whatsappUrl = "https://wa.me/41800825925?text=" + encodeURIComponent("Bonjour Batimove, je souhaite obtenir un devis rapide pour mon déménagement.");

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Popover Card - High-End Swiss Luxury White / Porcelain */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.96 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="pointer-events-auto mb-3.5 w-[330px] bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-[0_20px_45px_-10px_rgba(11,30,51,0.18),0_2px_6px_rgba(0,0,0,0.04)] p-4 sm:p-5 text-slate-900 overflow-hidden font-sans"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3.5">
                            <div className="flex items-center gap-2.5">
                                <div className="relative w-10 h-10 shrink-0">
                                    <img 
                                        src="/whatsapp-3d-luxury.png" 
                                        alt="WhatsApp 3D" 
                                        className="w-full h-full object-contain filter drop-shadow-xs"
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs sm:text-sm font-bold text-[#0B1E33] leading-tight">
                                        Conseiller Batimove Sàrl
                                    </h4>
                                    <p className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                                        <span>En ligne • Réponse &lt; 5 min</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                                aria-label="Fermer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Conversational Bubble */}
                        <div className="bg-[#F8FAFC] border border-slate-200/70 p-3 rounded-xl rounded-tl-xs mb-4 text-xs text-slate-700 leading-relaxed shadow-2xs">
                            <p>
                                Bonjour ! Une question sur votre déménagement ou besoin d'un devis immédiat à Genève et Suisse Romande ?
                            </p>
                            <span className="block text-[10px] text-slate-400 text-right mt-1.5 font-medium">
                                Maintenant
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2.5 w-full bg-gradient-to-r from-[#128C7E] to-[#0E7A6E] hover:from-[#0f776a] hover:to-[#0a6359] text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-[0_6px_18px_-4px_rgba(18,140,126,0.35)] cursor-pointer"
                            >
                                <img src="/whatsapp-3d-luxury.png" alt="" className="w-4 h-4 object-contain" />
                                <span>Discuter sur WhatsApp</span>
                            </a>

                            <a
                                href="tel:0800825925"
                                className="flex items-center justify-center gap-2 w-full bg-slate-100/90 hover:bg-slate-200 text-[#0B1E33] font-semibold text-xs py-2.5 px-4 rounded-xl border border-slate-200/80 transition-all cursor-pointer"
                            >
                                <Phone className="w-3.5 h-3.5 text-sky-600" />
                                <span>Appel Gratuit : 0800 825 925</span>
                            </a>
                        </div>

                        {/* Swiss Trust Footnote */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Service officiel Batimove • Confidentialité assurée</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Button with Discrete Hover Tooltip */}
            <div className="pointer-events-auto flex items-center gap-2.5">
                {/* Desktop Hover Pill Badge */}
                <AnimatePresence>
                    {!isOpen && isHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.18 }}
                            className="hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3 py-1.5 rounded-full shadow-[0_4px_16px_rgba(11,30,51,0.08)] text-xs font-semibold text-slate-800"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>WhatsApp disponible</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* 3D Luxury WhatsApp Floating Trigger */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className="relative flex items-center justify-center w-[56px] h-[56px] sm:w-[60px] sm:h-[60px] transition-transform duration-200 cursor-pointer focus:outline-none select-none"
                    aria-label="Contacter par WhatsApp"
                >
                    {/* Discrete Online Indicator Badge */}
                    {!isOpen && (
                        <span className="absolute top-0 right-0 z-20 flex h-3.5 w-3.5 items-center justify-center pointer-events-none">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white shadow-xs" />
                        </span>
                    )}

                    {isOpen ? (
                        <div className="w-[50px] h-[50px] rounded-full bg-[#0B1E33] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(11,30,51,0.25)] ring-4 ring-[#0B1E33]/10">
                            <X className="w-5 h-5 text-white" />
                        </div>
                    ) : (
                        <div className="w-full h-full relative flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(11,30,51,0.18)] hover:drop-shadow-[0_14px_28px_rgba(14,122,110,0.35)] transition-all duration-300">
                            <img
                                src="/whatsapp-3d-luxury.png"
                                alt="WhatsApp 3D"
                                className="w-full h-full object-contain pointer-events-none select-none"
                            />
                        </div>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

