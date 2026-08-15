import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';

const WhatsappIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.926 0-3.71-.51-5.263-1.4l-.377-.216-3.911 1.026 1.044-3.812-.243-.387a9.774 9.774 0 0 1-1.503-5.247c0-5.407 4.399-9.807 9.807-9.807 2.62 0 5.084 1.021 6.938 2.875a9.75 9.75 0 0 1 2.868 6.932c.001 5.408-4.398 9.808-9.807 9.808m0-17.807c-4.41 0-8.007 3.597-8.007 8.007 0 1.502.417 2.909 1.144 4.116l-.751 2.743 2.809-.736c1.168.636 2.502.983 3.805.983 4.41 0 8.007-3.597 8.007-8.007 0-2.136-.831-4.144-2.343-5.656S16.46 4.036 14.051 4.036z"/>
    </svg>
);

export const WhatsAppButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const whatsappUrl = "https://wa.me/41800825925?text=" + encodeURIComponent("Bonjour Batimove, je souhaite obtenir un devis rapide pour mon déménagement.");

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Popover Card */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto mb-4 w-80 bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-5 text-white overflow-hidden"
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="relative">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute inset-0 opacity-75"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold font-display text-white">Support Client Batimove</h4>
                                    <p className="text-[11px] text-slate-400">Réponse moyenne &lt; 5 min</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mb-4">
                            Bonjour ! Une question sur votre déménagement ou besoin d'un prix immédiat à Genève ?
                        </p>

                        <div className="space-y-2">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-lg shadow-green-500/20"
                            >
                                <WhatsappIcon className="w-4 h-4 text-white" />
                                <span>Discuter sur WhatsApp</span>
                            </a>

                            <a
                                href="tel:0800825925"
                                className="flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-2.5 px-4 rounded-xl border border-white/10 transition-all"
                            >
                                <Phone className="w-3.5 h-3.5 text-blue-400" />
                                <span>Appel Gratuit : 0800 825 925</span>
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Floating Trigger Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto relative group flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_25px_rgba(37,211,102,0.4)] transition-all hover:shadow-[0_15px_30px_rgba(37,211,102,0.6)]"
            >
                {/* Ring pulse animation */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-35 pointer-events-none"></span>

                {isOpen ? (
                    <X className="w-6 h-6 text-white relative z-10" />
                ) : (
                    <WhatsappIcon className="w-7 h-7 text-white relative z-10" />
                )}
            </motion.button>
        </div>
    );
};
