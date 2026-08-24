import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuoteData, ServiceId } from '../types';
import { Button, Logo } from '../components/UIComponents';
import {
  Check, ChevronLeft, ChevronRight, X, Minus, Plus,
  Building2, Home, Briefcase, Factory,
  Box, Warehouse, Calendar as CalendarIcon, Info, MapPin,
  CreditCard, User, Mail, Phone, ShieldCheck, ArrowRight,
  CalendarClock, CalendarDays, CheckCircle2
} from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { trackGoogleAdsLeadConversion } from '../utils/analytics';

// --- CONFIGURATION ---
const SERVICE_CONFIG: Record<string, {
  title: string;
  subtitle: string;
  image: string;
  steps: string[];
}> = {
  priv: {
    title: "Déménagement Privé",
    subtitle: "Nouvelle résidence",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    steps: ["Le Bien", "Le Volume", "Le Trajet", "Vos Coordonnées"]
  },
  pro: {
    title: "Transfert Pro",
    subtitle: "Business Solution",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    steps: ["Lieu", "Taille", "Logistique", "Vos Coordonnées"]
  },
  clean: {
    title: "Nettoyage",
    subtitle: "État des lieux",
    image: "https://images.unsplash.com/photo-1581578731117-104f8a3d31a2?q=80&w=2070&auto=format&fit=crop",
    steps: ["Surface", "Date", "Vos Coordonnées"]
  },
  storage: {
    title: "Garde-Meubles",
    subtitle: "Stockage sécurisé",
    image: "https://images.unsplash.com/photo-1590247813693-5541d1c609fd?q=80&w=2009&auto=format&fit=crop",
    steps: ["Volume", "Durée", "Vos Coordonnées"]
  },
  lift: {
    title: "Monte-Meubles",
    subtitle: "Accès difficile",
    image: "https://images.unsplash.com/photo-1574359411659-15573a27fd0c?q=80&w=2069&auto=format&fit=crop",
    steps: ["Étage", "Date", "Vos Coordonnées"]
  },
  inter: {
    title: "International",
    subtitle: "Relocation",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop",
    steps: ["Projet", "Date", "Vos Coordonnées"]
  },
  general: {
    title: "Sur Mesure",
    subtitle: "Projet spécial",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
    steps: ["Description", "Date", "Vos Coordonnées"]
  }
};

// --- HELPER: Custom Calendar Component ---
const CustomCalendar = ({ selectedDate, onChange }: { selectedDate: string, onChange: (date: string) => void }) => {
  const [viewDate, setViewDate] = useState(() => selectedDate ? new Date(selectedDate) : new Date());

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const daysShort = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());

  // Array of days to render
  const days = [];
  // Empty slots for days before start of month
  for (let i = 0; i < firstDay; i++) days.push(null);
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const s = new Date(selectedDate);
    return day === s.getDate() && viewDate.getMonth() === s.getMonth() && viewDate.getFullYear() === s.getFullYear();
  };

  const isPast = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const check = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return check < today;
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    // Format YYYY-MM-DD manually to avoid timezone issues
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(newDate.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${d}`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50 max-w-sm mx-auto animate-fade-in mt-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
        <span className="font-display font-bold text-slate-900 text-lg capitalize">
          {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><ChevronRight className="w-5 h-5" /></button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        {daysShort.map(d => (
          <span key={d} className="text-xs font-bold text-slate-400 uppercase tracking-wider">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          const selected = isSelected(day);
          const disabled = isPast(day);
          const today = isToday(day);

          return (
            <button
              key={day}
              onClick={() => !disabled && handleDayClick(day)}
              disabled={disabled}
              className={`
                h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                ${selected
                  ? 'bg-batimove-blue text-white shadow-lg shadow-blue-500/30 scale-105'
                  : disabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-batimove-blue'
                }
                ${today && !selected ? 'border border-batimove-blue text-batimove-blue' : ''}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  );
};

