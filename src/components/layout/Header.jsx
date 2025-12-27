import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export function Header({ activeView = 'dashboard', onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`sticky top-0 z-50 border-b ${scrolled ? 'bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-slate-200' : 'bg-white border-slate-200'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">FinEye</h1>
            <p className="text-xs text-slate-500 hidden sm:block">Observe smart money — not follow it blindly.</p>
          </div>
        </div>
        <nav className="flex items-center space-x-2 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate && onNavigate('dashboard')}
            className={`${activeView === 'dashboard' ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-primary/10 hover:text-primary'} px-3 py-1 rounded-full border border-slate-200 transition-colors`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate && onNavigate('about')}
            className={`${activeView === 'about' ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-primary/10 hover:text-primary'} px-3 py-1 rounded-full border border-slate-200 transition-colors`}
          >
            About
          </button>
        </nav>
      </div>
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 py-2">
          <p className="text-[11px] text-slate-500">
            For educational and informational purposes only. Not investment advice.
          </p>
        </div>
      </div>
    </header>
  );
}
