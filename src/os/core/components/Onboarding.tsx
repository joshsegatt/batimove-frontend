import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, Truck, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

const STEPS = [
  {
    id: 1,
    title: 'Bienvenue sur Batimove OS',
    description: 'Votre nouveau centre de commandement ultra-rapide. Pensé pour les opérations et les finances de haut niveau.',
    icon: <Shield className="w-10 h-10 text-white" />,
    color: 'bg-black'
  },
  {
    id: 2,
    title: 'Contrôle Financier Total',
    description: 'Une vue en temps réel de votre trésorerie, de la facturation et du pipeline de devis. Le tout avec une précision absolue.',
    icon: <TrendingUp className="w-10 h-10 text-white" />,
    color: 'bg-blue-600'
  },
  {
    id: 3,
    title: 'Flotte & Opérations',
    description: 'Pilotez vos équipes sur le terrain et la disponibilité de vos véhicules sans friction. Prêt à commencer ?',
    icon: <Truck className="w-10 h-10 text-white" />,
    color: 'bg-emerald-600'
  }
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step === STEPS.length - 1) {
      localStorage.setItem('batimove_os_onboarding_done', 'true');
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      <div className="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12">
        
        {/* Background gradient blur */}
        <div className="absolute inset-0 bg-gray-50/50" />
        <div className={cn(
          "absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-96 sm:h-96 rounded-full blur-[100px] opacity-20 transition-colors duration-700",
          STEPS[step].color
        )} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center text-center max-w-sm w-full"
          >
            <div className={cn(
              "w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-black/10",
              STEPS[step].color
            )}>
              {STEPS[step].icon}
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 mb-4">
              {STEPS[step].title}
            </h1>
            
            <p className="text-gray-500 text-[15px] sm:text-base leading-relaxed font-medium">
              {STEPS[step].description}
            </p>
          </motion.div>
        </AnimatePresence>

      </div>

      <div className="p-6 sm:p-10 flex flex-col items-center gap-6 bg-white z-10">
        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i === step ? "bg-gray-900 w-6" : "bg-gray-200"
              )} 
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          className="w-full max-w-sm h-14 rounded-2xl bg-gray-900 text-white font-semibold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-xl shadow-gray-900/10"
        >
          {step === STEPS.length - 1 ? 'Démarrer' : 'Suivant'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
