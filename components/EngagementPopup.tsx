import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Instagram, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PopupState {
    isVisible: boolean;
    hasBeenShown: boolean;
}

export const EngagementPopup: React.FC = () => {
    const [state, setState] = useState<PopupState>({
        isVisible: false,
        hasBeenShown: false
    });
    const [scrollProgress, setScrollProgress] = useState(0);

    // Check if popup should be shown
    const shouldShowPopup = (): boolean => {
        // Don't show if user opted out
        if (localStorage.getItem('batimove_popup_dont_show') === 'true') {
            return false;
        }

        // Don't show if shown in last 24 hours
        const lastShown = localStorage.getItem('batimove_popup_last_shown');
        if (lastShown) {
            const hoursSinceLastShown = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60);
            if (hoursSinceLastShown < 24) {
                return false;
            }
        }

        // Don't show on quote page (don't interrupt conversion flow)
        if (window.location.pathname.includes('/quote')) {
            return false;
        }

        return true;
    };

    // Track scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Show popup after 45 seconds OR 50% scroll
    useEffect(() => {
        if (state.hasBeenShown || !shouldShowPopup()) return;

        // Timer: Show after 45 seconds
        const timer = setTimeout(() => {
            if (!state.hasBeenShown) {
                showPopup();
            }
        }, 45000);

        // Scroll trigger: Show at 50% scroll
        if (scrollProgress >= 50 && !state.hasBeenShown) {
            showPopup();
        }

        return () => clearTimeout(timer);
    }, [scrollProgress, state.hasBeenShown]);

    // Exit intent detection
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !state.hasBeenShown && shouldShowPopup()) {
                showPopup();
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [state.hasBeenShown]);

    const showPopup = () => {
        setState({ isVisible: true, hasBeenShown: true });
        localStorage.setItem('batimove_popup_last_shown', Date.now().toString());
    };

    const closePopup = () => {
        setState(prev => ({ ...prev, isVisible: false }));
    };

    const handleDontShowAgain = () => {
        localStorage.setItem('batimove_popup_dont_show', 'true');
        closePopup();
    };

    // Keyboard accessibility
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && state.isVisible) {
                closePopup();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [state.isVisible]);

    return (
        <AnimatePresence>
            {state.isVisible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePopup}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
                        aria-hidden="true"
                    />

                    {/* Popup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-8 right-8 z-[9999] max-w-sm w-full mx-4 md:mx-0"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="popup-title"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/20 border-2 border-batimove-blue/20 overflow-hidden">
                            {/* Close Button */}
                            <button
                                onClick={closePopup}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors z-10"
                                aria-label="Fermer"
                            >
                                <X className="w-4 h-4 text-slate-600" />
                            </button>

                            {/* Avatar Section */}
                            <div className="relative bg-gradient-to-br from-batimove-blue to-blue-600 p-8 pb-4">
                                <motion.div
                                    animate={{
                                        y: [0, -8, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                    className="w-32 h-32 mx-auto mb-4"
                                >
                                    <img
                                        src="/batimove-avatar.png"
                                        alt="Batimove Assistant"
                                        className="w-full h-full object-contain drop-shadow-2xl"
                                    />
                                </motion.div>
                            </div>

                            {/* Content */}
                            <div className="p-6 pt-4">
                                <h3 id="popup-title" className="text-2xl font-bold text-slate-900 mb-2 font-display text-center">
                                    Olá! 👋
                                </h3>
                                <p className="text-slate-600 text-center mb-6 font-medium leading-relaxed">
                                    Precisa de um orçamento ou quer ficar por dentro das novidades?
                                </p>

                                {/* CTAs */}
                                <div className="space-y-3">
                                    {/* Primary CTA - Quote */}
                                    <Link
                                        to="/quote"
                                        onClick={closePopup}
                                        className="block w-full bg-batimove-red hover:bg-[#c00500] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-batimove-red/30 hover:shadow-xl hover:shadow-batimove-red/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 font-display"
                                    >
                                        <FileText className="w-5 h-5" />
                                        Fazer Orçamento Grátis
                                    </Link>

                                    {/* Secondary CTA - Instagram */}
                                    <a
                                        href="https://www.instagram.com/batimove.sarl/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={closePopup}
                                        className="block w-full border-2 border-batimove-blue text-batimove-blue hover:bg-batimove-blue hover:text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-display"
                                    >
                                        <Instagram className="w-5 h-5" />
                                        Seguir no Instagram
                                    </a>
                                </div>

                                {/* Don't show again */}
                                <button
                                    onClick={handleDontShowAgain}
                                    className="w-full text-xs text-slate-400 hover:text-slate-600 mt-4 transition-colors"
                                >
                                    Não mostrar novamente
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
