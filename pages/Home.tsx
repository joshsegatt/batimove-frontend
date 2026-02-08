import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ArrowUpRight, Play, Star, Wifi, Battery, Box, Video, Phone } from 'lucide-react';
import { Button } from '../components/UIComponents';
import { Link } from 'react-router-dom';
import { HeroQuoteCard } from '../components/HeroQuoteCard';

// Marketing Slides Data
const HERO_SLIDES = [
   {
      id: 1,
      pretitle: "EXCELLENCE SUISSE",
      title: "Précision Horlogère.",
      gradient: "from-white via-white to-slate-400",
      description: "La seule plateforme de déménagement qui combine la rigueur d'une banque privée avec la logistique de pointe.",
   },
   {
      id: 2,
      pretitle: "TECHNOLOGIE 2025",
      title: "Visio-Cotation AI.",
      gradient: "from-blue-300 via-blue-100 to-white",
      description: "Oubliez les visites intrusives. Filmez votre logement, notre IA calcule le volume exact et fige le prix instantanément.",
   },
   {
      id: 3,
      pretitle: "SÉRÉNITÉ TOTALE",
      title: "Service Gants Blancs.",
      // FIXED: Changed from red gradient to white/slate to match the first slides' aesthetic.
      gradient: "from-white via-white to-slate-400",
      description: "Emballage, démontage, nettoyage. Nous gérons 100% de la charge mentale. Vous ne portez que vos clés.",
   }
];

