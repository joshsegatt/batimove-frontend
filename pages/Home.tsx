import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ArrowUpRight, Play, Star, Wifi, Battery, Box, Video, Phone, ShieldCheck, Clock, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '../components/UIComponents';
import { Link } from 'react-router-dom';
import { HeroQuoteCard } from '../components/HeroQuoteCard';



const heroSlides = [
   {
      preTitle: "DÉMÉNAGEMENT PREMIUM",
      titleFormatted: <>Déménagement Sécurisé <br /> & Rapide à Genève</>,
      subtitle: "Équipe professionnelle, assurance incluse et devis transparent",
      ctaText: "Obtenir mon devis en 2 min",
      ctaLink: "/quote",
      badge: "(150+ avis vérifiés • Assurance 5M CHF Inclus)"
   },
   {
      preTitle: "NETTOYAGE & GARDE-MEUBLES",
      titleFormatted: <>Nettoyage Fin de Bail <br /> & Garde-Meubles Sécurisé</>,
      subtitle: "Garantie 100% remise de clés aux régies suisses et stockage sous alarme 24/7",
      ctaText: "Réserver mon nettoyage garanti",
      ctaLink: "/quote",
      badge: "(Garantie Réception Régies Genève & Vaud)"
   },
   {
      preTitle: "TRANSFERT PRO & SPÉCIALISÉ",
      titleFormatted: <>Transfert de Bureaux <br /> & Monte-Charge Genève</>,
      subtitle: "Solution clé en main pour entreprises, manutention lourde et transport de piano",
      ctaText: "Demander un devis entreprise",
      ctaLink: "/business",
      badge: "(Service Gants Blancs • Intervention 24/7)"
   }
];

