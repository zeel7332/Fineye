import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} FinEye. Built for Indian Investors.
        </p>
        <div className="mt-3 flex items-center justify-center">
          <details className="text-xs">
            <summary className="cursor-pointer text-slate-600 hover:text-slate-800">
              Data Source
            </summary>
            <div className="mt-2 text-slate-500">
              Mutual fund portfolio disclosures published by AMCs and AMFI. Data may be delayed.
            </div>
          </details>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Data is for informational purposes only. Not investment advice.
        </p>
      </div>
    </footer>
  );
}
