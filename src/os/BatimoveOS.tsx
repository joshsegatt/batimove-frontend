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
import { SettingsView } from "./features/settings/SettingsView";
import { AccountDrawer } from "./core/components/AccountDrawer";
import { CommandPalette } from "./core/components/CommandPalette";
import { NotificationPopover } from "./core/components/NotificationPopover";
import { LeadItem } from "../../services/supabaseClient";
import { getCurrentUser, UserProfile } from "../../services/adminAuth";
import { ToastProvider } from "./core/components/ToastContext";
import { ShieldAlert, User, Users } from "lucide-react";

interface BatimoveOSProps {
  onLogout?: () => void;
}

export function BatimoveOS({ onLogout }: BatimoveOSProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeView, setActiveView] = useState<OsView>('cockpit');
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [showAccountDrawer, setShowAccountDrawer] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [drillDownFilter, setDrillDownFilter] = useState<string | null>(null);

  // Workspace Mode (Monday.com style: Team vs Individual)
  const [workspaceMode, setWorkspaceMode] = useState<'team' | 'individual'>('team');
  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => getCurrentUser());

  const { leads, fleetVehicles, financialRecords, loading, error, reloadData } = useDashboardData();

  useEffect(() => {
    const hasSeen = localStorage.getItem('batimove_os_onboarding_done');
    if (!hasSeen) {
      setShowOnboarding(true);
    }
    setIsLoaded(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isLoaded) return null;

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  const displayedLeads = leads;
  const operationLeads = displayedLeads.filter(l => l.status === 'confirme' || l.status === 'facture' || l.status === 'termine');
  const unreadCount = leads.filter(l => l.status === 'nouveau').length;

  return (
    <ToastProvider>
      <OsLayout 
        activeView={activeView}
      onViewChange={(v) => {
        setActiveView(v);
        setDrillDownFilter(null);
      }}
      onOpenNewLead={() => setShowNewLeadModal(true)}
      onOpenCommandPalette={() => setShowCommandPalette(true)}
      onOpenAccount={() => setShowAccountDrawer(true)}
      onOpenNotifications={() => setShowNotifications(prev => !prev)}
      unreadNotificationsCount={unreadCount}
      workspaceMode={workspaceMode}
      currentUser={currentUser}
      onLogout={onLogout}
    >
      <div className="py-6 space-y-6 animate-fadeIn">
        {/* Workspace Mode Notification Banner */}
        {workspaceMode === 'individual' && (
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50 border border-blue-200/80 text-blue-900 text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>
                Mode <strong>Espace Personnel</strong> actif pour <strong>{currentUser.name}</strong> ({currentUser.role}).
              </span>
            </div>
            <button
              onClick={() => setWorkspaceMode('team')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 underline"
            >
              Basculer sur l'Équipe Générale
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            Erreur de connexion : {error}
          </div>
        )}

        {/* VIEW 1: COCKPIT */}
        {activeView === 'cockpit' && (
          <div className="space-y-6">
            <FinanceCockpit 
              leads={displayedLeads} 
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
                leads={displayedLeads}
                onReload={reloadData}
                onSelectLead={setSelectedLead}
                onOpenNewLead={() => setShowNewLeadModal(true)}
                initialFilter={drillDownFilter}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: CRM */}
        {activeView === 'crm' && (
          <div className="space-y-4">
            <LeadDataGrid 
              leads={displayedLeads}
              onReload={reloadData}
              onSelectLead={setSelectedLead}
              onOpenNewLead={() => setShowNewLeadModal(true)}
            />
          </div>
        )}

        {/* VIEW 3: OPERATIONS */}
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
              onOpenNewLead={() => setShowNewLeadModal(true)}
              initialFilter="confirme"
            />
          </div>
        )}

        {/* VIEW 4: FLEET */}
        {activeView === 'fleet' && (
          <FleetView 
            vehicles={fleetVehicles}
            onReload={reloadData}
          />
        )}

        {/* VIEW 5: FIDUCIARY & FINANCIAL HUB */}
        {activeView === 'fiduciary' && (
          <>
            {!currentUser.permissions.canViewFinancials ? (
              <div className="p-8 rounded-3xl bg-white border border-gray-200/80 text-center max-w-md mx-auto my-12 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Accès Restreint</h3>
                <p className="text-xs text-gray-500 mb-6">
                  Le profil actif (<strong>{currentUser.role}</strong>) n'a pas les droits requis pour consulter l'extrait fiduciaire et TVA suisse.
                </p>
                <button
                  onClick={() => setShowAccountDrawer(true)}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800"
                >
                  Basculer sur le profil Directeur ou Fiduciaire
                </button>
              </div>
            ) : (
              <FiduciaryView 
                leads={displayedLeads}
                financialRecords={financialRecords}
                onSelectLead={setSelectedLead}
                onReload={reloadData}
              />
            )}
          </>
        )}

        {/* VIEW 6: SETTINGS & ORGANISATION */}
        {activeView === 'settings' && (
          <SettingsView
            currentUser={currentUser}
            onUserChange={setCurrentUserState}
            workspaceMode={workspaceMode}
            onWorkspaceModeChange={setWorkspaceMode}
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

      {/* Account & Security Drawer */}
      <AccountDrawer
        isOpen={showAccountDrawer}
        onClose={() => setShowAccountDrawer(false)}
        workspaceMode={workspaceMode}
        onWorkspaceModeChange={setWorkspaceMode}
        currentUser={currentUser}
        onUserChange={setCurrentUserState}
      />

      {/* Notification Center Popover */}
      <NotificationPopover
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        leads={leads}
        onSelectLead={setSelectedLead}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        leads={leads}
        onSelectLead={setSelectedLead}
        onViewChange={(v) => {
          setActiveView(v);
          setDrillDownFilter(null);
        }}
        onOpenNewLead={() => setShowNewLeadModal(true)}
        onOpenAccount={() => setShowAccountDrawer(true)}
      />
    </OsLayout>
    </ToastProvider>
  );
}
