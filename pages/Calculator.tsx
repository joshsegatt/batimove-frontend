import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  RotateCcw, 
  Check, 
  Minus, 
  Plus, 
  ArrowRight,
  Info
} from 'lucide-react';
import { useVolumeCalculator, HOUSING_PRESETS } from '../hooks/useVolumeCalculator';
import { Button } from '../components/UIComponents';
import { 
  Studio3DIcon, 
  Home2P3DIcon, 
  Apartment3P3DIcon, 
  Apartment4P3DIcon, 
  Villa5P3DIcon,
  Salon3DIcon,
  Chambre3DIcon,
  Cuisine3DIcon,
  Divers3DIcon,
  Truck3DIcon,
  Shield3DIcon
} from '../components/Calculator3DIcons';

const CATEGORIES = [
  { id: 'salon', label: 'Salon & Séjour', icon: Salon3DIcon },
  { id: 'chambre', label: 'Chambres & Bureau', icon: Chambre3DIcon },
  { id: 'cuisine', label: 'Cuisine & Électro', icon: Cuisine3DIcon },
  { id: 'divers', label: 'Cave & Annexes', icon: Divers3DIcon },
];

const PRESET_ICONS: Record<string, React.FC<{ className?: string }>> = {
  studio: Studio3DIcon,
  '2pieces': Home2P3DIcon,
  '3pieces': Apartment3P3DIcon,
  '4pieces': Apartment4P3DIcon,
  maison: Villa5P3DIcon,
};

