import React, { useState, useEffect } from "react";
import { OsLayout } from "./core/layouts/OsLayout";
import { Onboarding } from "./core/components/Onboarding";
import { useDashboardData } from "./core/hooks/useDashboardData";
import { FinanceCockpit } from "./features/finance/FinanceCockpit";

export function BatimoveOS() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { leads, loading, error } = useDashboardData();

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
        
        {/* Placeholder for Data Grid */}
        <div className="mt-4 pt-4 border-t border-gray-200/50">
           <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Actif</h2>
           <div className="h-96 rounded-2xl border border-gray-200/60 bg-white shadow-sm flex items-center justify-center text-gray-400 font-medium">
             Data Grid (En construction - Style Monday.com)
           </div>
        </div>
      </div>
    </OsLayout>
  );
}
