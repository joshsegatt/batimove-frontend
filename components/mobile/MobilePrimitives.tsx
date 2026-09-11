import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

export const SectionHeader: React.FC<{ 
  title: string; 
  action?: React.ReactNode;
  className?: string;
}> = ({ title, action, className = '' }) => (
  <div className={`flex items-center justify-between px-4 py-3 ${className}`}>
    <h2 className="text-[13px] font-semibold tracking-widest text-slate-500 uppercase">{title}</h2>
    {action && <div>{action}</div>}
  </div>
);

export const KpiCard: React.FC<{
  title: string;
  value: string | number;
  trend?: { value: number; label: string };
  icon?: LucideIcon;
  color?: 'blue' | 'green' | 'red' | 'slate';
  className?: string;
}> = ({ title, value, trend, icon: Icon, color = 'blue', className = '' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    red: 'bg-rose-50 text-rose-700',
    slate: 'bg-slate-50 text-slate-700'
  };

  return (
    <div className={`p-4 bg-white border border-gray-100 rounded-2xl shadow-sm ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {Icon && (
          <div className={`p-2 rounded-xl ${colorMap[color]}`}>
            <Icon size={16} strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
      </div>
      {trend && (
        <div className={`mt-2 flex items-center text-xs font-medium ${
          trend.value >= 0 ? 'text-emerald-600' : 'text-rose-600'
        }`}>
          <span>{trend.value >= 0 ? '+' : ''}{trend.value}%</span>
          <span className="ml-1 text-slate-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

export const MetricRow: React.FC<{
  label: string;
  value: React.ReactNode;
  border?: boolean;
}> = ({ label, value, border = true }) => (
  <div className={`flex items-center justify-between py-3 ${border ? 'border-b border-gray-100' : ''}`}>
    <span className="text-sm font-medium text-slate-500">{label}</span>
    <span className="text-sm font-semibold text-slate-900">{value}</span>
  </div>
);

export const ActionCard: React.FC<{
  title: string;
  description?: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: 'blue' | 'slate';
}> = ({ title, description, icon: Icon, onClick, color = 'blue' }) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center w-full p-4 text-left transition-colors bg-white border border-gray-100 rounded-2xl active:bg-gray-50 group"
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 ${
        color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
      }`}>
        <Icon size={24} strokeWidth={2} />
      </div>
      <div className="flex-1">
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
        {description && <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{description}</p>}
      </div>
      <ChevronRight size={20} className="text-gray-300 transition-colors group-hover:text-gray-500" />
    </button>
  );
};

export const StatusBadge: React.FC<{
  status: string;
  type?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}> = ({ status, type = 'neutral' }) => {
  const typeMap = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border-amber-100',
    danger: 'bg-rose-50 text-rose-700 border-rose-100',
    info: 'bg-blue-50 text-blue-700 border-blue-100',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold border rounded-md ${typeMap[type]}`}>
      {status}
    </span>
  );
};

export const MobileListItem: React.FC<{
  title: string;
  subtitle?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ title, subtitle, leftContent, rightContent, onClick, className = '' }) => {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component 
      onClick={onClick}
      className={`flex items-center w-full p-4 bg-white border-b border-gray-100 last:border-b-0 ${
        onClick ? 'active:bg-gray-50 text-left' : ''
      } ${className}`}
    >
      {leftContent && <div className="mr-4">{leftContent}</div>}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 truncate">{title}</h4>
        {subtitle && <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>}
      </div>
      {rightContent && <div className="ml-4 flex-shrink-0">{rightContent}</div>}
    </Component>
  );
};
