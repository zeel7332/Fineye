import React from 'react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Search, 
  Layers, 
  BarChart3, 
  PieChart, 
  Zap, 
  ArrowRight,
  BookOpen,
  Target,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function EducationView({ onNavigate }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Complete Guide to Mutual Funds, Stock Market Investing & Trading Strategies",
    "description": "Expert insights on mutual funds, stock market investing, trading strategies, portfolio management, and wealth creation. Learn how to invest wisely and grow your money.",
    "author": {
      "@type": "Organization",
      "name": "FinEye"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FinEye",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fineye.info/favicon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://fineye.info/learn"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Why should I follow mutual fund holdings for stock selection?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Following mutual fund holdings provides professional vetting. Fund managers conduct deep research and analysis before investing, which reduces individual risk and research burden for retail investors."
        }
      },
      {
        "@type": "Question",
        "name": "What is the 'Smart Money' strategy in investing?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Smart Money strategy involves identifying stocks that have the highest institutional confidence, typically measured by the number of mutual funds holding the stock or significant increases in their holdings."
        }
      }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Identify Safer Stock Options Using Mutual Fund Data",
    "step": [
      {
        "@type": "HowToStep",
        "text": "Select a sector category you are interested in (e.g., Metals or IT)."
      },
      {
        "@type": "HowToStep",
        "text": "Apply market capitalization filters such as Small Cap or Mid Cap to narrow your search."
      },
      {
        "@type": "HowToStep",
        "text": "Review mutual fund investment data for the filtered stocks."
      },
      {
        "@type": "HowToStep",
        "text": "Prioritize stocks with the highest number of fund investments, indicating institutional confidence."
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-3 sm:px-6 space-y-8 sm:space-y-16">
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>

      {/* Hero Section */}
      <section className="text-center space-y-4 px-2 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          Investor Education
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Identifying Safer Investments: <br className="hidden sm:block" />
          <span className="text-blue-600">The Smart Money Way</span>
        </h1>
        <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          New to investing? Learn how to leverage institutional expertise to build a high-confidence portfolio.
        </p>
      </section>

      {/* Recommended Strategy Section */}
      <section id="smart-money-strategy" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-20 mx-1 sm:mx-0">
        <div className="p-5 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg sm:rounded-xl">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Recommended Strategy</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                Institutional Vetting
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Focus on stocks widely held by mutual funds. These have passed rigorous research processes of professional fund managers.
              </p>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                Lower Risk Approach
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Follow the "Smart Money" instead of unverified tips. It provides a safety net built on institutional confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sector-Specific Process */}
      <section className="space-y-6 px-1 sm:px-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg sm:rounded-xl">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Investment Process</h2>
        </div>

        <div className="relative pl-2 sm:pl-0">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-slate-100" />
          
          <div className="space-y-8 sm:space-y-12 relative">
            {/* Step 1 */}
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center shrink-0 z-10 shadow-sm">
                <Search className="w-5 h-5 sm:w-7 sm:h-7 text-indigo-600" />
              </div>
              <div className="space-y-1 sm:space-y-2 pt-1 sm:pt-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">1. Filtering Criteria</h3>
                <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
                  Start by narrowing down the universe. For example, select <span className="font-semibold text-slate-900">Metals Sector</span>, then apply <span className="font-semibold text-slate-900">Small Cap</span> filter to find hidden gems.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 sm:gap-6 items-start">
              <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center shrink-0 z-10 shadow-sm">
                <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7 text-indigo-600" />
              </div>
              <div className="space-y-1 sm:space-y-2 pt-1 sm:pt-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">2. Selection Methodology</h3>
                <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
                  Review fund participation. Prioritize stocks with the <span className="font-semibold text-slate-900">highest number of fund investments</span> as it indicates strong institutional confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Steps */}
      <section className="bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white space-y-6 sm:space-y-8 mx-1 sm:mx-0">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-3xl font-bold">Implementation Steps</h2>
          <p className="text-xs sm:text-base text-slate-400">How to use FinEye to execute this strategy.</p>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {[
            "Use 'Smart Money' to filter by Sector.",
            "Apply Market Capitalization filters.",
            "Sort by 'Number of Funds' for top choices.",
            "Verify fundamental metrics before investing."
          ].map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 sm:gap-4 bg-white/5 rounded-xl p-3 sm:p-4 border border-white/10">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">
                {idx + 1}
              </div>
              <span className="text-slate-200 text-xs sm:text-base font-medium">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits & Considerations */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 mx-1 sm:mx-0">
        <section className="bg-green-50/50 rounded-xl sm:rounded-2xl border border-green-100 p-5 sm:p-6 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-green-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Key Benefits
          </h2>
          <ul className="space-y-2 sm:space-y-3">
            {[
              "Reduces individual research burden",
              "Leverages professional expertise",
              "Provides diversified exposure",
              "Institutional validation"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 sm:gap-3 text-green-800 text-[11px] sm:text-sm">
                <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-amber-50/50 rounded-xl sm:rounded-2xl border border-amber-100 p-5 sm:p-6 space-y-3 sm:space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-amber-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            Considerations
          </h2>
          <ul className="space-y-2 sm:space-y-3">
            {[
              "Monitor holdings periodically",
              "Review sector outlook",
              "Maintain portfolio allocation",
              "Consider dollar-cost averaging"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 sm:gap-3 text-amber-800 text-[11px] sm:text-sm">
                <ArrowRight className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* CTA Footer */}
      <section className="text-center py-6 sm:py-8 border-t border-slate-100 px-4 space-y-4">
        <p className="text-slate-500 text-[11px] sm:text-sm">
          Ready to put this strategy into practice?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Start Investing Now
            <Zap className="w-4 h-4 fill-current" />
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
          >
            Back to Top
            <ArrowRight className="w-4 h-4 -rotate-90" />
          </button>
        </div>
      </section>
    </div>
  );
}