export const Home: React.FC = () => {
   const [currentSlide, setCurrentSlide] = useState(0);

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 6500);
      return () => clearInterval(interval);
   }, []);

   return (
      <div className="min-h-screen bg-white selection:bg-batimove-blue selection:text-white font-sans text-slate-900">

         {/* =========================================================================
          HERO: MARKETING BANNER STYLE (Dynamic Rotor)
          ========================================================================= */}
         <section className="relative min-h-screen lg:min-h-screen flex items-center overflow-hidden pt-32 pb-16 lg:pt-0 lg:pb-0">

            {/* 1. BACKGROUND: STATIC 4K IMAGE */}
            <div className="absolute inset-0 z-0">
               {/* Geneva 4K Background */}
                <img
                   src="/novaherobati.png"
                   alt="Déménagement Genève"
                   className="w-full h-full object-cover filter contrast-[1.10] saturate-[1.20] brightness-[0.95]"
                   style={{
                      imageRendering: 'high-quality',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden'
                   }}
                />
               {/* Top Dark Overlay for Navbar Contrast */}
               <div className="absolute top-0 left-0 right-0 h-44 bg-gradient-to-b from-slate-950/95 via-slate-950/60 to-transparent z-10 pointer-events-none" />
               {/* Left Dark Gradient Vignette for Maximum Text Legibility */}
               <div className="absolute inset-y-0 left-0 w-full lg:w-3/5 bg-gradient-to-r from-slate-950/95 via-slate-950/80 via-50% to-transparent z-10 pointer-events-none" />
               {/* Minimal Micro-Fade at Base (Only 32px to avoid line) */}
               <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-slate-50 z-10 pointer-events-none" />
               {/* Subtle Grid Texture */}
               <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20 z-10 pointer-events-none"></div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-20 w-full h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                   {/* 2. LEFT COLUMN: EDITORIAL HERO TEXT (FREE & SPACIOUS - SWISS OPTION 1) */}
                    <div className="flex flex-col justify-center relative py-12">
                       
                       <div className="relative min-h-[440px] flex flex-col justify-between">
                          
                          {/* Animated Slide Content */}
                          <AnimatePresence mode="wait">
                             <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                                transition={{ duration: 0.45, ease: "easeInOut" }}
                                className="flex-1 flex flex-col justify-between py-2"
                             >
                                <div>
                                   {/* Main Headline */}
                                   <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.98] mb-6 text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                                      {heroSlides[currentSlide].titleFormatted}
                                   </h1>

                                    {/* Subtitle / Description */}
                                    <p className="font-sans text-slate-100 text-lg sm:text-xl font-normal leading-relaxed max-w-xl mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
                                       {heroSlides[currentSlide].subtitle}
                                    </p>
                                 </div>

                                {/* Slide CTA Button & Rating Footer */}
                                <div>
                                   <div className="flex flex-wrap items-center gap-4 mb-6">
                                      <Link to={heroSlides[currentSlide].ctaLink}>
                                         <Button className="bg-batimove-red hover:bg-[#c00500] text-white px-8 py-4 rounded-2xl font-bold font-display text-base tracking-wide shadow-2xl shadow-batimove-red/50 flex items-center gap-3 group hover:scale-105 transition-all">
                                            <span>{heroSlides[currentSlide].ctaText}</span>
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                         </Button>
                                      </Link>
                                   </div>

                                   {/* Trust & Social Proof Rating */}
                                   <div className="flex flex-wrap items-center gap-3 border-t border-white/20 pt-4 text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                                      <div className="flex items-center gap-1 text-amber-400">
                                         {[...Array(5)].map((_, idx) => (
                                            <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                         ))}
                                         <span className="ml-1 font-bold text-white font-display text-base">4.9/5</span>
                                      </div>
                                      <span className="text-slate-200 font-medium">
                                         {heroSlides[currentSlide].badge}
                                      </span>
                                   </div>
                                </div>
                             </motion.div>
                          </AnimatePresence>

                       </div>

                    </div>

                   {/* 3. RIGHT COLUMN: COMPACT HERO CARD */}
                   <div className="relative flex items-center justify-center lg:justify-end">
                      <HeroQuoteCard className="w-full max-w-[380px] xl:max-w-[400px] 2xl:max-w-[420px]" />
                   </div>

               </div>
            </div>
         </section>

         {/* =========================================================================
          SECTION 1: VALUE PROPOSITION (Swiss Premium Cards & Vector Icons)
          ========================================================================= */}
         <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="py-24 bg-slate-50 text-slate-900 relative z-10"
         >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16 items-end">
                  <div>
                     <h3 className="text-batimove-blue font-bold tracking-[0.2em] text-xs sm:text-sm mb-4 uppercase font-display flex items-center gap-2.5">
                        <span className="w-6 h-[2px] bg-batimove-red"></span>
                        EXCELLENCE & PRÉCISION
                     </h3>
                     <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-slate-900">
                        Garde-meubles <br /> à Genève.
                     </h2>
                  </div>
                  <p className="font-sans text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-lg">
                     Protégez votre patrimoine dans notre garde-meubles sécurisé à Genève. Du transfert de bureaux à la résidence de luxe, nous garantissons une mission de haute précision.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                  {/* Feature 1 */}
                  <div className="bg-white border border-slate-200/80 p-8 sm:p-10 rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col justify-between">
                     <div>
                        <div className="flex items-center justify-between mb-6">
                           <span className="font-mono text-xs font-bold text-slate-400 tracking-wider">/ 01</span>
                           <div className="w-8 h-[2px] bg-slate-200 group-hover:bg-batimove-red transition-colors duration-300"></div>
                        </div>
                        <h3 className="font-display text-2xl font-bold mb-4 text-slate-900 group-hover:text-batimove-blue transition-colors">Patrimoine Sécurisé</h3>
                        <p className="font-sans text-slate-600 leading-relaxed text-base font-normal">
                           Assurance "All Risk" jusqu'à CHF 5M incluse. Protection des données bancaires et serveurs hébergés en Suisse.
                        </p>
                     </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="bg-white border border-slate-200/80 p-8 sm:p-10 rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col justify-between">
                     <div>
                        <div className="flex items-center justify-between mb-6">
                           <span className="font-mono text-xs font-bold text-slate-400 tracking-wider">/ 02</span>
                           <div className="w-8 h-[2px] bg-slate-200 group-hover:bg-batimove-red transition-colors duration-300"></div>
                        </div>
                        <h3 className="font-display text-2xl font-bold mb-4 text-slate-900 group-hover:text-batimove-blue transition-colors">Horlogerie Logistique</h3>
                        <p className="font-sans text-slate-600 leading-relaxed text-base font-normal">
                           Planification à la minute. Nous garantissons les horaires d'intervention et de livraison avec une rigueur absolue.
                        </p>
                     </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="bg-white border border-slate-200/80 p-8 sm:p-10 rounded-3xl shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 group flex flex-col justify-between">
                     <div>
                        <div className="flex items-center justify-between mb-6">
                           <span className="font-mono text-xs font-bold text-slate-400 tracking-wider">/ 03</span>
                           <div className="w-8 h-[2px] bg-slate-200 group-hover:bg-batimove-red transition-colors duration-300"></div>
                        </div>
                        <h3 className="font-display text-2xl font-bold mb-4 text-slate-900 group-hover:text-batimove-blue transition-colors">Service Gants Blancs</h3>
                        <p className="font-sans text-slate-600 leading-relaxed text-base font-normal">
                           Uniformes impeccables, discrétion totale et politesse exemplaire. Nos équipes sont formées à l'excellence.
                        </p>
                     </div>
                  </div>

               </div>
            </div>
         </motion.section>

         {/* =========================================================================
          SECTION 2: TECHNOLOGY (Realistic iPhone 17 Pro Max Simulation - VIDEO QUOTE)
          ========================================================================= */}
         <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="py-28 bg-[#0B1E33] relative overflow-hidden text-white z-10"
         >
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                  {/* Text Side - HONEST & TRANSPARENT */}
                  <div>
                     <h2 className="font-display text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1] mb-8">
                        Visio-Cotation & <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">Monte-charge.</span>
                     </h2>
                     <p className="font-sans text-slate-300 text-xl font-normal leading-relaxed mb-10 max-w-xl">
                        Plus besoin de rendez-vous intrusifs. Filmez vos accès et vos pièces : notre technologie détermine si une location de monte-charge est requise et calcule votre volume instantanément.
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
                              Réservez votre créneau en 2 min
                           </Button>
                        </Link>
                        <div className="flex flex-col gap-2 px-4 sm:px-0">
                           <a href="tel:0800825925" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-bold">
                              <Phone className="w-5 h-5" />
                              <span className="text-xl font-display">0800 825 925</span>
                           </a>
                           <div className="flex items-center gap-2 text-sm text-slate-400">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                              <span className="font-semibold">Disponible 24/7</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Visual Side - HYPER REALISTIC IPHONE 17 PRO MAX WITH ACTIVE AI SCANNER */}
                  <div className="relative flex items-center justify-center perspective-1000">

                     {/* Decorative Ambient Glow behind Phone */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[640px] bg-gradient-to-tr from-blue-600/40 via-cyan-500/20 to-indigo-600/30 blur-[100px] -z-10 rounded-full opacity-80"></div>

                     {/* CHASSIS: Titanium Frame Simulation with 3D Tilt on Hover */}
                     <motion.div
                        whileHover={{ scale: 1.03, rotateY: 4, rotateX: -2 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative w-[340px] h-[680px] bg-[#1c1c1e] rounded-[55px] p-[6px] shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_0_0_4px_rgba(30,30,30,1),0_25px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/10 group cursor-pointer"
                     >

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
                              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center opacity-75"></div>

                              {/* ACTIVE AI LIDAR SCANNING LASER BEAM */}
                              <motion.div
                                 animate={{ top: ['18%', '75%', '18%'] }}
                                 transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                                 className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_18px_#06b6d4,0_0_30px_#06b6d4] z-25 pointer-events-none"
                              />

                              {/* AI Spatial Bounding Target Box */}
                              <motion.div
                                 animate={{ opacity: [0.4, 0.95, 0.4] }}
                                 transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                 className="absolute top-[38%] left-[16%] w-[130px] h-[75px] border border-cyan-400/80 rounded-xl pointer-events-none z-25 bg-cyan-500/10 shadow-[0_0_12px_rgba(6,182,212,0.3)] flex flex-col justify-between p-1.5"
                              >
                                 <span className="text-[8px] font-mono text-cyan-300 font-bold bg-black/70 px-1 py-0.5 rounded w-fit tracking-wider">3.4 m³ • AI SCAN</span>
                                 <div className="flex justify-end">
                                    <span className="text-[7px] font-mono text-green-400 bg-black/60 px-1 py-0.5 rounded">99.8% Match</span>
                                 </div>
                              </motion.div>

                              {/* UI Overlay */}
                              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/80 to-transparent z-30 pointer-events-none"></div>

                              {/* Recording Indicator */}
                              <div className="absolute top-16 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 z-30 shadow-lg">
                                 <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                                 <span className="text-[10px] font-mono text-white tracking-widest uppercase font-bold">REC 00:14</span>
                              </div>

                              {/* Detected Objects (Inventory List Building) */}
                              <motion.div
                                 animate={{ x: [0, 5, 0] }}
                                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                 className="absolute top-1/4 left-3 bg-slate-950/70 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl z-30 flex items-center gap-2.5 w-[150px] shadow-xl"
                              >
                                 <div className="w-7 h-7 rounded-xl bg-blue-500/30 flex items-center justify-center border border-blue-400/40">
                                    <Box className="w-3.5 h-3.5 text-blue-300" />
                                 </div>
                                 <div>
                                    <div className="text-[8px] text-blue-300 uppercase font-bold tracking-wider">Inventaire</div>
                                    <div className="text-xs font-bold text-white">Canapé + TV</div>
                                 </div>
                              </motion.div>

                              <motion.div
                                 animate={{ x: [0, -5, 0] }}
                                 transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
                                 className="absolute bottom-1/3 right-3 bg-slate-950/70 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl z-30 flex items-center gap-2.5 w-[135px] shadow-xl"
                              >
                                 <div className="w-7 h-7 rounded-xl bg-cyan-500/30 flex items-center justify-center border border-cyan-400/40">
                                    <Video className="w-3.5 h-3.5 text-cyan-300" />
                                 </div>
                                 <div>
                                    <div className="text-[8px] text-cyan-300 uppercase font-bold tracking-wider">Qualité</div>
                                    <div className="text-xs font-bold text-white">4K HDR</div>
                                 </div>
                              </motion.div>

                              {/* Bottom UI - Upload Button */}
                              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[85%] z-30">
                                 <div className="bg-white/15 backdrop-blur-xl border border-white/25 text-white py-3.5 rounded-full text-center font-bold text-xs shadow-xl flex items-center justify-center gap-2.5">
                                    <div className="relative">
                                       <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping absolute inset-0 opacity-75"></div>
                                       <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full relative"></div>
                                    </div>
                                    Traitement Vidéo...
                                 </div>
                                 {/* Home Indicator */}
                                 <div className="w-1/3 h-1 bg-white/50 rounded-full mx-auto mt-5"></div>
                              </div>

                              {/* --- SCREEN CONTENT END --- */}

                           </div>
                        </div>
                     </motion.div>

                  </div>
               </div>
            </div>
         </motion.section>

         {/* =========================================================================
          SECTION 3: PROCESS & NETTOYAGE (Swiss Luxury Editorial Cards)
          ========================================================================= */}
         <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="py-28 bg-slate-50 relative z-10"
         >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               
               {/* Section Title Header */}
               <div className="text-center mb-20 max-w-3xl mx-auto">
                  <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] mb-6">
                     Nettoyage fin de bail <br /> avec garantie.
                  </h2>
                  <p className="font-sans text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
                     Libérez-vous de l'état des lieux. Nous assurons un nettoyage avec garantie de réception, éliminant 100% des frictions avec votre régie.
                  </p>
               </div>

               {/* Swiss Luxury Cards Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">

                  {/* Card 1: L'Offre Digitale */}
                  <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-200/80 hover:border-slate-300 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between group">
                     <div>
                        <div className="relative w-full h-56 mb-8 rounded-2xl overflow-hidden shadow-sm border border-slate-100/80">
                           <img
                              src="/offre_digitale_card.jpg"
                              loading="lazy"
                              decoding="async"
                              alt="L'Offre Digitale Batimove"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                           />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-slate-900 mb-3 group-hover:text-batimove-blue transition-colors">L'Offre Digitale</h3>
                        <p className="font-sans text-slate-600 leading-relaxed font-normal text-base">
                           Remplissez le formulaire ou envoyez une vidéo pour votre déménagement et nettoyage. Notre équipe valide l'inventaire et vous envoie un prix ferme.
                        </p>
                     </div>
                  </div>

                  {/* Card 2: La Préparation */}
                  <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-200/80 hover:border-slate-300 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between group">
                     <div>
                        <div className="relative w-full h-56 mb-8 rounded-2xl overflow-hidden shadow-sm border border-slate-100/80">
                           <img
                              src="/preparation_cartons_card.jpg"
                              loading="lazy"
                              decoding="async"
                              alt="La Préparation et Emballage Batimove"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                           />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-slate-900 mb-3 group-hover:text-batimove-blue transition-colors">La Préparation</h3>
                        <p className="font-sans text-slate-600 leading-relaxed font-normal text-base">
                           Vos cartons sont livrés à domicile 72h après validation. Nous gérons les autorisations de stationnement et le matériel de protection.
                        </p>
                     </div>
                  </div>

                  {/* Card 3: Le Mouvement */}
                  <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl border border-slate-200/80 hover:border-slate-300 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between group">
                     <div>
                        <div className="relative w-full h-56 mb-8 rounded-2xl overflow-hidden shadow-sm border border-slate-100/80">
                           <img
                              src="/mouvement_camion_card.jpg"
                              loading="lazy"
                              decoding="async"
                              alt="Le Mouvement Camion Batimove"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                           />
                        </div>
                        <h3 className="font-display text-2xl font-bold text-slate-900 mb-3 group-hover:text-batimove-blue transition-colors">Le Mouvement</h3>
                        <p className="font-sans text-slate-600 leading-relaxed font-normal text-base">
                           Suivez votre camion en temps réel le jour J. Nos équipes certifiées s'occupent du chargement, du transport et du nettoyage final.
                        </p>
                     </div>
                  </div>

               </div>

               {/* Direct High-Converting CTA Trigger */}
               <div className="mt-16 text-center">
                  <Link to="/quote">
                     <Button className="bg-batimove-red hover:bg-[#c00500] text-white px-8 py-4.5 rounded-full font-bold font-display text-base tracking-wide shadow-xl shadow-batimove-red/30 inline-flex items-center gap-3 hover:scale-105 transition-all group">
                        <span>Réservez votre nettoyage garanti par les régies</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </Button>
                  </Link>
               </div>

            </div>
         </motion.section>

         {/* =========================================================================
          SECTION 4: MATERIALS GALLERY (Visual Luxury Bento Grid)
          ========================================================================= */}
         <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="py-28 bg-gradient-to-b from-white via-slate-50/40 to-slate-50 text-slate-900 relative z-10"
         >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               
               {/* Header with Luxury Accent */}
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                  <div>
                     <h3 className="text-batimove-blue font-bold tracking-[0.2em] text-xs sm:text-sm mb-3 uppercase font-display flex items-center gap-2.5">
                        <span className="w-6 h-[2px] bg-batimove-red"></span>
                        ÉQUIPEMENTS & PRÉSERVATION
                     </h3>
                     <h2 className="font-display text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        Le sens du détail.
                     </h2>
                  </div>
                  <Link to="/services" className="text-batimove-blue font-bold flex items-center gap-2.5 hover:gap-4 transition-all group text-sm sm:text-base">
                     <span className="border-b border-transparent group-hover:border-batimove-blue transition-all">Explorer nos équipements</span>
                     <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
               </div>

               {/* Bento Grid Gallery */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[620px]">
                  
                  {/* Large Card (Left) */}
                  <div className="relative rounded-[2.5rem] overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-700 min-h-[400px] lg:min-h-full border border-slate-100/80">
                     <img
                        src="/bento_protection_sols_murs.jpg"
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        alt="Protection Sols et Murs"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent"></div>

                     <div className="absolute bottom-8 left-8 right-8 text-white">
                        <h3 className="font-display text-3xl font-bold mb-3 tracking-tight">Protection Sols & Murs</h3>
                        <p className="font-sans text-slate-200 text-base max-w-md font-normal leading-relaxed">
                           Nous installons des protections feutrées sur tous les sols et murs avant même de déplacer le premier carton. Votre bien immobilier reste impeccable.
                        </p>
                     </div>
                  </div>

                  {/* Right Column Stack */}
                  <div className="grid grid-rows-2 gap-6">
                     
                     {/* Top Right Card */}
                     <div className="relative rounded-[2.5rem] overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-700 min-h-[260px] border border-slate-100/80">
                        <img
                           src="/bento_flotte_moderne_gps.jpg"
                           loading="lazy"
                           decoding="async"
                           className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                           alt="Flotte Moderne"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"></div>

                        <div className="absolute bottom-6 left-6 right-6 text-white">
                           <h3 className="font-display text-2xl font-bold mb-1 tracking-tight">Flotte Moderne</h3>
                           <p className="font-sans text-slate-300 text-sm font-normal">
                              Camions capitonnés Euro 6 sous géolocalisation en temps réel.
                           </p>
                        </div>
                     </div>

                     {/* Bottom Right Card */}
                     <div className="relative rounded-[2.5rem] overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-700 min-h-[260px] border border-slate-100/80">
                        <img
                           src="/bento_emballages_specifiques.jpg"
                           loading="lazy"
                           decoding="async"
                           className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                           alt="Emballages Spécifiques"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"></div>

                        <div className="absolute bottom-6 left-6 right-6 text-white">
                           <h3 className="font-display text-2xl font-bold mb-1 tracking-tight">Emballages Spécifiques</h3>
                           <p className="font-sans text-slate-300 text-sm font-normal">
                              Penderies portatives, housses matelas et caisses vaisselle renforcées.
                           </p>
                        </div>
                     </div>

                  </div>
               </div>
            </div>
         </motion.section>

      </div>
   );
};
