import React from 'react';
import { 
  Home, Layers, Calendar, Truck, Landmark, User, 
  LogOut, Plus, Search, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { cn } from '../utils/cn';

export type OsView = 'cockpit' | 'crm' | 'operations' | 'fleet' | 'fiduciary';

interface OsLayoutProps {
  children: React.ReactNode;
  activeView: OsView;
  onViewChange: (view: OsView) => void;
  onOpenNewLead: () => void;
  onLogout?: () => void;
}

export function OsLayout({ 
  children, 
  activeView, 
  onViewChange, 
  onOpenNewLead,
  onLogout 
}: OsLayoutProps) {
  const VIEW_TITLES: Record<OsView, { title: string; subtitle: string }> = {
    cockpit: { title: "Vue d'ensemble", subtitle: "Cockpit financier & indicateurs de performance" },
    crm: { title: "Pipeline Devis & Prospects", subtitle: "Gestion commerciale, suivi et relances clients" },
    operations: { title: "Opérations & Missions", subtitle: "Planning des déménagements confirmés" },
    fleet: { title: "Flotte & Équipes", subtitle: "Disponibilité des camions et affectations" },
    fiduciary: { title: "Extrait Fiduciaire & TVA 8.1%", subtitle: "Comptabilité suisse et facturation BCGE" },
  };

  const navItems: { id: OsView; label: string; icon: React.ReactNode }[] = [
    { id: 'cockpit', label: 'Cockpit', icon: <Home className="w-5 h-5" /> },
    { id: 'crm', label: 'Devis & CRM', icon: <Layers className="w-5 h-5" /> },
    { id: 'operations', label: 'Missions', icon: <Calendar className="w-5 h-5" /> },
    { id: 'fleet', label: 'Flotte', icon: <Truck className="w-5 h-5" /> },
    { id: 'fiduciary', label: 'Fiduciaire', icon: <Landmark className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] text-gray-900 font-sans antialiased overflow-hidden selection:bg-blue-500/20">
      {/* DESKTOP THIN RAIL */}
      <aside className="hidden lg:flex w-16 flex-col items-center justify-between bg-white border-r border-gray-200/80 py-4 z-50 shadow-[1px_0_3px_rgba(0,0,0,0.02)]">
        {/* Top: Logo & Nav Items */}
        <div className="flex flex-col items-center gap-6 w-full">
          {/* Batimove Swiss Monogram */}
          <button 
            onClick={() => onViewChange('cockpit')}
            className="w-9 h-9 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-gray-900/20 active:scale-95 transition-all"
            title="Batimove OS"
          >
            B
          </button>

          {/* Nav Icons */}
          <nav className="flex flex-col gap-2 w-full px-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-all mx-auto relative group",
                  activeView === item.id 
                    ? "bg-gray-900 text-white shadow-sm" 
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-100/80"
                )}
                title={item.label}
              >
                {item.icon}
                {/* Desktop Tooltip */}
                <span className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-[11px] font-semibold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap z-50">
                  {item.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom: Logout */}
        <div className="flex flex-col items-center gap-2">
          {onLogout && (
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center justify-center border border-blue-200">
            CH
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
        {/* TOP HEADER GLASSMORPHISM */}
        <header className="h-16 w-full flex items-center justify-between px-4 sm:px-8 border-b border-gray-200/70 bg-white/80 backdrop-blur-md absolute top-0 z-40">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-gray-900">
                {VIEW_TITLES[activeView].title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3" /> Live
              </span>
            </div>
            <p className="hidden sm:block text-xs font-medium text-gray-400">
              {VIEW_TITLES[activeView].subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenNewLead}
              className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 active:scale-95 transition-all shadow-md shadow-gray-900/10"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau Devis</span>
              <span className="sm:hidden">Devis</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* SCROLLABLE MAIN CONTENT */}
        <div className="flex-1 overflow-y-auto pt-16 pb-24 lg:pb-8 px-4 sm:px-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white/90 backdrop-blur-xl border-t border-gray-200/70 flex items-center justify-around px-2 z-50 shadow-lg">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-all",
              activeView === item.id ? "text-gray-900 scale-105" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <div className={cn(
              "p-1 rounded-lg transition-colors",
              activeView === item.id ? "bg-gray-900 text-white" : ""
            )}>
              {item.icon}
            </div>
            <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
