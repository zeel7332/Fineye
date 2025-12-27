import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 sm:py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs sm:text-sm text-slate-500">
          © {new Date().getFullYear()} FinEye. Built for Indian Investors.
        </p>
        <div className="mt-2 sm:mt-3 flex items-center justify-center">
          <details className="text-[10px] sm:text-xs">
            <summary className="cursor-pointer text-slate-600 hover:text-slate-800 font-medium">
              Data Source
            </summary>
            <div className="mt-2 text-slate-500 max-w-xs mx-auto">
              Mutual fund portfolio disclosures published by AMCs and AMFI. Data may be delayed.
            </div>
          </details>
        </div>
        <p className="text-[10px] sm:text-xs text-slate-400 mt-2 px-4">
          Data is for informational purposes only. Not investment advice.
        </p>
      </div>
    </footer>
  );
}
