import React, { useEffect, useState } from 'react';
import { Eye, Menu, X } from 'lucide-react';

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

  return (
    <header className={`sticky top-0 z-50 border-b ${scrolled ? 'bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-slate-200' : 'bg-white border-slate-200'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">FinEye</h1>
            <p className="text-[10px] sm:text-xs text-slate-500 hidden xs:block">Observe smart money — not follow it blindly.</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-2 text-sm font-medium text-slate-600">
          <button
            onClick={() => handleNavigate('dashboard')}
            className={`${activeView === 'dashboard' ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-primary/10 hover:text-primary'} px-3 py-1 rounded-full border border-slate-200 transition-colors`}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleNavigate('about')}
            className={`${activeView === 'about' ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-primary/10 hover:text-primary'} px-3 py-1 rounded-full border border-slate-200 transition-colors`}
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
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'dashboard' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-700'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigate('about')}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeView === 'about' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-700'}`}
            >
              About
            </button>
          </nav>
        </div>
      )}

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 py-1.5 sm:py-2 text-center sm:text-left">
          <p className="text-[10px] sm:text-[11px] text-slate-500 leading-tight">
            For educational and informational purposes only. Not investment advice.
          </p>
        </div>
      </div>
    </header>
  );
}
