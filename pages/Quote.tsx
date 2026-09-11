import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  ChevronRight,
  MessageSquare,
  Lock,
  Phone,
  Home,
  Building2,
  Trash2,
  Sparkles,
  Loader2,
  ShieldCheck,
  Clock,
  Star,
  ExternalLink
} from 'lucide-react';
import { Button } from '../components/UIComponents';
import { submitServiceQuote } from '../services/api';
import { trackGoogleAdsLeadConversion } from '../utils/analytics';

const WhatsappIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 2c-5.508 0-9.985 4.477-9.985 9.985 0 1.761.459 3.477 1.332 4.992L2 22l5.16-1.354c1.465.799 3.119 1.223 4.871 1.223 5.508 0 9.985-4.477 9.985-9.985S17.539 2 12.031 2zm5.836 14.186c-.244.686-1.423 1.309-1.97 1.393-.524.08-1.207.114-1.956-.124-.48-.152-1.099-.356-1.895-.7-3.332-1.442-5.5-4.819-5.666-5.041-.166-.222-1.353-1.8-1.353-3.433s.853-2.437 1.156-2.769c.303-.332.66-.415.88-.415.22 0 .44.002.633.012.203.01.475-.077.744.569.278.666.948 2.31.948 2.31s.087.178.02.378c-.068.2-.102.324-.204.444-.102.12-.214.268-.306.36-.102.102-.208.213-.09.415.118.202.524.864 1.124 1.398.772.688 1.422.9 1.624.99.202.09.32.078.438-.058.118-.136.507-.589.642-.791.135-.202.27-.168.455-.101.185.067 1.173.553 1.375.654.202.101.337.152.388.236.051.084.051.49-.193 1.176z"/>
  </svg>
);

interface ServiceItem {
  id: string;
  number: number;
  name: string;
  shortName: string;
  subtitle: string;
  tags: string[];
  icon: React.FC<{ className?: string }>;
  image: string;
}

const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'prive',
    number: 1,
    name: "Déménagement Résidentiel",
    shortName: "Résidentiel",
    subtitle: "Prestation complète pour votre déménagement à domicile.",
    tags: ["Emballage sur-mesure", "Démontage", "Garantie RC 5M"],
    icon: Home,
    image: "/service-residential-3d.png"
  },
  {
    id: 'entreprise',
    number: 2,
    name: "Transfert d'Entreprise & Bureaux",
    shortName: "Entreprise",
    subtitle: "Déménagement professionnel clé en main.",
    tags: ["Planification", "Zéro interruption"],
    icon: Building2,
    image: "/service-b2b-3d.png"
  },
  {
    id: 'debarras',
    number: 3,
    name: "Débarras Professionnel & Écologique",
    shortName: "Débarras",
    subtitle: "Valorisation et tri sélectif des biens.",
    tags: ["Écoresponsable", "Certifié"],
    icon: Trash2,
    image: "/service-debarras-3d.png"
  },
  {
    id: 'nettoyage',
    number: 4,
    name: "Nettoyage État des Lieux",
    shortName: "Nettoyage",
    subtitle: "Nettoyage professionnel conforme régies.",
    tags: ["État des lieux", "Clés en main"],
    icon: Sparkles,
    image: "/service-cleaning-3d.png"
  }
];

