import React, { useState, useEffect } from "react";
import { OsLayout } from "./core/layouts/OsLayout";
import { Onboarding } from "./core/components/Onboarding";

export function BatimoveOS() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

        {/* Bento Grid Skeleton / Empty States */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 h-64 rounded-2xl bg-white border border-gray-200/60 shadow-sm p-6 flex flex-col justify-between">
             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="w-4 h-4 block rounded-full bg-gray-300" />
             </div>
             <div>
               <div className="text-sm font-medium text-gray-500 mb-1">Chiffre d'Affaires (YTD)</div>
               <div className="text-4xl font-semibold tracking-tight text-gray-900">CHF 0.00</div>
             </div>
          </div>
          
          <div className="h-64 rounded-2xl bg-gray-900 text-white shadow-xl shadow-gray-900/10 p-6 flex flex-col justify-between">
             <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <span className="w-4 h-4 block rounded-full bg-white/30" />
             </div>
             <div>
               <div className="text-sm font-medium text-gray-400 mb-1">Devis en attente</div>
               <div className="text-3xl font-semibold tracking-tight">0</div>
             </div>
          </div>
        </div>
      </div>
    </OsLayout>
  );
}
