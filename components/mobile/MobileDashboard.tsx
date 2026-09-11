import React from 'react';
import { PageContainer, AppHeader, SectionHeader, KpiCard, ActionCard } from './index';
import { Plus, Users, Truck, Receipt, Calendar, Bell } from 'lucide-react';

interface MobileDashboardProps {
  stats: {
    revenue: number;
    activeMissions: number;
    fleetActive: number;
    newLeads: number;
  };
  onAction: (action: string) => void;
}

const formatCHF = (val: number) => {
  return val.toLocaleString('de-CH', { style: 'currency', currency: 'CHF', minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

export const MobileDashboard: React.FC<MobileDashboardProps> = ({ stats, onAction }) => {
  return (
    <PageContainer className="bg-gray-50">
      <AppHeader 
        title="BATIMOVE.OS" 
        subtitle="Operational Cockpit"
        rightAction={
          <button className="p-2 relative text-slate-400 hover:text-slate-600">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
          </button>
        }
      />

      <div className="px-4 pt-4 pb-6 space-y-6">
        {/* Priority KPI */}
        <div className="grid grid-cols-2 gap-3">
          <KpiCard 
            title="Chiffre d'affaires" 
            value={formatCHF(stats.revenue)} 
            icon={Receipt} 
            color="blue"
            className="col-span-2"
          />
          <KpiCard 
            title="Missions Actives" 
            value={stats.activeMissions} 
            icon={Calendar} 
            color="green"
          />
          <KpiCard 
            title="Nouveaux Devis" 
            value={stats.newLeads} 
            icon={Users} 
            color="slate"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <SectionHeader title="Actions Rapides" className="px-0 pt-0 pb-2" />
          <div className="space-y-3">
            <ActionCard 
              title="Nouveau Devis" 
              description="Crer une nouvelle requte client"
              icon={Plus} 
              onClick={() => onAction('new_lead')} 
            />
            <ActionCard 
              title="Grer la Flotte" 
              description={`${stats.fleetActive} vhicules en dplacement`}
              icon={Truck} 
              color="slate"
              onClick={() => onAction('view_fleet')} 
            />
            <ActionCard 
              title="Comptabilit" 
              description="Voir l'extrait financier & TVA"
              icon={Receipt} 
              color="slate"
              onClick={() => onAction('view_fiduciary')} 
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
