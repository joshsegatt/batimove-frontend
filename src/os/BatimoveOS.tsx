import React, { useState, useEffect } from "react";
import { OsLayout } from "./core/layouts/OsLayout";
import { Onboarding } from "./core/components/Onboarding";
import { useDashboardData } from "./core/hooks/useDashboardData";
import { FinanceCockpit } from "./features/finance/FinanceCockpit";
import { LeadDataGrid } from "./features/crm/LeadDataGrid";

export function BatimoveOS() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { leads, loading, error, reloadData } = useDashboardData();

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeen = localStorage.getItem('batimove_os_onboarding_done');
    if (!hasSeen) {
      setShowOnboarding(true);
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <OsLayout>
      <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full h-full flex flex-col gap-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Vue d'ensemble</h1>
          <p className="text-sm font-medium text-gray-500">Bienvenue sur le nouveau standard financier.</p>
        </header>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
            Erreur de chargement: {error}
          </div>
        )}

        {/* Real Connected Finance Cockpit */}
        <FinanceCockpit leads={leads} loading={loading} />
        
        {/* CRM Data Grid */}
        <div className="mt-4 pt-4 border-t border-gray-200/50">
           <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-gray-900">Pipeline Actif</h2>
             <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-gray-800 transition-colors">
               + Nouveau Devis
             </button>
           </div>
           
           {loading ? (
             <div className="h-96 rounded-2xl border border-gray-200/60 bg-gray-50 animate-pulse" />
           ) : (
             <LeadDataGrid leads={leads} onReload={reloadData} />
           )}
        </div>
      </div>
    </OsLayout>
  );
}
