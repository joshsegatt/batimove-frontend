import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Check, 
  CheckCircle2, 
  ChevronRight, 
  Phone, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Mail, 
  Truck, 
  Package, 
  Building2, 
  Globe, 
  Shield, 
  Star, 
  Award, 
  Sparkles, 
  Warehouse, 
  ArrowUpRight, 
  FileText, 
  Wrench, 
  Send, 
  Headphones, 
  Layers,
  Navigation,
  Car
} from 'lucide-react';
import { Button } from '../components/UIComponents';
import { Link } from 'react-router-dom';

// --- Custom Duotone Vector Icons Matching Reference ---
const ParachuteCargoIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Parachute Canopy */}
    <path
      d="M32 7C16 7 10 20 10 27C16 27 20 23 24 23C28 23 30 27 32 27C34 27 36 23 40 23C44 23 48 27 54 27C54 20 48 7 32 7Z"
      stroke="#0284c7"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M22 11C26 15 28 20 28 25" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 11C38 15 36 20 36 25" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    {/* Suspension Lines */}
    <path d="M12 27L25 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 25L28 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M40 25L36 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M52 27L39 43" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    {/* Cargo Box */}
    <rect x="23" y="43" width="18" height="15" rx="2" stroke="#0B1E33" strokeWidth="2.5" fill="#f8fafc" />
    <path d="M32 43V58" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
    <path d="M23 50H41" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ScooterDeliveryIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Delivery Cargo Box on Back */}
    <rect x="10" y="20" width="18" height="16" rx="2" stroke="#0284c7" strokeWidth="2.5" fill="#f0f9ff" />
    <path d="M19 20V36" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 28H28" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    {/* Rear Wheel */}
    <circle cx="17" cy="48" r="6" stroke="#0B1E33" strokeWidth="2.5" />
    {/* Front Wheel */}
    <circle cx="47" cy="48" r="6" stroke="#0B1E33" strokeWidth="2.5" />
    {/* Scooter Body / Frame */}
    <path d="M17 42H28L34 47H41" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 37L41 22H48" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M41 22L47 48" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M44 18H51" stroke="#0B1E33" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const WarehouseShelfIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Warehouse Upright Storage Rack */}
    <path d="M14 10V54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M50 10V54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 18H54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 36H54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 54H54" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
    {/* Top Shelf Pallet Box */}
    <rect x="22" y="24" width="20" height="12" rx="1.5" stroke="#0B1E33" strokeWidth="2.5" fill="#f8fafc" />
    <path d="M32 24V36" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
    {/* Bottom Shelf Pallet Box */}
    <rect x="18" y="42" width="16" height="12" rx="1.5" stroke="#0B1E33" strokeWidth="2.5" fill="#f8fafc" />
    <path d="M18 42L34 54" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const LocationParcelIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Pin Path */}
    <path
      d="M30 6C20 6 12 14 12 24C12 37 30 52 30 52C30 52 48 37 48 24C48 14 40 6 30 6Z"
      stroke="#0284c7"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="30" cy="23" r="5" stroke="#0284c7" strokeWidth="2" />
    {/* Delivery Parcel overlapping in foreground */}
    <rect x="34" y="38" width="18" height="16" rx="2" stroke="#0B1E33" strokeWidth="2.5" fill="#f0f9ff" />
    <path d="M34 38L52 54" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M52 38L34 54" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// --- Custom Duotone Icons for Complementary Section (Matching media_1789022717886.png) ---
const LogisticServicesPlaneIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Modern Airplane Body */}
    <path
      d="M32 6C30 6 29 8 29 11V24L12 31V35L29 30V44L23 48V52L32 49L41 52V48L35 44V30L52 35V31L35 24V11C35 8 34 6 32 6Z"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#0B1E33"
    />
    {/* Cockpit Window */}
    <ellipse cx="32" cy="12" rx="1.5" ry="2.5" fill="#38bdf8" />
    {/* Left Engine */}
    <rect x="20" y="27" width="3" height="7" rx="1" stroke="#ffffff" strokeWidth="1.8" fill="#0B1E33" />
    {/* Right Engine */}
    <rect x="41" y="27" width="3" height="7" rx="1" stroke="#ffffff" strokeWidth="1.8" fill="#0B1E33" />
    {/* Cargo Parcel Box in lower right */}
    <rect x="40" y="38" width="18" height="18" rx="2" stroke="#38bdf8" strokeWidth="2.2" fill="#0284c7" fillOpacity="0.4" />
    <path d="M49 38V56" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M40 47H58" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CarShippingTruckIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Truck Cabin & Chassis */}
    <path
      d="M34 42H48L56 32V24H48V18H34"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Windshield */}
    <path
      d="M48 24H54L50 30H46V24"
      stroke="#38bdf8"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#38bdf8"
      fillOpacity="0.3"
    />
    {/* Front Wheel */}
    <circle cx="50" cy="46" r="5.5" stroke="#ffffff" strokeWidth="2.2" fill="#0B1E33" />
    <circle cx="50" cy="46" r="2.2" fill="#38bdf8" />
    {/* Rear Wheel */}
    <circle cx="20" cy="46" r="5.5" stroke="#ffffff" strokeWidth="2.2" fill="#0B1E33" />
    <circle cx="20" cy="46" r="2.2" fill="#38bdf8" />
    {/* Chassis Lines */}
    <path d="M26 46H44" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M10 46H14" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M56 46H58" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
    {/* Cargo Container Box on Truck */}
    <rect x="10" y="16" width="24" height="24" rx="2" stroke="#38bdf8" strokeWidth="2.2" fill="#0284c7" fillOpacity="0.3" />
    <path d="M22 16V40" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 28H34" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    {/* Upward Arrow on cargo box */}
    <path d="M22 24L22 32M19 27L22 24L25 27" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FurnitureShippingShipIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Deck Crane on Left */}
    <path d="M16 32V18H25L32 14" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 14V20" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M22 18L16 32" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    {/* Stacked Containers on Deck */}
    <rect x="33" y="21" width="9" height="9" rx="1" stroke="#ffffff" strokeWidth="1.8" fill="#0B1E33" />
    <rect x="44" y="21" width="9" height="9" rx="1" stroke="#ffffff" strokeWidth="1.8" fill="#0B1E33" />
    <rect x="38.5" y="12" width="9" height="9" rx="1" stroke="#ffffff" strokeWidth="1.8" fill="#0B1E33" />
    {/* Ship Hull */}
    <path
      d="M10 32H54L48 43H16L10 32Z"
      stroke="#ffffff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="#0B1E33"
    />
    {/* Ocean Waves */}
    <path
      d="M8 48C11 46 14 46 17 48C20 50 23 50 26 48C29 46 32 46 35 48C38 50 41 50 44 48C47 46 50 46 53 48C56 50 59 50 62 48"
      stroke="#38bdf8"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M8 54C11 52 14 52 17 54C20 56 23 56 26 54C29 52 32 52 35 54C38 56 41 56 44 54C47 52 50 52 53 54C56 56 59 56 62 54"
      stroke="#38bdf8"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const FastestShippingClockIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Parcel Box */}
    <rect x="12" y="12" width="30" height="30" rx="3" stroke="#ffffff" strokeWidth="2.2" fill="#0B1E33" />
    {/* Top Tape Flap */}
    <path d="M22 12V19H32V12" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Side Label Lines */}
    <path d="M16 31H24" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 36H21" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    {/* Clock Face in Bottom Right */}
    <circle cx="43" cy="43" r="13" stroke="#38bdf8" strokeWidth="2.2" fill="#0284c7" fillOpacity="0.4" />
    {/* Clock Ticks */}
    <circle cx="43" cy="33" r="0.9" fill="#ffffff" />
    <circle cx="53" cy="43" r="0.9" fill="#ffffff" />
    <circle cx="43" cy="53" r="0.9" fill="#ffffff" />
    <circle cx="33" cy="43" r="0.9" fill="#ffffff" />
    {/* Clock Hands */}
    <path d="M43 43L43 37" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M43 43L48 43" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    {/* Motion Speed Lines */}
    <path d="M28 41H30" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M26 45H29" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// --- Custom Icons for Emballage Section (Matching media_1789022915762.png) ---
const PackingUnpackingIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Box Bottom & Front */}
    <path d="M10 20L24 27L38 20V34L24 41L10 34V20Z" stroke="#0284c7" strokeWidth="2.2" strokeLinejoin="round" fill="#e0f2fe" fillOpacity="0.4" />
    <path d="M24 27V41" stroke="#0284c7" strokeWidth="2.2" />
    {/* Open Flaps */}
    <path d="M10 20L6 14L18 10L24 16" stroke="#0B1E33" strokeWidth="2" strokeLinejoin="round" />
    <path d="M38 20L42 14L30 10L24 16" stroke="#0B1E33" strokeWidth="2" strokeLinejoin="round" />
    <path d="M24 27L18 20L24 16L30 20L24 27Z" stroke="#0284c7" strokeWidth="2" fill="#bae6fd" fillOpacity="0.6" />
    {/* Packing Arrow inside */}
    <path d="M24 24V14M21 17L24 14L27 17" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StorageClipboardIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Clipboard Base */}
    <rect x="12" y="10" width="24" height="32" rx="2.5" stroke="#0284c7" strokeWidth="2.2" fill="#e0f2fe" fillOpacity="0.4" />
    {/* Top Clip */}
    <path d="M18 10V8C18 6.9 18.9 6 20 6H28C29.1 6 30 6.9 30 8V10" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="9" r="1.5" fill="#0B1E33" />
    {/* Document Lines / Inventory List */}
    <rect x="16" y="16" width="6" height="6" rx="1" stroke="#0284c7" strokeWidth="1.5" />
    <path d="M25 18H31" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M25 21H29" stroke="#0B1E33" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 27H32" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 32H28" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 37H24" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const AssuranceUmbrellaIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Card Boundary */}
    <rect x="8" y="12" width="32" height="24" rx="3" stroke="#0284c7" strokeWidth="2.2" fill="#e0f2fe" fillOpacity="0.4" />
    <path d="M8 20H40" stroke="#0284c7" strokeWidth="1.8" strokeDasharray="3 3" />
    {/* Umbrella / Protection Symbol */}
    <path d="M24 24C20 24 17 27 17 30H31C31 27 28 24 24 24Z" stroke="#0B1E33" strokeWidth="2" fill="#bae6fd" fillOpacity="0.6" />
    <path d="M24 22V33C24 34.1 23.1 35 22 35" stroke="#0B1E33" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Home: React.FC = () => {
  // Testimonial Carousel Active State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Équipe ponctuelle, polie et d'une efficacité impressionnante. Mon déménagement de Champel à Cologny s'est fait sans une seule égratignure. Le nettoyage de remise des clés a été validé du premier coup par la régie !",
      name: "Jean-Pierre Blanc",
      role: "Particulier • Déménagement Résidentiel",
      location: "Genève (Cologny)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    },
    {
      quote: "Le transfert de nos 45 postes de travail à Lausanne s'est déroulé sur un week-end sans aucun impact sur notre activité du lundi matin. Une rigueur suisse irréprochable et un devis 100% respecté à la lettre.",
      name: "Nathalie Favrod",
      role: "Directrice Financière • Cabinet Fiduciaire",
      location: "Lausanne (Ouchy)",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200"
    },
    {
      quote: "Le système de devis et le monte-meubles ont sauvé notre canapé d'angle au 5ème étage ! Je recommande vivement Batimove pour leur sérieux, leur soin et la gentillesse de toute l'équipe.",
      name: "Marc & Valérie Schneider",
      role: "Famille • Déménagement & Garde-meubles",
      location: "Nyon (Vaud)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-sky-600 selection:text-white">

      {/* =========================================================================
          SECTION 1: HERO SECTION ("L'Art du Déménagement !" / "The Way to Move!")
          ========================================================================= */}
      <section className="relative bg-[#f8fafc] overflow-hidden pt-8 lg:pt-12 pb-0">
        {/* Subtle background geometric pattern and ambient glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(2,132,199,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(2,132,199,0.03)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sky-200/25 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-end">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-6 flex flex-col justify-center py-6 sm:py-8 lg:py-12">
              {/* Main Headline with exact two-tone styling */}
              <h1 className="font-display text-4xl sm:text-6xl lg:text-[64px] xl:text-[70px] font-extrabold tracking-tight leading-[1.05] text-[#0B1E33] mb-6">
                L'Art du <br />
                <span className="text-[#0284c7] whitespace-nowrap">Déménagement&nbsp;!</span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-lg sm:text-xl font-normal leading-relaxed max-w-xl mb-8">
                Services professionnels de déménagement, emballage de haute précision et garde-meubles sécurisé à Genève, Lausanne et dans toute la Suisse. Assurance incluse jusqu'à 5M CHF.
              </p>

              {/* CTA Button */}
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/quote">
                  <Button className="bg-[#0B1E33] hover:bg-[#132c48] text-white px-8 py-4 rounded-xl font-bold text-base shadow-xl shadow-[#0B1E33]/25 flex items-center gap-3 transition-all hover:scale-105 group">
                    <span>Demander un Devis Gratuit</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-sky-400" />
                  </Button>
                </Link>
                <Link to="/calculator">
                  <Button variant="outline" className="border-slate-300 hover:bg-slate-100 text-slate-700 px-6 py-4 rounded-xl font-semibold text-base transition-all">
                    <span>Calculer mon volume</span>
                  </Button>
                </Link>
              </div>

              {/* Micro Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-200/80 max-w-lg">
                <div>
                  <div className="text-2xl font-bold text-[#0B1E33] font-display">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Prix Fixe Garanti</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0B1E33] font-display">CHF 5M</div>
                  <div className="text-xs text-slate-500 font-medium">Assurance RC Incluse</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0284c7] font-display">4.9 / 5</div>
                  <div className="text-xs text-slate-500 font-medium">Avis Clients Vérifiés</div>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Graphic Mover with Official Batimove Box */}
            <div className="lg:col-span-6 relative flex justify-center lg:justify-end items-end self-end w-full">
              <div className="relative w-full flex items-end justify-center lg:justify-end">
                <div className="absolute top-1/4 right-0 w-72 h-72 bg-sky-200/25 rounded-full blur-3xl -z-10 pointer-events-none" />

                {/* Freestanding High-Res Mover with Official Batimove Logo Box - Connected directly to bottom blue section */}
                <img
                  src="/hero-mover-tight.png"
                  alt="Déménageur professionnel Batimove Sarl avec carton officiel"
                  className="w-auto h-[480px] sm:h-[540px] md:h-[600px] lg:h-[660px] xl:h-[710px] 2xl:h-[750px] max-w-full lg:max-w-none object-contain object-bottom block align-bottom -mb-[1px] select-none pointer-events-none drop-shadow-[0_20px_35px_rgba(0,0,0,0.14)]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: FEATURES VALUE PROPS (3-COLUMN DARK NAVY BAR)
          ========================================================================= */}
      <section className="bg-[#07182b] text-white py-12 relative z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            
            {/* Value 1 */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                <Truck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white mb-2 tracking-tight group-hover:text-sky-300 transition-colors">
                  Déménagement Rapide
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-normal">
                  Planification suisse rigoureuse et exécution express pour respecter scrupuleusement vos délais et plannings.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white mb-2 tracking-tight group-hover:text-sky-300 transition-colors">
                  Sûr & 100% Assuré
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-normal">
                  Couverture All Risk intégrale jusqu'à CHF 5 Millions incluse. Vos biens manipulés avec un soin absolu.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-white mb-2 tracking-tight group-hover:text-sky-300 transition-colors">
                  Ponctualité Suisse
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-normal">
                  Arrivée et livraison à l'heure exacte convenue, sans mauvaise surprise, avec coordination logistique continue.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: "VOTRE PARTENAIRE DÉMÉNAGEMENT" ("WE'RE YOUR MOVING PARTNER")
          ========================================================================= */}
      <section id="about" className="py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Mover Graphic with Official Batimove Boxes & 720+ Trust Metric */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-[460px]">
                {/* Subtle Ambient Glow */}
                <div className="absolute -inset-3 bg-gradient-to-tr from-sky-100/60 to-slate-100/40 rounded-3xl blur-xl -z-10" />

                {/* Main Card with Batimove Official Mover Artwork */}
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-50 bg-white">
                  <img
                    src="/votre-partenaire-mover.jpg"
                    alt="Déménageur professionnel Batimove Sarl avec cartons officiels"
                    className="w-full h-auto object-contain block select-none"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Right: Partner Content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-3">
                À PROPOS DE BATIMOVE
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight leading-[1.12] mb-6">
                Votre Partenaire Déménagement de Confiance
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                Depuis plus de 10 ans, Batimove accompagne les familles et les entreprises de Suisse romande. Nous combinons rigueur helvétique, matériel moderne et déménageurs certifiés pour faire de chaque transition un moment serein.
              </p>

              {/* 2 Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-sm">Équipes Qualifiées</h4>
                    <p className="text-xs text-slate-500">Personnel formé en continu</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-900 text-sm">Prix Fixes & Clairs</h4>
                    <p className="text-xs text-slate-500">Devis sans surcoût caché</p>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3.5 mb-8">
                {[
                  "Protection intégrale de vos sols, murs et ascenseurs avant manipulation",
                  "Gestion des autorisations de stationnement auprès de la police et des communes",
                  "Prise en charge clé en main du premier carton à l'installation finale"
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="text-sm sm:text-base text-slate-700 font-medium">{text}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <div>
                <Link to="/services">
                  <Button className="bg-[#0B1E33] hover:bg-[#132c48] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md">
                    En Savoir Plus
                  </Button>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: "RECOMMANDÉ PAR LES PROFESSIONNELS" ("WE'RE CHOSEN BY PROFESSIONALS")
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#f8fafc] border-y border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Why Choose Us & 3 Icons */}
            <div className="lg:col-span-7">
              <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-3 block">
                POURQUOI NOUS CHOISIR
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight leading-[1.12] mb-10">
                Recommandé par les Professionnels & Régies
              </h2>

              {/* 3 Columns under title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Item 1 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                    Conseil Gratuit
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Visite technique sur place ou estimation par vidéo gratuite sous 24h.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                    Garantie Totale
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Garantie 100% remise de clés conforme aux exigences des régies suisses.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                    Support 24/7
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Assistance personnalisée et chef de projet joignable en direct le jour J.
                  </p>
                </div>

              </div>
            </div>

            {/* Right Column: Paragraph & Dark Blue Phone Card */}
            <div className="lg:col-span-5 flex flex-col justify-between h-full pt-4">
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                Nos standards de qualité stricts et notre rigueur éprouvée font de Batimove le prestataire privilégié des régies immobilières, expatriés et banques privées à Genève et dans le canton de Vaud.
              </p>

              {/* Dark Navy Highlight Card with Phone */}
              <div className="bg-[#0B1E33] text-white p-8 rounded-3xl shadow-xl border border-sky-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
                <h4 className="text-sky-400 font-bold text-sm tracking-wider uppercase font-display mb-2">
                  Besoin d'un devis immédiat ?
                </h4>
                <p className="text-slate-300 text-xs mb-6">
                  Nos spécialistes répondent à vos questions et planifient votre projet sans engagement :
                </p>
                <a 
                  href="tel:0800825925" 
                  className="inline-flex items-center gap-3 text-white hover:text-sky-300 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/40 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
                      0800 825 925
                    </div>
                    <div className="text-xs text-sky-400 font-medium">Numéro Gratuit en Suisse</div>
                  </div>
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: "TOUJOURS PRÊTS À VOUS AIDER" ("WE'RE ALWAYS READY TO HELP YOU")
          ========================================================================= */}
      <section id="services" className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Centered */}
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-3 block">
              NOS SERVICES COMPLETS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight">
              Toujours Prêts à Répondre à Vos Besoins
            </h2>
          </div>

          {/* 3-Column Layout Matching Reference: Left 2 Services, Center Freestanding Mover, Right 2 Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
            
            {/* Left Column (2 Services) */}
            <div className="lg:col-span-3 space-y-12 sm:space-y-16 text-center order-2 lg:order-1">
              
              {/* Service 1: Longue Distance */}
              <div className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50/70">
                <Link to="/services?type=prive" className="transform group-hover:scale-110 transition-transform duration-300 block">
                  <ParachuteCargoIcon className="w-16 h-16 mx-auto mb-4" />
                </Link>
                <Link to="/services?type=prive">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#0B1E33] mb-3 group-hover:text-sky-600 transition-colors">
                    Déménagement Longue Distance
                  </h3>
                </Link>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-4">
                  Intercantonal et international (Genève, Vaud, Zurich, France, UE) avec formalités de douane suisses intégrales.
                </p>
                <Link
                  to="/services?type=prive"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B1E33] hover:text-sky-600 transition-colors group/link"
                >
                  <span>En Savoir Plus</span>
                  <span className="w-5 h-5 rounded-full bg-[#0B1E33] group-hover/link:bg-sky-600 text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>

              {/* Service 2: Résidentiel Local */}
              <div className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50/70">
                <Link to="/services?type=prive" className="transform group-hover:scale-110 transition-transform duration-300 block">
                  <ScooterDeliveryIcon className="w-16 h-16 mx-auto mb-4" />
                </Link>
                <Link to="/services?type=prive">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#0B1E33] mb-3 group-hover:text-sky-600 transition-colors">
                    Déménagement Résidentiel Local
                  </h3>
                </Link>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-4">
                  Genève, Lausanne, Nyon, Montreux. Formules sur mesure du studio à la villa avec protection complète.
                </p>
                <Link
                  to="/services?type=prive"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B1E33] hover:text-sky-600 transition-colors group/link"
                >
                  <span>En Savoir Plus</span>
                  <span className="w-5 h-5 rounded-full bg-[#0B1E33] group-hover/link:bg-sky-600 text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>

            </div>

            {/* Center Column: Freestanding High-Res Batimove Mover with Official Cartons */}
            <div className="md:col-span-2 lg:col-span-6 flex justify-center items-center order-1 lg:order-2 my-6 lg:my-0">
              <div className="relative w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px]">
                {/* Subtle soft ambient backglow */}
                <div className="absolute inset-0 bg-sky-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />

                <img
                  src="/toujours-prets-mover.png"
                  alt="Déménageur Batimove officiel avec cartons de déménagement"
                  className="w-full h-auto object-contain block select-none mx-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.07)]"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Column (2 Services) */}
            <div className="lg:col-span-3 space-y-12 sm:space-y-16 text-center order-3 lg:order-3">
              
              {/* Service 3: Transfert d'Entreprise */}
              <div className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50/70">
                <Link to="/services?type=entreprise" className="transform group-hover:scale-110 transition-transform duration-300 block">
                  <WarehouseShelfIcon className="w-16 h-16 mx-auto mb-4" />
                </Link>
                <Link to="/services?type=entreprise">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#0B1E33] mb-3 group-hover:text-sky-600 transition-colors">
                    Transfert d'Entreprise & Bureaux
                  </h3>
                </Link>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-4">
                  Déménagement de parcs informatiques, archives et open-spaces le week-end sans aucune coupure d'activité.
                </p>
                <Link
                  to="/services?type=entreprise"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B1E33] hover:text-sky-600 transition-colors group/link"
                >
                  <span>En Savoir Plus</span>
                  <span className="w-5 h-5 rounded-full bg-[#0B1E33] group-hover/link:bg-sky-600 text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>

              {/* Service 4: Petits Volumes & Express */}
              <div className="group flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-slate-50/70">
                <Link to="/services?type=prive" className="transform group-hover:scale-110 transition-transform duration-300 block">
                  <LocationParcelIcon className="w-16 h-16 mx-auto mb-4" />
                </Link>
                <Link to="/services?type=prive">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-[#0B1E33] mb-3 group-hover:text-sky-600 transition-colors">
                    Petits Volumes & Transports Express
                  </h3>
                </Link>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto mb-4">
                  Transport de meubles spécifiques, enlèvement d'achats volumineux et interventions urgentes en Romandie.
                </p>
                <Link
                  to="/services?type=prive"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B1E33] hover:text-sky-600 transition-colors group/link"
                >
                  <span>En Savoir Plus</span>
                  <span className="w-5 h-5 rounded-full bg-[#0B1E33] group-hover/link:bg-sky-600 text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: "SERVICES COMPLÉMENTAIRES" ("ADDITIONAL SERVICES")
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-[#0B1E33] text-white relative overflow-hidden">
        {/* Dark Background Overlay with subtle texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sky-400 font-bold tracking-widest text-xs uppercase font-display mb-2 block">
              PRESTATIONS SUR MESURE
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Services Complémentaires
            </h2>
          </div>

          {/* 4 Cards Matching Reference with Identical Duotone Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Logistic Services */}
            <div className="bg-[#071727] hover:bg-[#0a1e34] border border-sky-500/20 hover:border-sky-400/50 p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center justify-between group hover:-translate-y-1.5 shadow-xl">
              <div>
                <div className="w-20 h-20 flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                  <LogisticServicesPlaneIcon className="w-18 h-18" />
                </div>
                <h3 className="font-display text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors mb-3">
                  Services Logistiques
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Fret aérien, formalités de douane suisses et garde-meubles sous haute sécurité pour particuliers et entreprises.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky-400 transition-colors group/link"
              >
                <span>En Savoir Plus</span>
                <span className="w-5 h-5 rounded-full bg-white group-hover/link:bg-sky-400 text-[#0B1E33] flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Card 2: Car Shipping */}
            <div className="bg-[#071727] hover:bg-[#0a1e34] border border-sky-500/20 hover:border-sky-400/50 p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center justify-between group hover:-translate-y-1.5 shadow-xl">
              <div>
                <div className="w-20 h-20 flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                  <CarShippingTruckIcon className="w-18 h-18" />
                </div>
                <h3 className="font-display text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors mb-3">
                  Transport de Véhicules
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Acheminement sécurisé de voitures, motos et flottes d'entreprise dans toute la Suisse et l'Europe.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky-400 transition-colors group/link"
              >
                <span>En Savoir Plus</span>
                <span className="w-5 h-5 rounded-full bg-white group-hover/link:bg-sky-400 text-[#0B1E33] flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Card 3: Furniture Shipping */}
            <div className="bg-[#071727] hover:bg-[#0a1e34] border border-sky-500/20 hover:border-sky-400/50 p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center justify-between group hover:-translate-y-1.5 shadow-xl">
              <div>
                <div className="w-20 h-20 flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                  <FurnitureShippingShipIcon className="w-18 h-18" />
                </div>
                <h3 className="font-display text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors mb-3">
                  Transport de Mobilier
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Manutention experte de mobilier volumineux, monte-meubles extérieur et fret maritime pour vos relocalisations.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky-400 transition-colors group/link"
              >
                <span>En Savoir Plus</span>
                <span className="w-5 h-5 rounded-full bg-white group-hover/link:bg-sky-400 text-[#0B1E33] flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Card 4: Fastest Shipping */}
            <div className="bg-[#071727] hover:bg-[#0a1e34] border border-sky-500/20 hover:border-sky-400/50 p-8 rounded-2xl transition-all duration-300 flex flex-col items-center text-center justify-between group hover:-translate-y-1.5 shadow-xl">
              <div>
                <div className="w-20 h-20 flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                  <FastestShippingClockIcon className="w-18 h-18" />
                </div>
                <h3 className="font-display text-xl font-bold text-sky-400 group-hover:text-sky-300 transition-colors mb-3">
                  Livraisons Express
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Interventions d'urgence 24/7, transport de petits volumes et livraisons express sous délais stricts garantis.
                </p>
              </div>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-sky-400 transition-colors group/link"
              >
                <span>En Savoir Plus</span>
                <span className="w-5 h-5 rounded-full bg-white group-hover/link:bg-sky-400 text-[#0B1E33] flex items-center justify-center transition-colors">
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 7: "NOUS EMBALLONS TOUT AVEC SOIN" ("WE CAN PACK EVERYTHING")
          ========================================================================= */}
      {/* =========================================================================
          SECTION 7: "NOUS EMBALLONS TOUT AVEC SOIN" ("WE CAN PACK EVERYTHING")
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Freestanding High-Res Mover with Clipboard & Batimove Boxes (Image 2) */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-[480px] sm:max-w-[520px] lg:max-w-[560px]">
                {/* Subtle soft ambient backglow */}
                <div className="absolute inset-0 bg-sky-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

                <img
                  src="/emballage-mover.png"
                  alt="Déménageur Batimove avec liste d'inventaire et cartons de déménagement officiels"
                  className="w-full h-auto object-contain block select-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.07)]"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right: Content & 2x2 Services Grid Matching Reference Image 2 */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-3 block">
                EMBALLAGE PROFESSIONNEL
              </span>
              
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight leading-[1.12] mb-6">
                Nous Emballons Tout avec le Plus Grand Soin
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8">
                L'emballage constitue la clé d'un déménagement sans accroc. Nos techniciens utilisent des techniques éprouvées et des fournitures professionnelles renforcées pour chaque type d'objet.
              </p>

              {/* 2x2 Grid: 3 Service Cards + 1 Action / CTA Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
                
                {/* 1: Packing & Unpacking */}
                <div className="bg-[#f0f9ff] border border-sky-100/80 p-6 rounded-2xl flex items-start gap-4 transition-all duration-300 hover:shadow-md hover:border-sky-300">
                  <div className="shrink-0 mt-0.5">
                    <PackingUnpackingIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                      Emballage & Déballage
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Caisses alvéolées et papier bulle anti-choc pour verres, vaisselle et objets fragiles.
                    </p>
                  </div>
                </div>

                {/* 2: Storage Services */}
                <div className="bg-[#f0f9ff] border border-sky-100/80 p-6 rounded-2xl flex items-start gap-4 transition-all duration-300 hover:shadow-md hover:border-sky-300">
                  <div className="shrink-0 mt-0.5">
                    <StorageClipboardIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                      Garde-Meubles & Stockage
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Inventaire complet avec contrôle d'état et stockage sécurisé sous scellés à Genève.
                    </p>
                  </div>
                </div>

                {/* 3: Assurance Services */}
                <div className="bg-[#f0f9ff] border border-sky-100/80 p-6 rounded-2xl flex items-start gap-4 transition-all duration-300 hover:shadow-md hover:border-sky-300">
                  <div className="shrink-0 mt-0.5">
                    <AssuranceUmbrellaIcon className="w-12 h-12" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-[#0B1E33] text-base mb-1.5">
                      Assurance Tous Risques
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Couverture intégrale All-Risk jusqu'à 5M CHF incluse pour une tranquillité totale.
                    </p>
                  </div>
                </div>

                {/* 4: Action Slot (Short text + Button as in Reference) */}
                <div className="p-6 rounded-2xl flex flex-col justify-between items-start bg-slate-50/50 border border-slate-100">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    Estimez votre matériel et commandez vos fournitures suisses certifiées en quelques clics.
                  </p>
                  <Link to="/calculator" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-[#0B1E33] hover:bg-[#132c48] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all">
                      Calculer mes Cartons
                    </Button>
                  </Link>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: "CE QUE DISENT NOS CLIENTS" ("WHAT OUR CLIENT SAYS")
          ========================================================================= */}
      <section className="py-20 lg:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-2 block">
              TÉMOIGNAGES CLIENTS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1E33] tracking-tight">
              Ce Que Disent Nos Clients
            </h2>
          </div>

          {/* 3 Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                className="bg-slate-50/80 hover:bg-white p-8 rounded-3xl border border-slate-200/80 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/60">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#0B1E33]">{t.name}</h4>
                    <div className="text-[11px] text-slate-500 font-medium">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Pagination Dots */}
          <div className="flex justify-center items-center gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className={`h-2.5 rounded-full transition-all ${
                  activeTestimonial === i ? 'w-8 bg-[#0B1E33]' : 'w-2.5 bg-slate-300'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 9: BANDEAU PROMOTIONNEL ("HAVE A PLAN TO MOVE?")
          ========================================================================= */}
      <section className="bg-[#07182b] text-white relative z-20 overflow-visible shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-7 sm:py-8 lg:py-9">
            
            {/* Left: Text & CTA with site's red button */}
            <div className="md:col-span-7 lg:col-span-7 z-10">
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2.5">
                Vous Avez un Projet de Déménagement ?
              </h2>
              <p className="text-sky-300 text-base sm:text-lg lg:text-xl font-medium mb-1.5">
                Bénéficiez de jusqu'à 20% de réduction pour toute réservation ce mois-ci !
              </p>
              <p className="text-slate-400 text-xs sm:text-sm font-normal mb-6">
                Offre promotionnelle valable ce mois-ci. Conditions générales applicables.
              </p>
              <Link to="/quote">
                <Button className="bg-batimove-red hover:bg-[#c00500] text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-xl shadow-red-900/40 hover:shadow-red-500/50 transition-all hover:scale-105 border-none">
                  Réserver Mon Déménagement
                </Button>
              </Link>
            </div>

            {/* Spacer for MD/LG desktop grid */}
            <div className="hidden md:block md:col-span-5 lg:col-span-5" />

            {/* Mobile Mover */}
            <div className="md:hidden flex justify-center items-end mt-6 -mb-7">
              <img
                src="/plan-to-move-boxes-mover.png"
                alt="Déménageur professionnel Batimove avec cartons et devis"
                className="h-[250px] sm:h-[280px] w-auto object-contain object-bottom select-none drop-shadow-xl"
              />
            </div>

          </div>

          {/* Desktop/Tablet Mover with Head Pop-out into White Section */}
          <div className="hidden md:flex absolute bottom-0 right-2 sm:right-6 lg:right-10 xl:right-16 items-end pointer-events-none z-30">
            <img
              src="/plan-to-move-boxes-mover.png"
              alt="Déménageur professionnel Batimove avec cartons et devis"
              className="h-[330px] md:h-[360px] lg:h-[400px] xl:h-[430px] w-auto object-contain object-bottom select-none drop-shadow-2xl"
            />
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 10: "NOS DERNIERS ARTICLES & GUIDES" ("OUR LATEST POST")
          ========================================================================= */}
      <section className="py-12 sm:py-14 lg:py-16 bg-[#f8fafc] border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">
            <span className="text-sky-600 font-bold tracking-widest text-xs uppercase font-display mb-2 block">
              CONSEILS & ACTUALITÉS
            </span>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1E33] tracking-tight">
              Nos Derniers Articles & Guides
            </h2>
          </div>

          {/* 3 Article Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Post 1 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="relative w-full aspect-[1024/853] overflow-hidden bg-slate-100">
                  <img
                    src="/article-checklist-demenagement.jpg"
                    alt="Checklist déménagement suisse - Équipe Batimove"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#0B1E33]/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    Guide Pratique
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="text-xs text-slate-400 font-semibold mb-2">12 Mars 2026 • 5 min de lecture</div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#0B1E33] mb-2.5 group-hover:text-sky-600 transition-colors leading-snug">
                    Checklist Déménagement en Suisse : le Guide Ultime de A à Z
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Démarches administratives, régies, changement d'adresse et calendrier précis pour déménager sereinement en Suisse.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <Link to="/services" className="text-xs font-bold text-[#0B1E33] group-hover:text-sky-600 transition-colors flex items-center gap-1 uppercase tracking-wider">
                  <span>Lire l'article</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                </Link>
              </div>
            </div>

            {/* Post 2 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="relative w-full aspect-[1024/853] overflow-hidden bg-slate-100">
                  <img
                    src="/article-etat-des-lieux.jpg"
                    alt="Transport et état des lieux régie suisse - Batimove"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#0B1E33]/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    État des Lieux
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="text-xs text-slate-400 font-semibold mb-2">08 Mars 2026 • 4 min de lecture</div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#0B1E33] mb-2.5 group-hover:text-sky-600 transition-colors leading-snug">
                    Réussir son État des Lieux et Récupérer sa Garantie de Loyer
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Ce que les régies suisses inspectent en priorité lors de la remise des clés et les pièges fréquents à éviter.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <Link to="/services" className="text-xs font-bold text-[#0B1E33] group-hover:text-sky-600 transition-colors flex items-center gap-1 uppercase tracking-wider">
                  <span>Lire l'article</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                </Link>
              </div>
            </div>

            {/* Post 3 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="relative w-full aspect-[1024/853] overflow-hidden bg-slate-100">
                  <img
                    src="/article-emballage-fragile.jpg"
                    alt="Emballage objets fragiles et mobilier avec adhésif - Batimove"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-[#0B1E33]/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    Sécurité & Emballage
                  </span>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="text-xs text-slate-400 font-semibold mb-2">27 Février 2026 • 6 min de lecture</div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[#0B1E33] mb-2.5 group-hover:text-sky-600 transition-colors leading-snug">
                    Comment Emballer Vos Objets Fragiles et Tableaux de Valeur
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    Les secrets de nos déménageurs pour sécuriser vaisselle ancienne, lustres délicats et matériel informatique précieux.
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <Link to="/services" className="text-xs font-bold text-[#0B1E33] group-hover:text-sky-600 transition-colors flex items-center gap-1 uppercase tracking-wider">
                  <span>Lire l'article</span>
                  <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
export default Home;
