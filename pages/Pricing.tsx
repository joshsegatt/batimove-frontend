import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/UIComponents';
import { Check, Star, X, Send } from 'lucide-react';

// Data for the 4 Cards with 3D Icons
const plans = [
  {
    id: 'basic',
    name: "Basic",
    tagline: "Essentiel",
    price: "CHF 550",
    description: "Avez-vous juste besoin d'une petite aide ? L'offre basic c'est votre choix !",
    features: [
      "Chargement / Déchargement",
      "Transport",
      "Assurance RC"
    ],
    cta: "Choisir Basic",
    highlight: false,
    action: "link"
  },
  {
    id: 'standard',
    name: "Standard",
    tagline: "Complet",
    price: "CHF 850",
    description: "Le déménagement standard vous donne la tranquillité dont vous avez besoin pour commencer votre nouveau départ.",
    features: [
      "Matériaux d'emballages",
      "Assemblage / Démontage des meubles",
      "Chargement / Déchargement",
      "Transport",
      "Assurance RC"
    ],
    cta: "Choisir Standard",
    highlight: true,
    action: "link"
  },
  {
    id: 'premium',
    name: "Premium",
    tagline: "Tout Inclus",
    price: "CHF 1'500",
    description: "Optez pour l'option premium pour rentrer dans une maison prête à vivre dès le premier jour.",
    features: [
      "Emballage",
      "Matériaux d'emballages",
      "Assemblage / Démontage des meubles",
      "Chargement / Déchargement",
      "Transport",
      "Assurance RC"
    ],
    cta: "Choisir Premium",
    highlight: false,
    action: "link"
  },
  {
    id: 'luxe',
    name: "Luxe",
    tagline: "Excellence",
    price: "CHF 1'700",
    description: "Avec l'offre du déménagement Luxe vous mettez vos affaires entre les mains des spécialistes qui vont s'assurer de tous vos affaires.",
    features: [
      "Déballage",
      "Emballage",
      "Matériaux d'emballage",
      "Assemblage / Démontage des meubles",
      "Chargement / Déchargement",
      "Transport",
      "Assurance RC"
    ],
    cta: "Choisir Luxe",
    highlight: false,
    action: "link"
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
    }, 1500);
  };

  return (
    <div className="flex-1 min-h-[calc(100dvh-98px)] lg:h-[calc(100dvh-98px)] lg:max-h-[calc(100dvh-98px)] bg-gradient-to-b from-[#07182b] via-[#0B1E33] to-[#061424] text-slate-100 flex flex-col justify-between relative overflow-y-auto lg:overflow-hidden font-sans">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Content Container (Centered in Viewport) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 flex-1 flex flex-col justify-center relative z-10 my-auto">

        {/* Compact Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-4 sm:mb-6 flex-shrink-0"
        >
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Investissez dans Votre Sérénité
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mt-1 font-normal leading-relaxed">
            Formules claires, transparentes et adaptées à vos besoins. Aucun frais caché, rigueur suisse garantie.
          </p>
        </motion.div>

        {/* 4 Cards Grid - Perfectly Scaled for Single-Screen Monitor View */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className={`rounded-2xl p-5 lg:p-6 flex flex-col justify-between transition-all duration-300 relative group ${
                plan.highlight
                  ? 'bg-gradient-to-b from-[#0e2744] to-[#081a2e] border-2 border-sky-400/50 shadow-[0_15px_40px_-10px_rgba(2,132,199,0.35)] hover:border-sky-300'
                  : 'bg-[#081a2e]/85 backdrop-blur-xl border border-white/10 hover:border-white/25 shadow-xl hover:bg-[#0a2038]/90'
              }`}
            >
              <div>
                {/* Header: Name + Badge */}
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-display text-lg lg:text-xl font-bold text-white">
                    {plan.name}
                  </h2>
                  {plan.highlight ? (
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Recommandé
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-sky-300/80 uppercase tracking-wider">
                      {plan.tagline}
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="mb-3">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                    À partir de
                  </span>
                  <div className="font-display text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight my-0.5">
                    {plan.price}
                  </div>
                  <span className="text-[10px] text-slate-400 italic block">
                    *Prix indicatif sans engagement
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed mb-3 min-h-[34px] line-clamp-2">
                  {plan.description}
                </p>

                {/* Divider */}
                <div className="border-t border-white/10 mb-3" />

                {/* Included Features List */}
                <ul className="space-y-1.5 mb-5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-sky-400' : 'text-emerald-400'}`} />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-2 mt-auto">
                {plan.action === 'modal' ? (
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-900/30 transition-all font-display border-none flex items-center justify-center gap-1.5"
                  >
                    <span>{plan.cta}</span>
                  </Button>
                ) : (
                  <Link to="/quote" className="block w-full">
                    <Button
                      className={`w-full rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider transition-all font-display flex items-center justify-center gap-1.5 cursor-pointer border-none ${
                        plan.highlight
                          ? 'bg-batimove-red hover:bg-[#c00500] text-white shadow-xl shadow-red-900/35 hover:shadow-red-500/40 hover:scale-[1.01] active:scale-[0.99]'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/15 hover:border-sky-400/40'
                      }`}
                    >
                      <span>{plan.cta}</span>
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Sleek Minimal Bottom Bar (Anchors page cleanly without extra scroll) */}
      <div className="w-full border-t border-white/5 bg-[#05101c]/80 backdrop-blur-md py-2.5 px-4 flex-shrink-0 text-[11px] text-slate-400 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <span className="flex items-center gap-1.5">
            <span className="text-sky-400 font-bold">🇨🇭 Garantie Régies :</span>
            <span>Toutes les formules incluent l'assurance responsabilité civile 5M CHF.</span>
          </span>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="tel:0800825925" className="hover:text-white transition-colors">Hotline Devis : 0800 825 925 (Gratuit)</a>
            <span className="text-slate-600">•</span>
            <Link to="/contact" className="hover:text-white text-sky-400 transition-colors">Besoin d'un conseil ? Contactez-nous</Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE MODAL WINDOW (Personalized Offer - Styled in Batimove Navy/Red)
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
              className="absolute inset-0 bg-[#07182b]/85 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-[#0B1E33] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 text-white z-10"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-display">Offre Sur Mesure</h2>
                  <p className="text-slate-300 text-xs mt-1">Dites-nous en plus sur votre projet d'exception.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="space-y-3.5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Prénom *</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full bg-slate-900/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" 
                      placeholder="Jean" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Nom *</label>
                    <input 
                      required 
                      type="text" 
                      className="w-full bg-slate-900/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" 
                      placeholder="Dupont" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Téléphone *</label>
                  <input 
                    required 
                    type="tel" 
                    className="w-full bg-slate-900/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" 
                    placeholder="+41 79 000 00 00" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Détails du projet</label>
                  <textarea 
                    required 
                    rows={3} 
                    className="w-full bg-slate-900/60 border border-white/15 rounded-xl px-3.5 py-2 text-white placeholder:text-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none" 
                    placeholder="Ex: Déménagement international, objets d'art, villa 10 pièces..."
                  />
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit"
                    disabled={isSubmitting} 
                    className="w-full bg-batimove-red hover:bg-[#c00500] text-white rounded-xl py-3 font-bold text-xs sm:text-sm shadow-xl shadow-red-900/30 flex items-center justify-center gap-2 font-display border-none cursor-pointer"
                  >
                    {isSubmitting ? 'Envoi...' : <><Send className="w-3.5 h-3.5" /> Envoyer la demande</>}
                  </Button>
                  <p className="text-center text-[11px] text-slate-400 mt-2 flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Vos données sont protégées (nLPD Suisse).
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};