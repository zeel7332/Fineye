import React from 'react';
import { Logo } from '../common/Logo';

export function Footer({ onNavigate, activeView }) {
  const links = [
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact' },
    { label: 'Privacy', view: 'privacy' },
    { label: 'Terms', view: 'terms' },
    { label: 'Disclaimer', view: 'disclaimer' },
  ];

  return (
    <footer className="bg-white border-t border-slate-200 py-8 sm:py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-8">
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
            {links.map(link => (
              <button
                key={link.view}
                onClick={() => onNavigate?.(link.view)}
                className={`text-sm transition-colors font-medium ${
                  activeView === link.view 
                    ? 'text-primary' 
                    : 'text-slate-600 hover:text-primary'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:block"></div>

          <div className="text-center md:text-right">
            <details className="text-[10px] sm:text-xs inline-block">
              <summary className="cursor-pointer text-slate-600 hover:text-slate-800 font-medium list-none">
                Data Source & Transparency ▾
              </summary>
              <div className="mt-2 text-slate-500 max-w-xs mx-auto md:ml-auto md:mr-0 bg-slate-50 p-3 rounded-lg border border-slate-100">
                Portfolio disclosures published by AMCs and AMFI. We strive for accuracy but data may be delayed or subject to AMC reporting errors.
              </div>
            </details>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5" />
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} FinEye. Built for Indian Investors.
            </p>
          </div>
          <p className="text-[10px] text-slate-400 max-w-md text-center md:text-right italic">
            Disclaimer: FinEye is not a SEBI registered advisor. All data is for educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
