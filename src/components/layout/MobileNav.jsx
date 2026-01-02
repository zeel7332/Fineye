import React from 'react';
import { BarChart3, Search, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MobileNav({ activeView, onNavigate }) {
  const navItems = [
    { id: 'dashboard', label: 'Insights', icon: BarChart3 },
    { id: 'compare', label: 'Compare', icon: Search },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-primary" : "text-slate-400"
            )}
          >
            <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", isActive ? "text-primary" : "text-slate-500")}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
