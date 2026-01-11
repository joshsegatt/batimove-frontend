import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/UIComponents';
import { Check, Star, X, Send } from 'lucide-react';

// Data for the 4 Cards with 3D Icons
image: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gem%20Stone.png",
  price: "Sur Devis",
    description: "Pour les villas d'exception, les œuvres d'art, les pianos ou les déménagements internationaux.",
      features: [
        "Visite technique offerte",
        "Logistique Internationale",
        "Objets lourds / Coffres",
        "Solution 100% Flexible"
      ],
        cta: "Contacter l'Expert",
          highlight: false,
            action: "modal", // Triggers the window
              specialStyle: true
  }
];

export const Pricing: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      // Optional: Add a toast notification here
    }, 1500);
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-950 overflow-hidden flex flex-col font-sans text-slate-900">

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1E33] via-[#0d223c] to-slate-950 z-0"></div>

      {/* Dynamic Glows */}
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Navbar Spacer */}
      <div className="h-20 w-full flex-shrink-0"></div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-[1600px] mx-auto px-6 min-h-0">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-6 md:mb-10 pt-4 md:pt-0 flex-shrink-0"
        >
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Investissez dans <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">votre sérénité.</span>
          </h1>
          <p className="font-sans text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Des solutions adaptées à chaque étape de votre vie. Transparence suisse garantie.
          </p>
        </motion.div>

        {/* Cards Grid - 4 Columns on XL screens */}
        <div className="w-full flex-1 min-h-0 flex items-center justify-center pb-8 md:pb-12">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 overflow-y-auto md:overflow-visible px-2 md:px-0 py-4 snap-x snap-mandatory scrollbar-hide h-full md:h-auto items-stretch">

            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, type: "spring", stiffness: 50 }}
                className={`relative flex flex-col group rounded-[2rem] border transition-all duration-500 snap-center min-w-[280px] md:min-w-0 ${plan.highlight
                    ? 'bg-gradient-to-b from-white/10 to-white/5 border-white/20 shadow-[0_20px_60px_-15px_rgba(0,82,163,0.3)] z-10 scale-[1.02]'
                    : plan.specialStyle
                      ? 'bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-blue-400/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)] hover:border-blue-400/40'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] z-0'
                  }`}
              >
                {/* Highlight Badge */}
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-batimove-red to-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1 z-20 font-display">
                    <Star className="w-3 h-3 fill-current" />
                    Recommandé
                  </div>
                )}

                <div className="p-6 lg:p-8 flex flex-col h-full backdrop-blur-md rounded-[2rem]">
                  {/* Header */}
                  <div className="mb-6 relative">
                    {/* 3D Icon Container - Floating Effect */}
                    <div className="w-20 h-20 -ml-2 mb-2 flex items-center justify-center relative z-10 filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform duration-300">
                      <img
                        src={plan.image}
                        alt={plan.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <h3 className="font-display text-2xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className={`text-xs uppercase tracking-widest font-bold ${plan.specialStyle ? 'text-indigo-300' : 'text-blue-200/60'}`}>{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <p className="font-display text-3xl font-medium text-white tracking-tight">{plan.price}</p>
                    <p className="font-sans text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed opacity-90">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-green-400' : plan.specialStyle ? 'text-indigo-400' : 'text-slate-500'}`} />
                        <span className={`${plan.highlight ? 'text-white' : 'text-slate-200'} font-medium`}>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA - Logic for Link vs Modal */}
                  <div className="mt-auto">
                    {plan.action === 'modal' ? (
                      <Button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full rounded-xl py-4 text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-1 font-display"
                      >
                        {plan.cta}
                      </Button>
                    ) : (
                      <Link to="/quote">
                        <Button
                          className={`w-full rounded-xl py-4 text-sm font-bold uppercase tracking-widest transition-all font-display ${plan.highlight
                              ? 'bg-batimove-red text-white hover:bg-[#c00500] shadow-[0_8px_30px_-5px_rgba(225,6,0,0.5)] hover:shadow-[0_10px_40px_-5px_rgba(225,6,0,0.7)] transform hover:-translate-y-1'
                              : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/30'
                            }`}
                        >
                          {plan.cta}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </div>

      {/* =========================================================================
          THE MODAL WINDOW (Personalized Offer)
          ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0B1E33] border border-white/10 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col md:flex-row"
            >
              {/* Decorative Side (Hidden on Mobile) */}
              <div className="hidden md:flex w-1/3 bg-slate-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 text-center p-6">
                  {/* 3D Icon for Modal */}
                  <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(99,102,241,0.4)] animate-[float_4s_ease-in-out_infinite]">
                    <img
                      src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gem%20Stone.png"
                      alt="Gem Stone"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2 font-display">Service VIP</h3>
                  <p className="text-blue-200/60 text-sm">Un coordinateur dédié prendra contact avec vous sous 2h.</p>
                </div>
              </div>

              {/* Form Side */}
              <div className="w-full md:w-2/3 p-8 bg-[#0B1E33]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white font-display">Offre Sur Mesure</h2>
                    <p className="text-slate-400 text-sm">Dites-nous en plus sur votre projet d'exception.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Prénom</label>
                      <input required type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="Jean" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Nom</label>
                      <input type="text" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="Dupont" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Téléphone</label>
                    <input required type="tel" className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="+41 79 000 00 00" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Détails du projet</label>
                    <textarea required rows={3} className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none" placeholder="Ex: Déménagement international, objets d'art, villa 10 pièces..."></textarea>
                  </div>

                  <div className="pt-4">
                    <Button disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-4 font-bold shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 font-display">
                      {isSubmitting ? 'Envoi...' : <><Send className="w-4 h-4" /> Envoyer la demande</>}
                    </Button>
                    <p className="text-center text-[10px] text-slate-500 mt-3 flex items-center justify-center gap-1">
                      <Check className="w-3 h-3 text-green-500" /> Vos données sont cryptées et sécurisées.
                    </p>
                  </div>
                </form>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};