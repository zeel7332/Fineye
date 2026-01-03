import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '../common/Logo';

export function Header({ activeView = 'dashboard', onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavigate = (view) => {
    onNavigate && onNavigate(view);
    setIsMenuOpen(false);
  };

  const isLegalView = ['about', 'privacy', 'terms', 'disclaimer', 'contact'].includes(activeView);

  return (
    <header className={`sticky top-0 z-50 border-b ${scrolled ? 'bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-slate-200' : 'bg-white border-slate-200'}`}>
      <div className="container mx-auto px-4 h-12 sm:h-14 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo className="w-6 h-6 sm:w-8 sm:h-8" />
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight leading-none font-jakarta">FinEye</h1>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`${activeView === 'dashboard' ? 'text-primary' : 'text-slate-500 hover:text-slate-900'} px-2 py-1 transition-all`}
          >
            Insights
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => handleNavigate('compare')}
            className={`${activeView === 'compare' ? 'text-primary' : 'text-slate-500 hover:text-slate-900'} px-2 py-1 transition-all`}
          >
            Fund Compare
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => handleNavigate('about')}
            className={`${isLegalView ? 'text-primary' : 'text-slate-500 hover:text-slate-900'} px-2 py-1 transition-all`}
          >
            About
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6 text-slate-600" /> : <Menu className="w-6 h-6 text-slate-600" />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col p-4 space-y-2">
            <button
              onClick={() => handleNavigate('dashboard')}
              className={`w-full text-center px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${activeView === 'dashboard' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500'}`}
            >
              Insights
            </button>
            <button
              onClick={() => handleNavigate('compare')}
              className={`w-full text-center px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${activeView === 'compare' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500'}`}
            >
              Compare
            </button>
            <button
              onClick={() => handleNavigate('about')}
              className={`w-full text-center px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${isLegalView ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500'}`}
            >
              About
            </button>
          </nav>
        </div>
      )}

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 py-1 sm:py-1.5 text-center sm:text-left">
          <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
            For educational and informational purposes only. Not investment advice.
          </p>
        </div>
      </div>
    </header>
  );
}