export const Home: React.FC = () => {
   // Marketing Rotor State
   const [currentSlide, setCurrentSlide] = useState(0);

   // Auto-rotate slides every 3.5 seconds (Marketing Rhythm)
   useEffect(() => {
      const timer = setInterval(() => {
         setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 3500);
      return () => clearInterval(timer);
   }, []);

   const slide = HERO_SLIDES[currentSlide];

   return (
      <div className="min-h-screen bg-white selection:bg-batimove-blue selection:text-white font-sans text-slate-900">

         {/* =========================================================================
          HERO: MARKETING BANNER STYLE (Dynamic Rotor)
          ========================================================================= */}
         <section className="relative min-h-screen lg:min-h-screen flex items-center overflow-hidden pt-32 pb-16 lg:pt-0 lg:pb-0">

            {/* 1. BACKGROUND: 4K GENEVA IMAGE */}
            <div className="absolute inset-0 z-0">
               {/* Geneva 4K Background */}
               <img
                  src="/hero-geneva-16k.jpg"
                  alt="Geneva Switzerland"
                  className="w-full h-full object-cover"
               />
               {/* Dark Gradient Overlay for Text Contrast */}
               <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />
               {/* Subtle Grid Texture */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20"></div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10 w-full h-full">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                  {/* 2. LEFT COLUMN: THE MARKETING ROTOR */}
                  <div className="flex flex-col justify-center relative min-h-[400px]">

                     {/* Progress Bars (Indicators) */}
                     <div className="flex gap-2 mb-10 w-full max-w-sm">
                        {HERO_SLIDES.map((_, idx) => (
                           <div key={idx} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                              {idx === currentSlide && (
                                 <motion.div
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3.5, ease: "linear" }}
                                    className="h-full bg-white"
                                 />
                              )}
                              {idx < currentSlide && <div className="h-full bg-white w-full" />}
                           </div>
                        ))}
                     </div>

                     <AnimatePresence mode="wait">
                        <motion.div
                           key={currentSlide}
                           initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                           animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                           exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                           transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                           {/* Pre-Title (Category) */}
                           <h3 className="text-batimove-blue font-bold tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm md:text-base mb-3 sm:mb-4 uppercase font-display flex items-center gap-2 sm:gap-3">
                              <span className="w-6 sm:w-8 h-[2px] bg-batimove-red"></span>
                              {slide.pretitle}
                           </h3>

                           {/* Main Headline (Marketing Banner Style) */}
                           <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] mb-6 sm:mb-8">
                              <span className={`text-transparent bg-clip-text bg-gradient-to-br ${slide.gradient}`}>
                                 {slide.title}
                              </span>
                           </h1>

                           {/* Description */}
                           <p className="font-sans text-slate-400 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-xl mb-8 sm:mb-12">
                              {slide.description}
                           </p>
                        </motion.div>
                     </AnimatePresence>

                     {/* Static CTAs */}
                     <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                        <Link to="/quote" className="w-full sm:w-auto">
                           <Button className="w-full sm:w-auto h-16 rounded-full px-10 bg-batimove-red text-white hover:bg-[#c00500] font-bold font-display tracking-wide shadow-[0_0_40px_-10px_rgba(225,6,0,0.6)] transition-all hover:scale-105 text-lg flex items-center justify-center gap-2 group">
                              Démarrer le Devis
                              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                           </Button>
                        </Link>

                        <div className="flex items-center gap-4 px-6">
                           <div className="flex -space-x-3">
                              {[1, 2, 3].map((i) => (
                                 <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B1E33] bg-slate-700 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Client" className="w-full h-full object-cover" />
                                 </div>
                              ))}
                           </div>
                           <div className="text-white text-sm font-bold">
                              4.9/5 <span className="text-slate-500 font-normal">Trustpilot</span>
                           </div>
                        </div>
                     </div>

                  </div>

                  {/* 3. RIGHT COLUMN: COMPACT HERO CARD */}
                  <div className="relative hidden lg:flex items-center justify-end">
                     <HeroQuoteCard className="w-full max-w-[300px] xl:max-w-[320px] 2xl:max-w-[340px]" />
                  </div>

               </div>
            </div>
         </section>
         {/* =========================================================================
          SECTION 1: VALUE PROPOSITION (Refined Typography)
          ========================================================================= */}
         <section className="py-32 bg-white text-slate-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-end">
                  <div>
                     <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] mb-6 text-slate-900">
                        Redéfinir <br /> les standards.
                     </h2>
                     <div className="h-1 w-24 bg-batimove-red"></div>
                  </div>
                  <p className="font-sans text-xl text-slate-600 font-normal leading-relaxed max-w-md">
                     Nous traitons chaque déménagement comme une opération de haute précision. Votre patrimoine mérite l'exigence d'une banque privée et la délicatesse d'une galerie d'art.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-100 pt-16">

                  {/* Feature 1 - Shield */}
                  <div className="group">
                     <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-batimove-blue transition-colors text-slate-900">Patrimoine Sécurisé</h3>
                     <p className="font-sans text-slate-600 leading-relaxed text-lg font-medium">
                        Assurance "All Risk" jusqu'à CHF 5M incluse. Protection des données bancaire et serveurs hébergés en Suisse.
                     </p>
                  </div>

                  {/* Feature 2 - Stopwatch */}
                  <div className="group">
                     <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-batimove-blue transition-colors text-slate-900">Horlogerie Logistique</h3>
                     <p className="font-sans text-slate-600 leading-relaxed text-lg font-medium">
                        Planification à la minute. Nous garantissons les horaires d'intervention et de livraison avec une rigueur absolue.
                     </p>
                  </div>

                  {/* Feature 3 - Sparkles/Star */}
                  <div className="group">
                     <h3 className="font-display text-2xl font-bold mb-4 group-hover:text-batimove-blue transition-colors text-slate-900">Service Gants Blancs</h3>
                     <p className="font-sans text-slate-600 leading-relaxed text-lg font-medium">
                        Uniformes impeccables, discrétion totale et politesse exemplaire. Nos équipes sont formées à l'excellence.
                     </p>
                  </div>

               </div>
            </div>
         </section>

         {/* =========================================================================
          SECTION 2: TECHNOLOGY (Realistic iPhone 17 Pro Max Simulation - VIDEO QUOTE)
          ========================================================================= */}
         <section className="py-32 bg-[#0B1E33] relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                  {/* Text Side - HONEST & TRANSPARENT */}
                  <div>
                     <h2 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1] mb-8">
                        La Visio-Cotation <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">Intelligente.</span>
                     </h2>
                     <p className="font-sans text-slate-300 text-xl font-normal leading-relaxed mb-10 max-w-xl">
                        Plus besoin de rendez-vous intrusifs. Filmez simplement vos pièces avec votre smartphone. Nos experts analysent la vidéo à distance pour valider le volume et vous garantir un prix ferme.
                     </p>

                     <div className="space-y-6">
                        {[
                           "Vidéo rapide (3 min max)",
                           "Analyse par Experts + IA",
                           "Prix fixe garanti sous 24h"
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-4 text-white group">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                 <Check className="w-4 h-4" strokeWidth={3} />
                              </div>
                              <span className="font-sans text-lg font-medium tracking-wide">{item}</span>
                           </div>
                        ))}
                     </div>

                     <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
                        <Link to="/quote">
                           <Button className="bg-batimove-red text-white hover:bg-[#c00500] rounded-full px-8 py-4 font-bold font-display tracking-wide shadow-xl shadow-batimove-red/30">
                              Démarrer la Visio-Cotation
                           </Button>
                        </Link>
                        <div className="flex flex-col gap-2 px-4 sm:px-0">
                           <a href="tel:0800825925" className="flex items-center gap-2 text-slate-700 hover:text-batimove-blue transition-colors font-bold">
                              <Phone className="w-5 h-5" />
                              <span className="text-xl font-display">0800 825 925</span>
                           </a>
                           <div className="flex items-center gap-2 text-sm text-slate-500">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="font-semibold">Disponible 24/7</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Visual Side - HYPER REALISTIC IPHONE 17 PRO MAX */}
                  <div className="relative flex items-center justify-center perspective-1000">

                     {/* Decorative Glow behind Phone */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[600px] bg-blue-600/30 blur-[90px] -z-10 rounded-full opacity-60"></div>

                     {/* CHASSIS: Titanium Frame Simulation */}
                     <div className="relative w-[340px] h-[680px] bg-[#1c1c1e] rounded-[55px] p-[6px] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_0_0_4px_rgba(30,30,30,1),0_20px_50px_-10px_rgba(0,0,0,0.5)] ring-1 ring-white/10 transition-transform duration-700 hover:scale-[1.02]">

                        {/* Metallic Sheen (Light hitting the curves) */}
                        <div className="absolute inset-0 rounded-[55px] bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-20"></div>

                        {/* BEZEL: The Black Border */}
                        <div className="relative w-full h-full bg-black rounded-[49px] p-[10px] overflow-hidden border border-[#2c2c2e] shadow-inner">

                           {/* SCREEN: The Display Area */}
                           <div className="relative w-full h-full bg-slate-950 rounded-[40px] overflow-hidden">

                              {/* DYNAMIC ISLAND */}
                              <div className="absolute top-5 left-1/2 -translate-x-1/2 h-[34px] w-[120px] bg-black rounded-full z-50 flex items-center justify-center px-4 shadow-lg shadow-black/50">
                                 {/* Camera/Sensor Simulation */}
                                 <div className="w-full flex justify-between items-center opacity-40">
                                    <div className="w-3 h-3 rounded-full bg-[#1a1a1a]"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                                 </div>
                              </div>

                              {/* STATUS BAR Elements (Fake) */}
                              <div className="absolute top-6 left-8 text-white text-[12px] font-bold z-40">09:41</div>
                              <div className="absolute top-6 right-8 flex gap-2 z-40 text-white">
                                 <Wifi className="w-4 h-4" />
                                 <Battery className="w-4 h-4" />
                              </div>

                              {/* --- SCREEN CONTENT START --- */}

                              {/* Dynamic Background Image - VIDEO MODE */}
                              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center opacity-70"></div>

                              {/* UI Overlay */}
                              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent z-30 pointer-events-none"></div>

                              {/* Recording Indicator */}
                              <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-30">
                                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                 <span className="text-[10px] font-mono text-white tracking-widest uppercase font-bold">REC 00:14</span>
                              </div>

                              {/* Detected Objects (Inventory List Building) */}
                              <motion.div
                                 animate={{ x: [0, 5, 0] }}
                                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                 className="absolute top-1/3 left-4 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl z-20 flex items-center gap-3 w-[160px] shadow-lg"
                              >
                                 <div className="w-8 h-8 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <Box className="w-4 h-4 text-blue-300" />
                                 </div>
                                 <div>
                                    <div className="text-[9px] text-blue-200 uppercase font-bold tracking-wider">Inventaire</div>
                                    <div className="text-sm font-bold text-white">Canapé + TV</div>
                                 </div>
                              </motion.div>

                              <motion.div
                                 animate={{ x: [0, -5, 0] }}
                                 transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                                 className="absolute bottom-1/3 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl z-20 flex items-center gap-3 w-[140px] shadow-lg"
                              >
                                 <div className="w-8 h-8 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <Video className="w-4 h-4 text-green-300" />
                                 </div>
                                 <div>
                                    <div className="text-[9px] text-green-200 uppercase font-bold tracking-wider">Qualité</div>
                                    <div className="text-sm font-bold text-white">4K HDR</div>
                                 </div>
                              </motion.div>

                              {/* Bottom UI - Upload Button */}
                              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[85%] z-30">
                                 <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white py-4 rounded-full text-center font-bold text-sm shadow-xl flex items-center justify-center gap-3">
                                    <div className="relative">
                                       <div className="w-3 h-3 bg-white rounded-full animate-ping absolute inset-0 opacity-50"></div>
                                       <div className="w-3 h-3 bg-white rounded-full relative"></div>
                                    </div>
                                    Traitement Vidéo...
                                 </div>
                                 {/* Home Indicator */}
                                 <div className="w-1/3 h-1 bg-white/50 rounded-full mx-auto mt-6"></div>
                              </div>

                              {/* --- SCREEN CONTENT END --- */}

                           </div>
                        </div>
                     </div>

                  </div>

               </div>
            </div>
         </section>

         {/* =========================================================================
          SECTION 3: PROCESS (Consistent Text)
          ========================================================================= */}
         <section className="py-32 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               <div className="text-center mb-24">
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-6">Simple comme bonjour.</h2>
                  <p className="font-sans text-slate-600 text-lg max-w-2xl mx-auto font-medium">Un processus optimisé pour éliminer 100% des frictions habituelles.</p>
               </div>

               <div className="relative">
                  {/* Central Line (Desktop) */}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-200 -translate-y-1/2 hidden md:block z-0"></div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">

                     {/* Step 1 */}
                     <div className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-full h-48 mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg">
                           <img src="/digital-quote.png" loading="lazy" decoding="async" alt="Digital Quote Form" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block font-display">Étape 01</span>
                        <h3 className="font-display text-2xl font-bold text-slate-900 mb-4">L'Offre Digitale</h3>
                        <p className="font-sans text-slate-600 leading-relaxed font-medium">
                           Remplissez le formulaire ou envoyez une vidéo. Notre équipe valide l'inventaire et vous envoie un prix ferme.
                        </p>
                     </div>

                     {/* Step 2 */}
                     <div className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-full h-48 mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg">
                           <img src="/boxes-prep.png" loading="lazy" decoding="async" alt="Moving Boxes Preparation" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block font-display">Étape 02</span>
                        <h3 className="font-display text-2xl font-bold text-slate-900 mb-4">La Préparation</h3>
                        <p className="font-sans text-slate-600 leading-relaxed font-medium">
                           Vos cartons sont livrés à domicile 72h après validation. Nous gérons les autorisations de stationnement.
                        </p>
                     </div>

                     {/* Step 3 */}
                     <div className="bg-white p-12 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-transform duration-500">
                        <div className="w-full h-48 mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg">
                           <img src="/truck-tracking.png" loading="lazy" decoding="async" alt="Moving Truck Tracking" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block font-display">Étape 03</span>
                        <h3 className="font-display text-2xl font-bold text-slate-900 mb-4">Le Mouvement</h3>
                        <p className="font-sans text-slate-600 leading-relaxed font-medium">
                           Suivez votre camion en temps réel le jour J. Installez-vous sereinement, tout est déjà en place.
                        </p>
                     </div>

                  </div>
               </div>
            </div>
         </section>

         {/* =========================================================================
          SECTION 4: MATERIALS GALLERY (Visual Luxury)
          ========================================================================= */}
         <section className="py-32 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                  <h2 className="font-display text-4xl font-bold text-slate-900">Le sens du détail.</h2>
                  <Link to="/services" className="text-batimove-blue font-bold flex items-center gap-2 hover:gap-4 transition-all mt-4 md:mt-0 group">
                     <span className="border-b border-transparent group-hover:border-batimove-blue transition-all">Explorer nos équipements</span>
                     <ArrowUpRight className="w-5 h-5" />
                  </Link>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:h-[600px]">
                  {/* Large Image */}
                  <div className="relative rounded-[2rem] overflow-hidden group shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2070&auto=format&fit=crop" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Protection Sols et Murs" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     <div className="absolute bottom-10 left-10 text-white">
                        <h3 className="font-display text-3xl font-bold mb-3">Protection Sols & Murs</h3>
                        <p className="font-sans text-white/90 text-base max-w-sm font-medium leading-relaxed">Nous installons des protections blanches sur tous les sols et murs avant même de déplacer le premier carton. Votre bien immobilier reste impeccable.</p>
                     </div>
                  </div>

                  <div className="grid grid-rows-2 gap-4">
                     {/* Top Small */}
                     <div className="relative rounded-[2rem] overflow-hidden group shadow-xl">
                        <img src="/swiss-truck.png" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Flotte Moderne" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                           <h3 className="font-display text-2xl font-bold">Flotte Moderne</h3>
                        </div>
                     </div>
                     {/* Bottom Small - FIXED IMAGE */}
                     <div className="relative rounded-[2rem] overflow-hidden group shadow-xl">
                        <img src="/packing-materials.png" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Emballages Spécifiques" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 text-white">
                           <h3 className="font-display text-2xl font-bold">Emballages Spécifiques</h3>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* =========================================================================
          SECTION 5: FOOTER CTA - UPDATED RED BUTTON
          ========================================================================= */}
         <section className="py-32 bg-slate-900 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            {/* Subtle Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-batimove-blue/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto px-6">
               <h2 className="font-display text-5xl md:text-6xl font-bold text-white tracking-tighter mb-8 leading-[0.95]">
                  Prêt à changer <br /> <span className="text-batimove-red">de vie ?</span>
               </h2>
               <p className="font-sans text-slate-400 text-xl mb-12 font-normal">
                  Rejoignez les milliers de familles et d'entreprises qui ont choisi l'excellence suisse.
               </p>
               <Link to="/quote">
                  <Button className="h-20 px-16 rounded-full text-xl bg-batimove-red text-white hover:bg-[#c00500] shadow-[0_0_50px_-10px_rgba(225,6,0,0.5)] font-bold tracking-wide font-display hover:-translate-y-1 transition-all">
                     Obtenir mon devis gratuit
                  </Button>
               </Link>
            </div>
         </section>

      </div>
   );
};