// --- LUXURY UI COMPONENTS (Moved outside Quote to prevent re-creation) ---
const LuxuryInput = ({ label, value, onChange, type = "text", placeholder, icon: Icon }: any) => {
  return (
    <div className="group">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full bg-white border border-slate-300 text-slate-900 px-5 py-4 min-h-[48px] rounded-xl outline-none focus:ring-4 focus:ring-batimove-blue/10 focus:border-batimove-blue hover:border-slate-400 transition-all font-medium placeholder:text-slate-400 shadow-sm"
          placeholder={placeholder}
        />
        {Icon && (
          <div className="absolute right-4 text-slate-400 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export const Quote: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();

  const currentServiceId: ServiceId = (serviceId && SERVICE_CONFIG[serviceId]) ? (serviceId as ServiceId) : 'general';
  const config = SERVICE_CONFIG[currentServiceId];

  // --- STATE WITH LOCAL STORAGE PERSISTENCE ---
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const initialState: QuoteData = {
    serviceId: currentServiceId,
    fromZip: '', toZip: '', date: '',
    volume: 30, rooms: 2.5,
    housingType: 'appartement', surface: 60,
    duration: 'moyen', floor: 2,
    contact: { name: '', email: '', phone: '' }
  };

  const [data, setData] = useState<QuoteData>(() => {
    try {
      const savedData = localStorage.getItem(`batimove_draft_${currentServiceId}`);
      return savedData ? JSON.parse(savedData) : initialState;
    } catch (e) {
      return initialState;
    }
  });

  const [logistics, setLogistics] = useState<string[]>([]);

  // Save to LocalStorage whenever data changes (debounced to avoid excessive writes)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(`batimove_draft_${currentServiceId}`, JSON.stringify(data));
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [data, currentServiceId]);

  // --- HELPERS (useCallback to prevent re-creation) ---
  const updateData = useCallback((key: keyof QuoteData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  }, []);

  // Special handler for contact fields to prevent object recreation
  const updateContactField = useCallback((field: 'name' | 'email' | 'phone', value: string) => {
    setData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  }, []);

  const toggleLogistic = useCallback((item: string) => {
    setLogistics(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  }, []);

  const handleDateChange = useCallback((val: string) => {
    updateData('date', val);
  }, [updateData]);

  // --- VALIDATION LOGIC ---
  const canProceed = () => {
    if (currentStep === config.steps.length - 1) {
      return data.contact.name.length > 2 && data.contact.email.includes('@') && data.contact.phone.length > 5;
    }

    switch (currentServiceId) {
      case 'priv':
        if (currentStep === 2) return data.fromZip?.length! >= 4 && data.toZip?.length! >= 4 && data.date.length > 0;
        break;
      case 'pro':
        if (currentStep === 2) return data.date.length > 0;
        break;
      case 'clean':
        if (currentStep === 1) return data.date.length > 0;
        break;
      case 'storage':
        if (currentStep === 1) return data.date.length > 0 || !!data.duration;
        break;
      case 'lift':
        if (currentStep === 1) return data.date.length > 0;
        break;
      case 'general':
      case 'inter':
        if (currentStep === 1) return data.date.length > 0;
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (canProceed()) {
      setCurrentStep(prev => Math.min(prev + 1, config.steps.length - 1));
    }
  };

  const prevStep = () => currentStep === 0 ? navigate('/services') : setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleFinish = async () => {
    if (!canProceed() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Import API service
      const { submitQuote } = await import('../services/api');

      // Submit to backend
      const response = await submitQuote(data);

      // Track Google Ads Lead Conversion ONLY on confirmed API success
      trackGoogleAdsLeadConversion({
        leadId: response?.quoteId,
      });

      // Clear storage on success
      localStorage.removeItem(`batimove_draft_${currentServiceId}`);
      setIsSuccess(true);

      // Optional: Auto redirect after few seconds
      setTimeout(() => navigate('/'), 8000);
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LUXURY UI COMPONENTS (Light/Elegant) ---

  const LuxuryTile = ({ label, subLabel, icon: Icon, selected, onClick }: any) => (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`relative w-full text-left p-6 rounded-2xl border transition-all duration-300 group flex items-start gap-4 shadow-sm ${selected
        ? 'bg-white border-batimove-blue shadow-xl shadow-blue-900/10 ring-1 ring-batimove-blue'
        : 'bg-white border-slate-300 hover:border-slate-400 hover:shadow-lg hover:shadow-slate-200/50'
        }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${selected ? 'bg-batimove-blue text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-slate-100'
        }`}>
        {Icon ? <Icon className="w-6 h-6" /> : <Box className="w-6 h-6" />}
      </div>
      <div className="flex-1">
        <h3 className={`font-display font-bold text-lg mb-1 ${selected ? 'text-batimove-blue' : 'text-slate-900'}`}>{label}</h3>
        <p className="text-sm text-slate-500 font-medium">{subLabel}</p>
      </div>
      {selected && (
        <div className="absolute top-6 right-6 w-6 h-6 rounded-full bg-batimove-blue text-white flex items-center justify-center shadow-lg">
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </div>
      )}
    </motion.button>
  );

  const LuxurySlider = ({ label, value, min, max, unit, onChange, step = 1 }: any) => {
    const percentage = ((value - min) / (max - min)) * 100;
    return (
      <div className="bg-white rounded-2xl border border-slate-300 p-8 shadow-sm">
        <div className="flex justify-between items-end mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
          <div className="flex items-baseline gap-1 text-slate-900">
            <span className="font-display text-5xl font-bold tracking-tighter">{value}</span>
            <span className="text-lg text-slate-400 font-medium">{unit}</span>
          </div>
        </div>

        <div className="relative h-2 bg-slate-100 rounded-full w-full mb-6 cursor-pointer group">
          <div className="absolute top-0 left-0 h-full rounded-full bg-batimove-blue" style={{ width: `${percentage}%` }}></div>
          <input
            type="range"
            min={min} max={max} step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div
            className="absolute top-1/2 -mt-3.5 w-7 h-7 bg-white rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.15)] border-4 border-batimove-blue transition-transform group-hover:scale-110 pointer-events-none"
            style={{ left: `calc(${percentage}% - 14px)` }}
          ></div>
        </div>

        <div className="flex justify-between">
          <button onClick={() => onChange(Math.max(min, value - step))} className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"><Minus className="w-5 h-5" /></button>
          <button onClick={() => onChange(Math.min(max, value + step))} className="p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"><Plus className="w-5 h-5" /></button>
        </div>
      </div>
    );
  };

  const LuxuryDate = ({ value, onChange, label = "Date souhaitée" }: any) => {
    const isAsap = value === 'ASAP';
    const isEom = value === 'EOM';
    const isSpecific = value && value !== 'ASAP' && value !== 'EOM';

    const btnClass = "relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 gap-3 group h-32 w-full outline-none";
    const activeClass = "bg-white border-batimove-blue shadow-lg shadow-blue-900/10 ring-1 ring-batimove-blue";
    const inactiveClass = "bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50 shadow-sm";

    const handleSpecificClick = () => {
      if (!isSpecific) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        onChange(`${year}-${month}-${d}`);
      }
    };

    return (
      <div className="space-y-6">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button onClick={() => onChange("ASAP")} className={`${btnClass} ${isAsap ? activeClass : inactiveClass}`}>
            <CalendarClock className={`w-8 h-8 transition-colors ${isAsap ? 'text-batimove-blue' : 'text-slate-400 group-hover:text-batimove-blue'}`} />
            <span className={`font-bold text-sm ${isAsap ? 'text-batimove-blue' : 'text-slate-600'}`}>Dès que possible</span>
            {isAsap && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-batimove-blue"></div>}
          </button>

          <button onClick={() => onChange("EOM")} className={`${btnClass} ${isEom ? activeClass : inactiveClass}`}>
            <CalendarDays className={`w-8 h-8 transition-colors ${isEom ? 'text-batimove-blue' : 'text-slate-400 group-hover:text-batimove-blue'}`} />
            <span className={`font-bold text-sm ${isEom ? 'text-batimove-blue' : 'text-slate-600'}`}>Fin du mois</span>
            {isEom && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-batimove-blue"></div>}
          </button>

          <button onClick={handleSpecificClick} className={`${btnClass} ${isSpecific ? activeClass : inactiveClass}`}>
            <CalendarIcon className={`w-8 h-8 mb-3 transition-colors ${isSpecific ? 'text-batimove-blue' : 'text-slate-400 group-hover:text-batimove-blue'}`} />
            <div className="flex flex-col items-center">
              <span className={`font-bold text-sm ${isSpecific ? 'text-batimove-blue' : 'text-slate-600'}`}>Date précise</span>
              {isSpecific && (
                <span className="text-xs font-mono font-medium text-batimove-blue mt-1 bg-blue-50 px-2 py-0.5 rounded">{value}</span>
              )}
            </div>
            {isSpecific && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-batimove-blue"></div>}
          </button>
        </div>

        <AnimatePresence>
          {isSpecific && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="flex justify-center"><div className="w-0.5 h-6 bg-slate-200"></div></div>
              <CustomCalendar selectedDate={value} onChange={onChange} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // --- STEPS RENDERER ---
  const renderContent = () => {
    // SUCCESS STATE
    if (isSuccess) return (
      <div className="text-center py-12 animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-8 bg-green-50 rounded-full flex items-center justify-center shadow-xl shadow-green-100">
          <CheckCircle2 className="w-12 h-12 text-green-500" strokeWidth={2} />
        </div>
        <h2 className="font-display text-4xl font-bold text-slate-900 mb-4">Demande Reçue !</h2>
        <p className="text-slate-500 text-lg max-w-md mx-auto mb-8">
          Merci {data.contact.name}. Notre équipe d'experts analyse votre demande. Vous recevrez une estimation détaillée par email sous 24h.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button className="rounded-full px-8 py-4 bg-slate-900 text-white hover:bg-slate-800">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );

    // 1. CONTACT (Final Step)
    if (currentStep === config.steps.length - 1) return (
      <div className="space-y-8 w-full max-w-md mx-auto animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
            <ShieldCheck className="w-10 h-10 text-green-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 font-display">Dernière étape</h3>
          <p className="text-slate-500 text-sm">Vos données sont strictement confidentielles.</p>
        </div>

        <div className="space-y-5 bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100">
          <LuxuryInput label="Nom Complet" placeholder="Jean Dupont" value={data.contact.name} onChange={(e) => updateContactField('name', e.target.value)} icon={User} />
          <div className="space-y-5">
            <LuxuryInput label="Email" placeholder="nom@email.com" type="email" value={data.contact.email} onChange={(e) => updateContactField('email', e.target.value)} icon={Mail} />
            <LuxuryInput label="Téléphone" placeholder="+41 79 000 00 00" type="tel" value={data.contact.phone} onChange={(e) => updateContactField('phone', e.target.value)} icon={Phone} />
          </div>
        </div>

        <div className="flex gap-3 px-4">
          <Info className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            En cliquant sur "Terminer", vous acceptez d'être recontacté par Batimove pour affiner ce devis.
          </p>
        </div>
      </div>
    );

    // SERVICE SPECIFIC STEPS
    if (currentServiceId === 'priv') {
      if (currentStep === 0) return (
        <div className="grid grid-cols-1 gap-4 w-full max-w-lg mx-auto">
          <LuxuryTile label="Appartement" subLabel="Immeuble, Copropriété, Étage" icon={Building2} selected={data.housingType === 'appartement'} onClick={() => updateData('housingType', 'appartement')} />
          <LuxuryTile label="Maison" subLabel="Villa individuelle, Jumelée" icon={Home} selected={data.housingType === 'maison'} onClick={() => updateData('housingType', 'maison')} />
        </div>
      );
      if (currentStep === 1) return (
        <div className="w-full max-w-lg mx-auto space-y-8">
          <LuxurySlider label="Nombre de pièces" value={data.rooms} min={1} max={10} step={0.5} unit="pcs" onChange={(val: number) => updateData('rooms', val)} />
          <div className="bg-blue-50 rounded-xl p-5 flex items-center justify-between border border-blue-100">
            <span className="text-sm font-bold text-blue-800">Estimation Volume</span>
            <span className="text-xl font-bold text-batimove-blue">~ {Math.ceil(data.rooms! * 10)} m³</span>
          </div>
        </div>
      );
      if (currentStep === 2) return (
        <div className="space-y-8 w-full max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-6">
            <LuxuryInput label="NPA Départ" icon={MapPin} placeholder="1200" value={data.fromZip} onChange={(e: any) => updateData('fromZip', e.target.value)} />
            <LuxuryInput label="NPA Arrivée" icon={MapPin} placeholder="8000" value={data.toZip} onChange={(e: any) => updateData('toZip', e.target.value)} />
          </div>
          <LuxuryDate value={data.date} onChange={handleDateChange} />
        </div>
      );
    }
    // (Other services follow similar logic, condensed for brevity here as they match the pattern)
    if (currentServiceId === 'pro') {
      if (currentStep === 0) return (
        <div className="grid grid-cols-1 gap-4 w-full max-w-lg mx-auto">
          <LuxuryTile label="Bureaux" subLabel="Administratif, Open Space" icon={Briefcase} selected={data.housingType === 'bureau'} onClick={() => updateData('housingType', 'bureau')} />
          <LuxuryTile label="Commercial" subLabel="Stock, Magasin, Atelier" icon={Factory} selected={data.housingType === 'maison'} onClick={() => updateData('housingType', 'maison')} />
        </div>
      );
      if (currentStep === 1) return <div className="w-full max-w-lg mx-auto"><LuxurySlider label="Postes de Travail" value={data.rooms} min={1} max={100} step={1} unit="postes" onChange={(val: number) => updateData('rooms', val)} /></div>;
      if (currentStep === 2) return (
        <div className="space-y-8 w-full max-w-lg mx-auto">
          <div className="grid grid-cols-1 gap-3">
            {["Intervention Week-end", "Coffres-forts", "Emballage IT", "Destruction Archives"].map((item, i) => (
              <button key={i} onClick={() => toggleLogistic(item)} className={`flex items-center justify-between p-5 rounded-xl border transition-all ${logistics.includes(item) ? 'bg-blue-50 border-batimove-blue shadow-sm' : 'bg-white border-slate-300 hover:border-slate-400'}`}>
                <span className={`font-medium ${logistics.includes(item) ? 'text-batimove-blue font-bold' : 'text-slate-600'}`}>{item}</span>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${logistics.includes(item) ? 'bg-batimove-blue border-batimove-blue' : 'border-slate-300 bg-slate-50'}`}>
                  {logistics.includes(item) && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </button>
            ))}
          </div>
          <LuxuryDate value={data.date} onChange={handleDateChange} />
        </div>
      );
    }
    // Clean, Storage, Lift, General... (Simplified fallbacks to match exact styling of previous version)
    if (currentServiceId === 'clean') {
      if (currentStep === 0) return <div className="w-full max-w-lg mx-auto"><LuxurySlider label="Surface à nettoyer" value={data.surface} min={20} max={300} step={5} unit="m²" onChange={(val: number) => updateData('surface', val)} /></div>;
      if (currentStep === 1) return <div className="w-full max-w-lg mx-auto"><LuxuryDate value={data.date} onChange={handleDateChange} label="Date de remise" /></div>;
    }
    if (currentServiceId === 'storage') {
      if (currentStep === 0) return <div className="w-full max-w-lg mx-auto"><LuxurySlider label="Volume à stocker" value={data.volume} min={5} max={100} step={1} unit="m³" onChange={(val: number) => updateData('volume', val)} /></div>;
      if (currentStep === 1) return (
        <div className="w-full max-w-lg mx-auto space-y-6">
          <LuxuryDate value={data.date} onChange={handleDateChange} label="Début du stockage" />
          <div className="grid grid-cols-2 gap-4">
            <LuxuryTile label="Court terme" subLabel="< 3 mois" icon={Box} selected={data.duration === 'court'} onClick={() => updateData('duration', 'court')} />
            <LuxuryTile label="Long terme" subLabel="> 3 mois" icon={Warehouse} selected={data.duration === 'long'} onClick={() => updateData('duration', 'long')} />
          </div>
        </div>
      );
    }
    if (currentServiceId === 'lift') {
      if (currentStep === 0) return <div className="w-full max-w-lg mx-auto"><LuxurySlider label="Étage d'intervention" value={data.floor} min={1} max={15} step={1} unit="ème" onChange={(val: number) => updateData('floor', val)} /></div>;
      if (currentStep === 1) return <div className="w-full max-w-lg mx-auto"><LuxuryDate value={data.date} onChange={handleDateChange} /></div>;
    }

    // Default / General / Inter
    return (
      <div className="space-y-6 w-full max-w-lg mx-auto">
        {currentStep === 0 && (
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Votre demande</label>
            <div className="bg-white rounded-xl border border-slate-300 shadow-sm focus-within:ring-4 focus-within:ring-batimove-blue/10 focus-within:border-batimove-blue transition-all hover:border-slate-400">
              <textarea className="w-full h-48 bg-transparent text-slate-900 p-5 outline-none resize-none font-medium placeholder:text-slate-400 text-lg rounded-xl" placeholder="Décrivez votre besoin en quelques mots..."></textarea>
            </div>
          </div>
        )}
        {currentStep === 1 && <LuxuryDate value={data.date} onChange={handleDateChange} />}
      </div>
    );
  };

  const isFinalStep = currentStep === config.steps.length - 1;
  const isActionEnabled = canProceed();

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-white overflow-hidden flex flex-row font-sans">
      {/* LEFT COLUMN - VISUALS */}
      <div className="hidden lg:block lg:w-5/12 xl:w-[40%] relative bg-slate-900 overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          <img src={config.image} alt="Service" className="w-full h-full object-cover opacity-60" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-batimove-dark via-batimove-dark/40 to-transparent"></div>
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity">
            <Logo className="w-10 h-10 drop-shadow-lg" />
            <span className="font-display font-bold text-xl tracking-tight">Batimove</span>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-12">
          <motion.div key={currentServiceId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">Devis Express</div>
            <h1 className="font-display text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-md">{config.title}</h1>
            <p className="text-slate-200 text-lg font-light leading-relaxed max-w-md mix-blend-plus-lighter">{config.subtitle}. <br />Laissez-nous gérer la complexité pendant que vous imaginez votre futur.</p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT COLUMN - FORM */}
      <div className="flex-1 flex flex-col relative bg-white">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
          <Link to="/"><Logo className="w-8 h-8" /></Link>
          <Link to="/services">
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"><X className="w-5 h-5" /></button>
          </Link>
        </div>
        {/* Desktop Close */}
        <div className="hidden lg:block absolute top-8 right-8 z-50">
          <Link to="/services">
            <button className="group w-12 h-12 rounded-full bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center text-slate-400 hover:text-batimove-red hover:border-red-100"><X className="w-5 h-5 transition-transform group-hover:rotate-90" /></button>
          </Link>
        </div>

        {/* Progress Bar (Hidden on Success) */}
        {!isSuccess && (
          <div className="w-full h-1 bg-slate-100 mt-[73px] lg:mt-0">
            <motion.div
              className="h-full bg-batimove-red shadow-[0_0_10px_rgba(225,6,0,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / config.steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        {/* Main Form Area */}
        <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-12 flex flex-col items-center">
          <div className="w-full max-w-2xl flex-1 flex flex-col justify-center min-h-[500px]">
            {!isSuccess && (
              <div className="mb-10 text-center lg:text-left w-full max-w-lg mx-auto">
                <span className="text-xs font-bold text-batimove-blue uppercase tracking-widest block mb-2">Étape 0{currentStep + 1} / 0{config.steps.length}</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900">{config.steps[currentStep]}</h2>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep + currentServiceId + (isSuccess ? 'success' : '')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full pb-8"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Actions (Hidden on Success) */}
        {!isSuccess && (
          <div className="p-6 md:p-8 border-t border-slate-100 bg-white z-20">
            <div className="max-w-2xl mx-auto flex justify-between items-center">
              <Button variant="ghost" onClick={prevStep} disabled={isSubmitting} className="text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl px-6">
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="font-bold">Retour</span>
              </Button>
              <Button
                onClick={isFinalStep ? handleFinish : nextStep}
                disabled={!isActionEnabled || isSubmitting}
                isLoading={isSubmitting}
                className={`rounded-xl px-10 py-4 font-bold tracking-wide transition-all shadow-xl font-display text-lg ${isActionEnabled ? 'bg-batimove-red hover:bg-[#c00500] text-white shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
              >
                {isFinalStep ? 'Valider ma demande' : 'Continuer'}
                {!isFinalStep && !isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};