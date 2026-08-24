import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './UIComponents';
import { updateGoogleConsent } from '../utils/analytics';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('batimove_cookie_consent');
    if (!consent) {
      // Delay slightly for better UX so it doesn't pop up immediately on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('batimove_cookie_consent', 'true');
    updateGoogleConsent(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 w-full z-[60] p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-[#0B1E33]/95 backdrop-blur-xl text-white rounded-3xl p-6 shadow-2xl shadow-black/50 border border-white/10 pointer-events-auto flex flex-col md:flex-row items-center gap-6 justify-between relative overflow-hidden">
            
            {/* Subtle Glow Effect behind the cookie */}
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none"></div>

            <div className="flex items-center gap-6 relative z-10">
              {/* 3D Icon - No Background, Floating */}
              <div className="w-20 h-20 flex-shrink-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                 <img 
                    src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Cookie.png" 
                    alt="Privacy Cookie" 
                    className="w-full h-full object-contain animate-[float_6s_ease-in-out_infinite]"
                 />
              </div>

              <div className="text-center md:text-left">
                <h4 className="font-display font-bold text-lg mb-1 tracking-tight">Confidentialité & Sauvegarde</h4>
                <p className="text-slate-300 text-sm leading-relaxed max-w-lg font-medium">
                  Nous utilisons le stockage local pour sauvegarder automatiquement votre devis en temps réel. 
                  <span className="text-slate-400"> Vos données restent sur votre appareil.</span>
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto relative z-10">
              <Button 
                onClick={handleAccept}
                className="w-full md:w-auto bg-batimove-red hover:bg-[#c00500] text-white shadow-lg shadow-red-900/40 border-none font-bold py-4 px-8 rounded-xl font-display tracking-wide transition-transform hover:-translate-y-0.5"
              >
                Accepter & Continuer
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};