export default function Calculator() {
  const navigate = useNavigate();
  const {
    summary,
    activePreset,
    applyPreset,
    updateQuantity,
    toggleDisassemble,
    resetCalculator,
    getItemsByCategory,
    getAllItems,
  } = useVolumeCalculator();

  const [activeCategory, setActiveCategory] = useState<string>('salon');

  // Determine recommended truck and team based on volume
  const getLogisticsRecommendation = (vol: number) => {
    if (vol === 0) return { truck: 'Sélectionnez vos meubles', team: 'Estimation sur-mesure' };
    if (vol <= 12) return { truck: 'Fourgon 14m³', team: '2 déménageurs' };
    if (vol <= 24) return { truck: 'Camion capitonné 20m³', team: '2 à 3 déménageurs' };
    if (vol <= 38) return { truck: 'Grand Camion 35m³', team: '3 déménageurs' };
    return { truck: 'Convoi Pro 50m³+', team: '4 déménageurs' };
  };

  const logistics = getLogisticsRecommendation(summary.totalVolume);

  const handleProceedToCheckout = () => {
    if (summary.totalVolume === 0) {
      alert('Veuillez sélectionner au moins un meuble ou un type de logement');
      return;
    }

    const allItems = getAllItems();

    const calculatorData = {
      items: allItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        volume: item.volume,
        needsDisassembly: item.disassemble,
      })),
      totalVolume: summary.totalVolume,
      estimatedPrice: summary.estimatedPrice,
      totalItems: summary.totalItems,
      disassembleCount: summary.disassembleCount,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('calculatorData', JSON.stringify(calculatorData));
    navigate('/calculator/checkout');
  };

  const currentCategoryItems = getItemsByCategory(activeCategory);
  const volumePercentage = Math.min(Math.round((summary.totalVolume / 50) * 100), 100);

  return (
    <div className="flex-1 min-h-[calc(100dvh-98px)] lg:h-[calc(100dvh-98px)] lg:max-h-[calc(100dvh-98px)] bg-gradient-to-b from-[#07182b] via-[#0B1E33] to-[#061424] text-slate-100 flex flex-col justify-between relative overflow-y-auto lg:overflow-hidden font-sans">
      
      {/* Ambient Lighting Orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Centered Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex-1 flex flex-col justify-center relative z-10 my-auto">

        {/* Minimal High-End Header */}
        <div className="text-center mb-3 sm:mb-4 flex-shrink-0">
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Configurez Votre Déménagement
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-1 font-normal leading-relaxed">
            Sélectionnez votre type de logement ou ajustez votre inventaire pièce par pièce.
          </p>
        </div>

        {/* APPLE-STYLE 3D HOUSING PRESET CARDS */}
        <div className="mb-3 sm:mb-4 flex-shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 max-w-5xl mx-auto">
            {HOUSING_PRESETS.map((preset) => {
              const isSelected = activePreset === preset.id;
              const IconComponent = PRESET_ICONS[preset.id] || Studio3DIcon;

              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`relative p-2.5 sm:p-3 rounded-2xl text-left transition-all duration-200 border flex items-center gap-3 cursor-pointer group ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#143254] to-[#0d2238] border-sky-400/80 text-white shadow-[0_8px_20px_-4px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/40'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/5 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-8 h-8 drop-shadow-md" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-bold truncate leading-tight text-white">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-sky-400/90 font-mono mt-0.5">
                      ~{preset.badge}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-COLUMN MAIN WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch w-full flex-1 min-h-0">

          {/* LEFT COLUMN: ROOM SELECTOR & INTERACTIVE INVENTORY (7 Cols) */}
          <div className="lg:col-span-7 bg-[#081a2e]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-hidden">
            <div>
              {/* Category Segmented Control with 3D Icons */}
              <div className="flex items-center gap-1.5 pb-3 border-b border-white/10 overflow-x-auto scrollbar-hide mb-3">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  const Icon = cat.icon;
                  const catItems = getItemsByCategory(cat.id);
                  const selectedCount = catItems.reduce((sum, it) => sum + it.quantity, 0);

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                        isActive
                          ? 'bg-sky-500 text-white border-sky-400 shadow-md shadow-sky-500/25'
                          : 'bg-white/[0.03] text-slate-300 hover:text-white border-white/5 hover:bg-white/[0.07]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{cat.label}</span>
                      {selectedCount > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-bold font-mono">
                          {selectedCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Items List (Scrollable within container) */}
              <div className="space-y-1.5 h-[230px] sm:h-[260px] lg:h-[280px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {currentCategoryItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      item.quantity > 0
                        ? 'bg-sky-500/10 border-sky-400/30 text-white'
                        : 'bg-white/[0.02] border-white/5 text-slate-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <div className="text-xs sm:text-sm font-semibold truncate text-white">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="font-mono bg-white/[0.05] px-1.5 py-0.2 rounded text-[10px]">
                          {item.volume} m³
                        </span>
                        {item.quantity > 0 && (
                          <button
                            onClick={() => toggleDisassemble(item.id)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                              item.disassemble
                                ? 'bg-sky-500/20 border-sky-400/40 text-sky-300'
                                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${item.disassemble ? 'bg-sky-400 shadow-[0_0_6px_#38bdf8]' : 'bg-slate-500'}`} />
                            <span>Démontage (+25 CHF)</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stepper Buttons (Apple Tactile Pill) */}
                    <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-xl p-0.5 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        disabled={item.quantity === 0}
                        className="w-7 h-7 rounded-lg hover:bg-white/10 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-white font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 rounded-lg bg-sky-500 hover:bg-sky-400 active:scale-95 flex items-center justify-center text-white transition-all cursor-pointer shadow-sm shadow-sky-500/30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Helper Note */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400" />
                <span>Protection sous couverture capitonnée incluse pour chaque meuble.</span>
              </span>
              <button
                onClick={resetCalculator}
                className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: REFINED APPLE-GRADE SUMMARY & LIVE DEVIS (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#0c223a] via-[#091b2e] to-[#061424] border border-sky-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between text-white relative backdrop-blur-xl">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300 font-display">
                  Estimation Directe
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Suisse Romande
                </span>
              </div>

              {/* Volume & Capacity Gauge */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs text-slate-300 font-medium">Volume estimé</span>
                  <span className="font-display text-2xl font-black text-sky-400">
                    {summary.totalVolume} <span className="text-sm font-normal text-sky-300/80">m³</span>
                  </span>
                </div>

                {/* Linear Capacity Meter */}
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${volumePercentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{summary.totalItems} articles inventoriés</span>
                  <span>{summary.disassembleCount > 0 ? `${summary.disassembleCount} démontage(s)` : 'Sans démontage'}</span>
                </div>

                {/* Pricing Showcase */}
                <div className="border-t border-white/[0.08] pt-3 mt-3">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Tarif Transparent Estimé
                  </div>
                  <div className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mt-1">
                    {summary.estimatedPrice > 0 ? (
                      <>
                        <span className="text-xl font-bold text-sky-400 mr-1.5">CHF</span>
                        {summary.estimatedPrice}.-
                      </>
                    ) : (
                      <span className="text-2xl text-slate-400 font-normal">CHF 0.-</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Véhicule, carburant, manutentionnaires & assurance inclus.
                  </p>
                </div>
              </div>

              {/* Logistics & Security Cards with 3D Icons */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shrink-0">
                    <Truck3DIcon className="w-6 h-6" />
                  </div>
                  <div className="text-xs">
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Logistique recommandée</div>
                    <div className="text-white font-bold">{logistics.truck} • {logistics.team}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                    <Shield3DIcon className="w-6 h-6" />
                  </div>
                  <div className="text-xs">
                    <div className="text-slate-400 text-[10px] uppercase font-semibold">Garantie & Protection</div>
                    <div className="text-white font-bold">Assurance RC Pro 5M CHF incluse</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <Button
                onClick={handleProceedToCheckout}
                disabled={summary.totalVolume === 0}
                className="w-full bg-batimove-red hover:bg-[#b50400] disabled:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-red-900/40 hover:shadow-red-500/40 transition-all flex items-center justify-center gap-2 font-display border-none cursor-pointer active:scale-[0.99]"
              >
                <span>Recevoir Mon Devis Gratuit</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
              <div className="flex items-center justify-center gap-2 text-center text-[10px] text-slate-400 mt-2">
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Sans engagement • Réponse personnalisée sous 2h ouvrées</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Sleek Minimal Bottom Bar */}
      <div className="w-full border-t border-white/5 bg-[#05101c]/80 backdrop-blur-md py-2 px-4 flex-shrink-0 text-[11px] text-slate-400 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
          <span>🇨🇭 Batimove Sàrl • Tarifs transparents sans frais cachés • Genève & Suisse Romande</span>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="tel:0800825925" className="hover:text-white transition-colors">Hotline: 0800 825 925</a>
            <span className="text-slate-600">•</span>
            <Link to="/contact" className="hover:text-white text-sky-400 transition-colors">Besoin d'aide ?</Link>
          </div>
        </div>
      </div>

    </div>
  );
}
