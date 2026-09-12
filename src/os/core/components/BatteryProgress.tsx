import React from 'react';
import { LeadItem } from '../../../../services/supabaseClient';
import { cn } from '../utils/cn';

interface BatteryProgressProps {
  leads: LeadItem[];
  size?: 'sm' | 'md' | 'lg';
  showLegend?: boolean;
  className?: string;
}

interface StatusSegment {
  status: LeadItem['status'];
  label: string;
  color: string;
  count: number;
  amount: number;
  percentage: number;
}

const STATUS_CONFIG: Record<LeadItem['status'], { label: string; color: string }> = {
  nouveau: { label: 'Nouveaux', color: 'bg-blue-500 hover:bg-blue-600' },
  visite: { label: 'Visites', color: 'bg-indigo-500 hover:bg-indigo-600' },
  en_cours: { label: 'En négociation', color: 'bg-amber-500 hover:bg-amber-600' },
  confirme: { label: 'Confirmés', color: 'bg-emerald-500 hover:bg-emerald-600' },
  facture: { label: 'Facturés', color: 'bg-purple-500 hover:bg-purple-600' },
  termine: { label: 'Terminés', color: 'bg-slate-400 hover:bg-slate-500' },
  annule: { label: 'Annulés', color: 'bg-rose-400 hover:bg-rose-500' },
};

export function BatteryProgress({ leads, size = 'md', showLegend = true, className }: BatteryProgressProps) {
  const totalCount = leads.length;

  if (totalCount === 0) {
    return (
      <div className={cn("w-full bg-slate-100 rounded-full overflow-hidden h-2.5", className)}>
        <div className="h-full bg-slate-200 w-full" />
      </div>
    );
  }

  const segments: StatusSegment[] = Object.entries(STATUS_CONFIG).map(([st, meta]) => {
    const matching = leads.filter(l => l.status === st);
    const count = matching.length;
    const amount = matching.reduce((sum, l) => sum + (l.amount_chf || l.estimated_amount_chf || 0), 0);
    const percentage = Math.round((count / totalCount) * 100);
    return {
      status: st as LeadItem['status'],
      label: meta.label,
      color: meta.color,
      count,
      amount,
      percentage
    };
  }).filter(s => s.count > 0);

  const heightClass = {
    sm: 'h-2 rounded-md',
    md: 'h-3 rounded-lg',
    lg: 'h-4 rounded-xl'
  }[size];

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Battery Container */}
      <div className={cn("w-full bg-slate-100 flex overflow-hidden p-0.5 gap-0.5 shadow-inner border border-slate-200/80", heightClass)}>
        {segments.map(seg => (
          <div
            key={seg.status}
            style={{ width: `${(seg.count / totalCount) * 100}%` }}
            className={cn("h-full transition-all duration-300 relative group cursor-pointer first:rounded-l last:rounded-r", seg.color)}
            title={`${seg.label}: ${seg.count} (${seg.percentage}%) - CHF ${seg.amount}`}
          />
        ))}
      </div>

      {/* Legend / Metrics */}
      {showLegend && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
          {segments.map(seg => (
            <div key={seg.status} className="flex items-center gap-1.5 font-medium">
              <span className={cn("w-2 h-2 rounded-full", seg.color.split(' ')[0])} />
              <span className="text-slate-700">{seg.label}</span>
              <span className="text-slate-400 font-mono text-[10px]">({seg.percentage}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
