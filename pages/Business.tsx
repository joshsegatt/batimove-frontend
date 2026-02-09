import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/UIComponents';
import {
  ArrowRight
} from 'lucide-react';

const businessPillars = [
  {
    id: 'continuity',
    title: "Continuité Absolue",
    subtitle: "Zero Downtime Guarantee",
    // 3D Stopwatch (Corrected Path: Travel and places)
    icon3d: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Stopwatch.png",
    description: "Nous comprenons que chaque minute d'arrêt coûte de l'argent. Nos équipes opèrent en mode 'Commando' : soirs, week-ends et jours fériés pour garantir une reprise d'activité immédiate à 08h00 le lundi.",
    stats: "100% Opérationnel J+1",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" // High-rise architecture
  },
  {
    id: 'tech',
    title: "Logistique IT & Serveurs",
    subtitle: "Infrastructure Critique",
    // 3D Desktop Computer
    icon3d: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Desktop%20Computer.png",
    description: "Déménagement de salles serveurs, déconnexion/reconnexion des postes de travail et gestion des câblages par des techniciens certifiés. Emballage antistatique et transport climatisé sécurisé.",
    stats: "Techniciens Certifiés",
    image: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=80&w=2070&auto=format&fit=crop" // Blue Server Rack / Data Center
  },
  {
    id: 'security',
    title: "Confidentialité & Archives",
    subtitle: "Sécurité Bancaire",
    // 3D Locked (Padlock)
    icon3d: "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Locked.png",
    description: "Transport scellé pour vos documents sensibles (RH, Finance, Légal). Destruction d'archives certifiée conforme à la nLPD et stockage sécurisé en coffre-fort numérique ou physique.",
    stats: "Norme ISO 27001",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop" // Abstract security/vault
  },
];


export const Business: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-950 overflow-hidden flex flex-col font-sans text-slate-900">

      {/* Background Ambience (Corporate & Deep) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1E33] via-[#0f2540] to-slate-900 z-0"></div>
      <div className="absolute top-0 right-0 w-[50vw] h-[100vh] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] z-0"></div>

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px] -ml-40 -mt-40 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] -mr-20 -mb-20 pointer-events-none"></div>

      {/* Navbar Spacer */}
      <div className="h-20 flex-shrink-0"></div>

      {/* Main Layout */}
      <div className="flex-1 flex w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-4 lg:py-6 z-10 gap-8 relative">

        {/* LEFT COLUMN: Navigation & Strategy */}
        <div className="w-full lg:w-5/12 flex flex-col justify-center space-y-6">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1] mb-4">
              L'Art du Transfert <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Stratégique.</span>
            </h1>
            <p className="font-sans text-slate-300 text-base lg:text-lg font-normal leading-relaxed max-w-lg">
              Minimisez l'impact. Maximisez la productivité. <br />
              Une logistique de précision pour les sociétés exigeantes.
            </p>
          </motion.div>

          {/* Interactive Pillars (Tabs) */}
          <div className="space-y-2.5">
            {businessPillars.map((pillar, idx) => (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(idx)}
                className={`w-full text-left p-3 rounded-2xl transition-all duration-200 group flex items-center justify-between border backdrop-blur-sm ${activeTab === idx
                  ? 'bg-white text-batimove-dark border-white shadow-xl scale-[1.02] z-10'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:border-white/20 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  {/* 3D Icon Container - Floating, No Background */}
                  <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center transition-transform duration-200 ${activeTab === idx ? 'scale-110' : 'scale-100 opacity-80 group-hover:opacity-100 group-hover:scale-105'
                    }`}>
                    <img
                      src={pillar.icon3d}
                      alt={pillar.title}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>

                  <div>
                    <h3 className={`font-display font-bold text-base ${activeTab === idx ? 'text-slate-900' : 'text-inherit'}`}>{pillar.title}</h3>
                    <p className={`text-[10px] uppercase tracking-widest font-bold ${activeTab === idx ? 'text-batimove-blue' : 'opacity-60'}`}>{pillar.subtitle}</p>
                  </div>
                </div>

                <div className={`transition-transform duration-200 ${activeTab === idx ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                  <ArrowRight className="w-5 h-5 text-batimove-red" />
                </div>
              </button>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <Link to="/quote/pro">
              <Button size="lg" className="w-full bg-batimove-red hover:bg-[#c00500] text-white rounded-full py-4 text-base font-bold shadow-2xl shadow-red-900/50 hover:shadow-red-500/50 tracking-wide font-display uppercase">
                Demander une Offre Corporate
              </Button>
            </Link>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Dynamic Visuals (The "Stage") */}
        <div className="hidden lg:flex flex-1 relative items-center justify-center">
          {/* The Image Card */}
          <div className="relative w-full h-[85%] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
            {/* Removed mode="wait" to allow image cross-fading for speed */}
            <AnimatePresence>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img
                  src={businessPillars[activeTab].image}
                  alt={businessPillars[activeTab].title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E33] via-[#0B1E33]/60 to-transparent opacity-90"></div>
              </motion.div>
            </AnimatePresence>

            {/* Dynamic Content Overlay - Snappy Transition */}
            <div className="absolute bottom-0 left-0 w-full p-8 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-batimove-red text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg font-display">
                      Avantage Stratégique
                    </div>
                  </div>

                  <h2 className="font-display text-2xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                    {businessPillars[activeTab].description}
                  </h2>

                  <div className="flex gap-3 mt-6">
                    {['Disponibilité 24/7', 'Équipe Dédiée'].map((tag, i) => (
                      <span key={i} className="text-[10px] font-bold text-blue-100 border border-white/20 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-md uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Decorative Floating Elements */}
          <div className="absolute -right-8 top-20 w-24 h-24 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
          <div className="absolute -left-8 bottom-20 w-16 h-16 border-2 border-dashed border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        </div>

      </div>
    </div>
  );
};