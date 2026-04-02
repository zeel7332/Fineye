import React from 'react';
import { ArrowRight, Check, X as XIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LandingPage({ onNavigate }) {
  return (
    <div className="space-y-0 sm:space-y-0">
      <style>{`
        @keyframes tickerSlide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="w-full border-b border-indigo-100 bg-indigo-50/60">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="whitespace-nowrap flex items-center text-[12px] sm:text-[12px] text-indigo-900 py-2 sm:py-2.5 gap-8 sm:gap-12"
               style={{ animation: 'tickerSlide 40s linear infinite' }}>
            {[
              { text: '398 funds hold HDFC Bank this month', badge: '↑ Most held', tone: 'indigo' },
              { text: 'HDFC Bank Ltd. — freshly bought by 7.88 Cr shares', badge: '↑ New entry', tone: 'green' },
              { text: 'Infosys Ltd. added by funds worth ₹5,877 Cr', badge: '↑ Trending', tone: 'green' },
              { text: 'ICICI Bank Ltd. — 4.02 Cr shares added this month', badge: '↑ Strong buy', tone: 'green' },
              { text: 'Data updated from Feb 2026 SEBI disclosures', badge: '', tone: 'indigo' },
              { text: 'State Bank Of India — fresh sell signal, 7.75 Cr shares', badge: '↓ Selling', tone: 'red' },
            ].concat([
              { text: '398 funds hold HDFC Bank this month', badge: '↑ Most held', tone: 'indigo' },
              { text: 'HDFC Bank Ltd. — freshly bought by 7.88 Cr shares', badge: '↑ New entry', tone: 'green' },
              { text: 'Infosys Ltd. added by funds worth ₹5,877 Cr', badge: '↑ Trending', tone: 'green' },
              { text: 'ICICI Bank Ltd. — 4.02 Cr shares added this month', badge: '↑ Strong buy', tone: 'green' },
              { text: 'Data updated from Feb 2026 SEBI disclosures', badge: '', tone: 'indigo' },
              { text: 'State Bank Of India — fresh sell signal, 7.75 Cr shares', badge: '↓ Selling', tone: 'red' },
            ]).map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-indigo-900">{item.text}</span>
                {item.badge && (
                  <span className={cn(
                    "text-[11px] font-bold px-1.5 py-0.5 rounded-md",
                    item.tone === 'green' ? "bg-green-50 text-green-700" : "bg-indigo-100 text-indigo-700"
                  )}>{item.badge}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6 pb-6 sm:pb-6 text-center overflow-x-hidden">
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-100 rounded-full px-2.5 py-1">
          <span>For first-time investors</span>
          <span className="w-1 h-1 rounded-full bg-indigo-300" />
          <span>100% free</span>
        </div>
        <h1 className="mt-2 text-slate-900 font-semibold leading-tight break-words"
            style={{ fontSize: 'clamp(28px, 8vw, 52px)' }}>
          <span className="block">Investing feels confusing.</span>
          <span className="block"><span className="text-indigo-700 italic">We make it easy</span> to understand.</span>
        </h1>
        <p className="mt-3 text-[14px] sm:text-[16px] text-slate-600 leading-[1.6] max-w-[520px] mx-auto px-2">
          Choose stocks and mutual funds based on information in easy‑to‑understand language.
          No ratios. No complicated charts. Just simple insights from real portfolios.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-5 text-[11px] sm:text-[13px] font-medium text-slate-700">
          <div className="flex items-center gap-1.5 justify-center">
            <span className="inline-flex items-center justify-center w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full bg-[#FEE2E2] border border-red-200 shrink-0">
              <XIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-700" />
            </span>
            <span className="whitespace-nowrap">No PE ratios</span>
          </div>
          <span className="hidden sm:block w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-1.5 justify-center">
            <span className="inline-flex items-center justify-center w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full bg-[#FEE2E2] border border-red-200 shrink-0">
              <XIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-700" />
            </span>
            <span className="whitespace-nowrap">No balance sheets</span>
          </div>
          <span className="hidden sm:block w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-1.5 justify-center">
            <span className="inline-flex items-center justify-center w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full bg-[#FEE2E2] border border-red-200 shrink-0">
              <XIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-700" />
            </span>
            <span className="whitespace-nowrap">No overwhelming charts</span>
          </div>
          <span className="hidden sm:block w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-1.5 justify-center">
            <span className="inline-flex items-center justify-center w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full bg-[#FEE2E2] border border-red-200 shrink-0">
              <XIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-700" />
            </span>
            <span className="whitespace-nowrap">No finance degree needed</span>
          </div>
        </div>
        <p className="mt-2.5 text-[11px] sm:text-[13px] text-slate-500 px-4">
          Used by students, first jobbers, and anyone who’s ever Googled <span className="text-green-600 font-medium">“what is PE ratio”</span>
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 cursor-pointer w-full"
          >
            <div className="absolute inset-x-0 top-0 h-[2.5px] rounded-t-2xl bg-indigo-600" />
            <div className="h-full flex flex-col items-center text-center">
                <div className="text-[18px] sm:text-[22px] leading-tight font-semibold text-slate-900 min-h-[28px] flex items-center">Explore Stocks</div>
                <p className="mt-2 text-[13px] text-slate-600 leading-[1.55] max-w-[320px] min-h-[58px]">
                  See which stocks experienced investors are buying this month — explained in plain language, no finance knowledge needed.
                </p>
                <div className="pt-3 w-full sm:w-auto">
                  <div className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-[14px] font-semibold shadow-sm w-full sm:w-auto hover:bg-indigo-700 transition-colors">
                    Start exploring <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('compare')}
            className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-300 cursor-pointer w-full"
          >
            <div className="absolute inset-x-0 top-0 h-[2.5px] rounded-t-2xl bg-teal-600" />
            <div className="h-full flex flex-col items-center text-center">
                <div className="text-[18px] sm:text-[22px] leading-tight font-semibold text-slate-900 min-h-[28px] flex items-center">Pick a Mutual Fund</div>
                <p className="mt-2 text-[13px] text-slate-600 leading-[1.55] max-w-[320px] min-h-[58px]">
                  Not sure which mutual fund to choose? Find the right one for you, check if your funds overlap, and invest with confidence.
                </p>
                <div className="pt-3 w-full sm:w-auto">
                  <div className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 text-white text-[14px] font-semibold shadow-sm w-full sm:w-auto hover:bg-teal-700 transition-colors">
                    Find my fund <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
            </div>
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[11px] sm:text-[12px] text-slate-600 px-4">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 shrink-0" />
            <span>Real data from SEBI</span>
          </div>
          <span className="hidden sm:block w-px h-3.5 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 shrink-0" />
            <span>Updated every month</span>
          </div>
          <span className="hidden sm:block w-px h-3.5 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 shrink-0" />
            <span>Always free</span>
          </div>
          <span className="hidden sm:block w-px h-3.5 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 shrink-0" />
            <span>Zero jargon</span>
          </div>
        </div>
      </section>

      
    </div>
  );
}
