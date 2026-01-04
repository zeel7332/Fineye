import React from 'react';
import { ArrowRight, TrendingUp, BarChart3, PieChart, Shield, Check, Scale, Compass } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LandingPage({ onNavigate }) {
  return (
    <div className="space-y-4 sm:space-y-8 py-4 sm:py-6">
      
      {/* 1. Hero Content */}
      <section className="text-center space-y-2 sm:space-y-4 max-w-4xl mx-auto px-4">
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            See Where <br className="hidden sm:block" />
            <span className="text-primary">Mutual Funds</span> Are Investing
          </h1>
          <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Track what Indian mutual funds are buying, selling, and holding — based on their latest monthly portfolio disclosures.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 pt-1 sm:pt-2">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
          >
            View Mutual Fund Insights
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button 
            onClick={() => onNavigate('compare')}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Compare Funds
          </button>
        </div>
      </section>

      {/* 2. Interactive Hero Cards (2-column layout) */}
      <section className="grid md:grid-cols-2 gap-3 sm:gap-4 max-w-5xl mx-auto px-4">
        
        {/* A) Market Insights Card */}
        <div 
          onClick={() => onNavigate('dashboard')}
          className="group relative bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="relative space-y-3 sm:space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">Mutual Fund Insights</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">Discover what mutual funds are buying and selling right now.</p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Perfect for you if you want to:</p>
              <ul className="space-y-1 sm:space-y-1.5">
                {[
                  "Understand which stocks are most favored",
                  "See stocks newly added by mutual funds",
                  "See where funds are selling holdings",
                  "Identify stocks held by many funds"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-1.5 sm:pt-2 border-t border-slate-100">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-1.5">What you'll see:</p>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {["Highest Funded Stocks", "Fresh Buying", "Recent Selling", "Fund Holdings"].map((tag, i) => (
                  <span key={i} className="px-1.5 sm:px-2 py-0.5 bg-slate-50 text-slate-600 text-[9px] sm:text-[10px] font-medium rounded-md border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-0.5 flex items-center text-primary font-bold text-[11px] sm:text-xs group-hover:translate-x-1 transition-transform">
              View Mutual Fund Insights <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>

        {/* B) Fund Compare Card */}
        <div 
          onClick={() => onNavigate('compare')}
          className="group relative bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all duration-300 cursor-pointer overflow-hidden"
        >
          <div className="relative space-y-3 sm:space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Fund Compare</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">Compare mutual fund portfolios to avoid owning the same stocks across multiple funds.</p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Perfect for you if you want to:</p>
              <ul className="space-y-1 sm:space-y-1.5">
                {[
                  "Compare funds to find unique value",
                  "Check portfolio overlap & avoid duplication",
                  "Understand concentration risk",
                  "Get smart recommendations"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                    <Check className="w-3.5 h-3.5 text-purple-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-1.5 sm:pt-2 border-t border-slate-100">
              <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-1.5">What you'll see:</p>
              <div className="flex flex-wrap gap-1 sm:gap-1.5">
                {["Portfolio Overlap %", "Common Stocks", "Unique Holdings", "Sector Breakdown"].map((tag, i) => (
                  <span key={i} className="px-1.5 sm:px-2 py-0.5 bg-slate-50 text-slate-600 text-[9px] sm:text-[10px] font-medium rounded-md border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-0.5 flex items-center text-purple-600 font-bold text-[11px] sm:text-xs group-hover:translate-x-1 transition-transform">
              Start Comparing <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>
        </div>

      </section>

      {/* 3. Value Proposition Section */}
      <section className="bg-white border-y border-slate-100 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-6 sm:gap-8">
            {[
              { 
                icon: BarChart3, 
                title: "Latest Mutual Fund Data", 
                desc: "Updated monthly from official AMC disclosures.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              { 
                icon: Compass, 
                title: "Smart Insights", 
                desc: "Decode complex market moves instantly.",
                color: "text-indigo-600",
                bg: "bg-indigo-50"
              },
              { 
                icon: TrendingUp, 
                title: "Better Returns", 
                desc: "Align your portfolio with smart money.",
                color: "text-green-600",
                bg: "bg-green-50"
              },
              { 
                icon: Shield, 
                title: "Easy Navigation", 
                desc: "Simple tools for complex analysis.",
                color: "text-orange-600",
                bg: "bg-orange-50"
              }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-1.5 sm:space-y-2 group">
                <div className={cn("w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-lg sm:rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110", item.bg)}>
                  <item.icon className={cn("w-5 h-5 sm:w-6 sm:h-6", item.color)} />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</h3>
                <p className="text-[10px] sm:text-xs text-slate-500 leading-tight max-w-[140px] sm:max-w-[180px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Keywords (Subtle Footer) */}
      <div className="py-6 border-t border-slate-100 mt-auto flex flex-col items-center gap-4">
        <p className="text-[10px] text-slate-300 flex flex-wrap justify-center gap-x-4 gap-y-2 text-center px-4">
          <span>Indian mutual funds</span>
          <span className="w-1 h-1 rounded-full bg-slate-200 my-auto" />
          <span>Mutual fund portfolio holdings</span>
          <span className="w-1 h-1 rounded-full bg-slate-200 my-auto" />
          <span>Mutual fund overlap</span>
          <span className="w-1 h-1 rounded-full bg-slate-200 my-auto" />
          <span>Fund buying and selling data</span>
        </p>
      </div>

    </div>
  );
}