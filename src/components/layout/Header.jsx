import React, { useState } from 'react';
import { Menu, X, Home } from 'lucide-react';
import { cn } from '../../lib/utils';
import logoUrl from '../../assets/logo.svg';

export function Header({ activeView, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (view) => {
    onNavigate && onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => handleNavigate('home')}
          >
            <img src={logoUrl} alt="FinEye Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight leading-none font-jakarta">FinEye</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {activeView !== 'home' && (
              <button
                onClick={() => handleNavigate('home')}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Home"
              >
                <Home className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={() => handleNavigate('dashboard')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeView === 'dashboard'
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              Insights
            </button>
            <button
              onClick={() => handleNavigate('compare')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeView === 'compare'
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              )}
            >
              Fund Compare
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <button
              onClick={() => handleNavigate('home')}
              className={cn(
                "w-full flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeView === 'home'
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={() => handleNavigate('dashboard')}
              className={cn(
                "w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeView === 'dashboard'
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              Insights
            </button>
            <button
              onClick={() => handleNavigate('compare')}
              className={cn(
                "w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeView === 'compare'
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              Fund Compare
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
