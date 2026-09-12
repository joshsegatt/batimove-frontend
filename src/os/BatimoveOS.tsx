import React, { useState, useEffect } from "react";
import { OsLayout, OsView } from "./core/layouts/OsLayout";
import { Onboarding } from "./core/components/Onboarding";
import { useDashboardData } from "./core/hooks/useDashboardData";
import { FinanceCockpit } from "./features/finance/FinanceCockpit";
import { LeadDataGrid } from "./features/crm/LeadDataGrid";
import { LeadDetailDrawer } from "./features/crm/LeadDetailDrawer";
import { NewLeadModal } from "./features/crm/NewLeadModal";
import { FleetView } from "./features/fleet/FleetView";
import { FiduciaryView } from "./features/fiduciary/FiduciaryView";
import { LeadItem } from "../../../services/supabaseClient";

interface BatimoveOSProps {
  onLogout?: () => void;
}

export function BatimoveOS({ onLogout }: BatimoveOSProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeView, setActiveView] = useState<OsView>('cockpit');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [drillDownFilter, setDrillDownFilter] = useState<string | null>(null);

  const { leads, fleetVehicles, loading, error, reloadData } = useDashboardData();

  useEffect(() => {
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

  // Filter confirmed missions for Operations view
  const operationLeads = leads.filter(l => l.status === 'confirme' || l.status === 'facture' || l.status === 'termine');

  return (
    <OsLayout 
      activeView={activeView}
      onViewChange={(v) => {
        setActiveView(v);
        setDrillDownFilter(null);
      }}
      onOpenNewLead={() => setShowNewLeadModal(true)}
      onLogout={onLogout}
    >
      <div className="py-6 space-y-6 animate-fadeIn">
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            Erreur de connexion : {error}
          </div>
        )}

        {/* VIEW 1: COCKPIT (Overview & Finance Bento + Urgences) */}
        {activeView === 'cockpit' && (
          <div className="space-y-6">
            <FinanceCockpit 
              leads={leads} 
              loading={loading}
              activeFilter={drillDownFilter}
              onFilterChange={setDrillDownFilter}
            />

            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Dossiers & Affaires en Direct</h3>
                  <p className="text-xs text-gray-400">Cliquez sur un dossier pour ouvrir le panneau d'édition ou la facture</p>
                </div>
              </div>

              <LeadDataGrid 
                leads={leads}
                onReload={reloadData}
                onSelectLead={setSelectedLead}
                initialFilter={drillDownFilter}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: CRM (Full pipeline view with Table/Kanban) */}
        {activeView === 'crm' && (
          <div className="space-y-4">
            <LeadDataGrid 
              leads={leads}
              onReload={reloadData}
              onSelectLead={setSelectedLead}
            />
          </div>
        )}

        {/* VIEW 3: OPERATIONS (Planning & Confirmed Missions) */}
        {activeView === 'operations' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-blue-900">Planning des Déménagements Validés</h4>
                <p className="text-xs text-blue-700 mt-0.5">Dossiers confirmés nécessitant l'attribution de véhicules et d'équipes</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                {operationLeads.length} missions
              </span>
            </div>

            <LeadDataGrid 
              leads={operationLeads}
              onReload={reloadData}
              onSelectLead={setSelectedLead}
              initialFilter="confirme"
            />
          </div>
        )}

        {/* VIEW 4: FLEET & LOGISTICS */}
        {activeView === 'fleet' && (
          <FleetView 
            vehicles={fleetVehicles}
            onReload={reloadData}
          />
        )}

        {/* VIEW 5: FIDUCIARY & TVA SUISSE */}
        {activeView === 'fiduciary' && (
          <FiduciaryView 
            leads={leads}
            onSelectLead={setSelectedLead}
          />
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      <LeadDetailDrawer 
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdate={reloadData}
      />

      {/* Add New Lead Modal */}
      <NewLeadModal 
        isOpen={showNewLeadModal}
        onClose={() => setShowNewLeadModal(false)}
        onCreated={reloadData}
      />
    </OsLayout>
  );
}
