import React from 'react';
import { LucideIcon } from 'lucide-react';

export const PageContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col w-full min-h-screen bg-gray-50 pb-20 md:pb-0 ${className}`}>
      {children}
    </div>
  );
};

export const AppHeader: React.FC<{ 
  title: string; 
  subtitle?: string;
  rightAction?: React.ReactNode;
  leftAction?: React.ReactNode;
}> = ({ title, subtitle, rightAction, leftAction }) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center gap-3">
        {leftAction}
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="text-xs font-medium text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {rightAction && (
        <div className="flex items-center">
          {rightAction}
        </div>
      )}
    </header>
  );
};

export interface BottomNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const BottomNavigation: React.FC<{ 
  items: BottomNavItem[];
  activeId: string;
  onChange: (id: string) => void;
}> = ({ items, activeId, onChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-2 pb-safe bg-white border-t border-gray-200 md:hidden">
      {items.map((item) => {
        const isActive = activeId === item.id;
        const Icon = item.icon;
        
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="relative flex flex-col items-center justify-center flex-1 h-[60px] min-w-[64px] transition-colors"
            aria-label={item.label}
          >
            <div className={`flex items-center justify-center w-12 h-8 rounded-full mb-1 transition-all ${
              isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-[calc(50%-16px)] flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-medium leading-none tracking-tight ${
              isActive ? 'text-slate-900' : 'text-slate-500'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