export const Quote: React.FC = () => {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();

  // Determine initial service based on URL params
  const getInitialService = () => {
    const rawId = serviceId || searchParams.get('type') || '';
    if (rawId === 'pro' || rawId === 'entreprise' || rawId === 'business') return 'entreprise';
    if (rawId === 'clean' || rawId === 'nettoyage') return 'nettoyage';
    if (rawId === 'debarras') return 'debarras';
    return 'prive';
  };

  const [selectedServiceId, setSelectedServiceId] = useState<string>(getInitialService);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    fromCity: searchParams.get('from') || '',
    toCity: searchParams.get('to') || '',
    details: ''
  });

  const [sendWhatsAppCopy, setSendWhatsAppCopy] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmittedWhatsAppUrl, setLastSubmittedWhatsAppUrl] = useState('');

  const currentService = SERVICES_DATA.find(s => s.id === selectedServiceId) || SERVICES_DATA[0];
  const CurrentIcon = currentService.icon;

  useEffect(() => {
    const matched = getInitialService();
    if (matched) setSelectedServiceId(matched);
  }, [serviceId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const buildWhatsAppUrl = (data: typeof formData, serviceName: string) => {
    const text = [
      `Bonjour Batimove Sàrl, je souhaite recevoir un devis rapide :`,
      `• Prestation : ${serviceName}`,
      `• Nom : ${data.name}`,
      `• Téléphone : ${data.phone}`,
      data.email ? `• Email : ${data.email}` : '',
      data.date ? `• Date souhaitée : ${data.date}` : '',
      (data.fromCity || data.toCity) ? `• Trajet : ${data.fromCity || 'Genève'} ➔ ${data.toCity || 'Genève'}` : '',
      data.details ? `• Précisions : ${data.details}` : ''
    ].filter(Boolean).join('\n');

    return `https://wa.me/41800825925?text=${encodeURIComponent(text)}`;
  };

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMessage('Veuillez renseigner au moins votre nom et votre numéro de téléphone.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const waUrl = buildWhatsAppUrl(formData, currentService.name);
    setLastSubmittedWhatsAppUrl(waUrl);

    try {
      // 1. Send via EmailJS to info@batimove.ch
      await submitServiceQuote({
        serviceName: currentService.name,
        clientName: formData.name,
        clientEmail: formData.email || 'Non renseigné',
        clientPhone: formData.phone,
        date: formData.date,
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        details: formData.details
      });

      // Track conversion
      trackGoogleAdsLeadConversion();

      // 2. If WhatsApp copy requested, open in new tab
      if (sendWhatsAppCopy) {
        window.open(waUrl, '_blank');
      }

      setIsSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        fromCity: '',
        toCity: '',
        details: ''
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou contacter notre hotline au 0800 825 925.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100dvh-98px)] lg:h-[calc(100dvh-98px)] lg:max-h-[calc(100dvh-98px)] bg-[#FAFBFD] text-slate-900 flex flex-col justify-between relative overflow-y-auto lg:overflow-hidden font-sans">
      
      {/* Subtle Ambient Studio Lights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-sky-100/35 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-slate-100/60 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Centered Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 flex-1 flex flex-col justify-center relative z-10 my-auto">

        {/* 2-COLUMN LUXURY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center w-full flex-1 min-h-0">

          {/* LEFT COLUMN: EDITORIAL LUXURY HEADER + NUMBERED SERVICE CARDS (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Editorial Header */}
            <div className="mb-4 sm:mb-5 flex-shrink-0">
              <div className="text-[10px] tracking-[0.18em] font-bold text-sky-700 uppercase mb-1.5 flex items-center gap-2">
                <span>GENÈVE</span>
                <span className="text-slate-300">•</span>
                <span>VAUD</span>
                <span className="text-slate-300">•</span>
                <span>LAUSANNE</span>
                <span className="text-slate-300">•</span>
                <span>SUISSE ROMANDE</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0B1E33] tracking-tight leading-[1.1]">
                Demandez Votre Devis Gratuit<br />
                & Sans Engagement
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-normal leading-relaxed max-w-lg">
                Complétez votre demande en 30 secondes. Notre équipe calcule votre devis ferme sous 2 heures ouvrées.
              </p>
            </div>

            {/* 4 Numbered Service Cards */}
            <div className="space-y-3">
              {SERVICES_DATA.map((service) => {
                const isSelected = selectedServiceId === service.id;

                return (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setIsSuccess(false);
                    }}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer group relative ${
                      isSelected
                        ? 'bg-white border-[1.5px] border-[#0B1E33] shadow-[0_14px_36px_-8px_rgba(11,30,51,0.09),0_1px_3px_rgba(0,0,0,0.03)] ring-4 ring-[#0B1E33]/5'
                        : 'bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                    }`}
                  >
                    {/* Left: Checkmark Circle + Number + Content */}
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      {/* Checkmark Circle + Number */}
                      <div className="flex items-center gap-2 shrink-0 mt-0.5">
                        <div className="w-5 h-5 rounded-full bg-[#0B1E33] text-white flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-sm sm:text-base font-bold text-[#0B1E33] font-mono leading-none">
                          {service.number}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xs sm:text-sm font-bold text-[#0B1E33] truncate">
                          {service.name}
                        </h2>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                          {service.subtitle}
                        </p>

                        {/* Pill Tags */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {service.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-2.5 py-0.5 rounded-full font-medium bg-white text-slate-600 border border-slate-200/90 shadow-2xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Transparent 3D Render Image when selected (or Chevron) */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.25 }}
                          className="hidden sm:flex items-center justify-center w-28 sm:w-36 h-14 sm:h-16"
                        >
                          <img
                            src={service.image}
                            alt={service.name}
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]"
                          />
                        </motion.div>
                      ) : null}
                      
                      <div className="w-6 h-6 flex items-center justify-center">
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                          isSelected ? 'text-[#0B1E33] translate-x-0.5' : 'text-slate-300 group-hover:text-slate-500'
                        }`} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Swiss Trust Pillars */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Assurance RC Pro 5M CHF</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Devis fixe sans frais cachés</span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5 text-amber-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>98% satisfaction</span>
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: THE $50K LUXURY MODAL (5 COLS) */}
          <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(11,30,51,0.08),0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between text-slate-900 relative backdrop-blur-xl">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/70 flex items-center justify-center text-emerald-700 shrink-0 shadow-xs">
                    <MessageSquare className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B1E33] text-sm sm:text-[15px] leading-tight">
                      Demande de devis confidentiel
                    </h3>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 bg-slate-100/90 border border-slate-200/70 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Réponse sous 2h
                </span>
              </div>

              {/* Selected Service Pill */}
              <div className="my-3.5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-semibold shadow-2xs">
                  <CurrentIcon className="w-4 h-4 text-emerald-700" />
                  <span>{currentService.shortName}</span>
                </div>
              </div>

              {/* Form or Success State */}
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center space-y-3"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-sm">
                      <Check className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0B1E33] text-base">
                        Devis transmis avec succès !
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                        Votre dossier concernant la prestation <strong>{currentService.name}</strong> a été envoyé directement à <strong>info@batimove.ch</strong>.
                      </p>
                    </div>

                    {/* Dual Action on Success: Direct WhatsApp Button */}
                    <div className="pt-2 space-y-2 max-w-xs mx-auto">
                      <a
                        href={lastSubmittedWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#128C7E] hover:bg-[#0e7467] text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-[0_4px_14px_rgba(18,140,126,0.25)] flex items-center justify-center gap-2"
                      >
                        <img src="/whatsapp-3d-luxury.png" alt="" className="w-4 h-4 object-contain" />
                        <span>Ouvrir sur WhatsApp (Réponse &lt; 5 min)</span>
                      </a>
                      
                      <Button
                        onClick={() => setIsSuccess(false)}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-[#0B1E33] text-xs py-2.5 rounded-xl border border-slate-300 cursor-pointer font-semibold transition-all"
                      >
                        Nouvelle demande
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmitQuote}
                    className="space-y-3"
                  >
                    {/* Error Message */}
                    {errorMessage && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
                        {errorMessage}
                      </div>
                    )}

                    {/* Row 1: NOM & TÉLÉPHONE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-700 block mb-1">
                          NOM
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          placeholder="Votre nom"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="h-10 sm:h-11 w-full bg-[#F8FAFC]/90 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0B1E33] focus:ring-4 focus:ring-[#0B1E33]/5 rounded-xl px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-700 block mb-1">
                          TÉLÉPHONE
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          placeholder="+41"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="h-10 sm:h-11 w-full bg-[#F8FAFC]/90 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0B1E33] focus:ring-4 focus:ring-[#0B1E33]/5 rounded-xl px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Row 2: EMAIL & DATE SOUHAITÉE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-700 block mb-1">
                          EMAIL
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="votre@email.ch"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="h-10 sm:h-11 w-full bg-[#F8FAFC]/90 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0B1E33] focus:ring-4 focus:ring-[#0B1E33]/5 rounded-xl px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-700 block mb-1">
                          DATE SOUHAITÉE
                        </label>
                        <input
                          type="text"
                          name="date"
                          placeholder="jj.mm.aaaa"
                          value={formData.date}
                          onChange={handleInputChange}
                          className="h-10 sm:h-11 w-full bg-[#F8FAFC]/90 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0B1E33] focus:ring-4 focus:ring-[#0B1E33]/5 rounded-xl px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Row 3: VILLE DÉPART & VILLE ARRIVÉE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-700 block mb-1">
                          VILLE DÉPART
                        </label>
                        <input
                          type="text"
                          name="fromCity"
                          placeholder="Ex. Genève"
                          value={formData.fromCity}
                          onChange={handleInputChange}
                          className="h-10 sm:h-11 w-full bg-[#F8FAFC]/90 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0B1E33] focus:ring-4 focus:ring-[#0B1E33]/5 rounded-xl px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-700 block mb-1">
                          VILLE ARRIVÉE
                        </label>
                        <input
                          type="text"
                          name="toCity"
                          placeholder="Ex. Lausanne"
                          value={formData.toCity}
                          onChange={handleInputChange}
                          className="h-10 sm:h-11 w-full bg-[#F8FAFC]/90 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0B1E33] focus:ring-4 focus:ring-[#0B1E33]/5 rounded-xl px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                        />
                      </div>
                    </div>

                    {/* Row 4: PRÉCISIONS (OPTIONNEL) */}
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-bold text-slate-700 block mb-1">
                        PRÉCISIONS (OPTIONNEL)
                      </label>
                      <input
                        type="text"
                        name="details"
                        placeholder="Vos besoins spécifiques, volume, étage, ascenseur..."
                        value={formData.details}
                        onChange={handleInputChange}
                        className="h-10 sm:h-11 w-full bg-[#F8FAFC]/90 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#0B1E33] focus:ring-4 focus:ring-[#0B1E33]/5 rounded-xl px-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200"
                      />
                    </div>

                    {/* WhatsApp Sync Option */}
                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-600 hover:text-slate-900 transition-colors">
                        <input
                          type="checkbox"
                          checked={sendWhatsAppCopy}
                          onChange={(e) => setSendWhatsAppCopy(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="flex items-center gap-1.5">
                          <WhatsappIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Envoyer également sur WhatsApp (réponse &lt; 5 min)</span>
                        </span>
                      </label>
                    </div>

                    {/* CTA Button ($50k Apple/Stripe Tactile Polish) */}
                    <div className="pt-1.5">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#D90429] hover:bg-[#c00322] active:scale-[0.99] text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_10px_25px_-5px_rgba(217,4,41,0.35),inset_0_1px_0_0_rgba(255,255,255,0.2)] transition-all cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Transmission à Batimove...</span>
                          </>
                        ) : (
                          <>
                            <span>Demander mon devis gratuit</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                      <div className="text-center text-[11px] text-slate-500 mt-2.5 flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Transmis à info@batimove.ch • Réponse sous 2h</span>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>

      {/* Pristine Light Bottom Bar */}
      <div className="w-full border-t border-slate-200/80 bg-white/95 backdrop-blur-md py-2.5 px-4 flex-shrink-0 text-[11px] text-slate-500 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>🇨🇭 Batimove Sàrl • Entreprise agréée RC Pro 5M CHF • Genève, Vaud, Fribourg, Valais</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <a href="tel:0800825925" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-sky-600" />
              Hotline: 0800 825 925
            </a>
            <span className="text-slate-300">•</span>
            <Link to="/calculator" className="hover:text-slate-900 text-sky-700 transition-colors">Calculateur de volume</Link>
          </div>
        </div>
      </div>

    </div>
  );
};