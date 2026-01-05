import React, { useEffect, useMemo, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Layout } from './components/layout/Layout';
import { SmartMoneyView } from './components/dashboard/SmartMoneyView';
import { FavoriteStocksView } from './components/dashboard/FavoriteStocksView';
import { SoldStocksView } from './components/dashboard/SoldStocksView';
import { FundCompareView } from './components/dashboard/FundCompareView';
import { EducationView } from './components/dashboard/EducationView';
import { LegalContent } from './components/dashboard/LegalContent';
import { LandingPage } from './components/dashboard/LandingPage';
import { cn } from './lib/utils';
import { fetchCsv } from './lib/fetchCsv';
import { DATA_CSV_URL } from './config';
import { Logo } from './components/common/Logo';
import { TrendingUp, Scale, Wallet, Heart, TrendingDown, Info } from 'lucide-react';

function FundsListPage({ stock, classificationFilter, onBack, monthLabel }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 25;
  const rows = useMemo(() => {
    if (!stock) return [];
    const base = [...stock.funds]
      .filter(f => {
        const cls = (f.classification || '').trim();
        const list = Array.isArray(classificationFilter) ? classificationFilter : [];
        return list.length === 0 || list.includes(cls);
      })
      .filter(f => {
        if (!search.trim()) return true;
        return (f.fund_name || '').toLowerCase().includes(search.toLowerCase());
      })
      .sort((a, b) => {
        const av = typeof b.percent_aum === 'number' ? b.percent_aum : -Infinity;
        const aa = typeof a.percent_aum === 'number' ? a.percent_aum : -Infinity;
        return av - aa;
      });
    return base;
  }, [stock, classificationFilter, search]);
  const totalPages = Math.max(1, Math.ceil(rows.length / itemsPerPage));
  const pageSafe = Math.min(totalPages, page);
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 sm:px-0">
        <div className="flex items-center gap-2">
          <span className="text-lg sm:text-xl font-semibold text-slate-900 truncate">{stock?.name}</span>
          <span className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">
            {new Set(rows.map(r => r.fund_name)).size} funds
          </span>
        </div>
        <button
          onClick={onBack}
          className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-sm w-fit"
        >
          Back
        </button>
      </div>
      <div className="flex gap-3 px-1 sm:px-0">
        <input
          type="text"
          placeholder="Search funds…"
          className="w-full max-w-md px-3 py-2 rounded-md border border-slate-300 bg-white text-slate-800 focus:outline-none text-sm"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white mx-1 sm:mx-0">
        {!!monthLabel && (
          <div className="px-4 sm:px-6 py-2 text-[10px] sm:text-xs text-slate-600 border-b border-slate-200">
            Data for: {monthLabel}
          </div>
        )}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Fund Name</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Classification</th>
                <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Month</th>
                <th className="px-4 sm:px-6 py-3 text-right whitespace-nowrap">Allocation %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows
                .slice((pageSafe - 1) * itemsPerPage, pageSafe * itemsPerPage)
                .map((fund, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 sm:px-6 py-3 font-medium text-slate-800 min-w-[200px]">{fund.fund_name}</td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{fund.classification || '—'}</td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">{fund.month || '—'}</td>
                    <td className="px-4 sm:px-6 py-3 text-right whitespace-nowrap font-medium text-slate-900">{typeof fund.percent_aum === 'number' ? `${fund.percent_aum}%` : '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-[10px] sm:text-xs text-slate-500 font-medium order-2 sm:order-1">
            Showing <span className="text-slate-900">{((pageSafe - 1) * itemsPerPage) + 1}</span> to <span className="text-slate-900">{Math.min(pageSafe * itemsPerPage, rows.length)}</span> of <span className="text-slate-900">{rows.length}</span> results
          </div>

          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={pageSafe === 1}
              className="px-2 sm:px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-xs sm:text-sm transition-all shadow-sm"
            >
              Prev
            </button>
            
            <div className="flex gap-1 overflow-x-auto max-w-[120px] sm:max-w-none scrollbar-hide">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => {
                  if (totalPages <= 5) return true;
                  if (n === 1 || n === totalPages) return true;
                  if (Math.abs(n - pageSafe) <= 1) return true;
                  return false;
                })
                .map((n, i, arr) => (
                  <React.Fragment key={n}>
                    {i > 0 && arr[i-1] !== n - 1 && (
                      <span className="px-1 text-slate-400 self-center text-xs">...</span>
                    )}
                    <button
                      onClick={() => setPage(n)}
                      className={cn(
                        n === pageSafe ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300",
                        "px-2 sm:px-3 py-1 rounded border text-[10px] sm:text-sm flex-shrink-0 transition-all"
                      )}
                    >
                      {n}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={pageSafe === totalPages}
              className="px-2 sm:px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-xs sm:text-sm transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeView, setActiveView] = useState('home');
  const [activeTab, setActiveTab] = useState('smart-money');
  const [data, setData] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);
  const [sellsData, setSellsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fundsPage, setFundsPage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeView, activeTab, fundsPage]);

  useEffect(() => {
    const dataUrl = DATA_CSV_URL && DATA_CSV_URL.length > 0 ? DATA_CSV_URL : 'data.csv';
    const favoritesUrl = 'Stock_Buy_Nov-25 (1).csv';
    const sellsUrl = 'Stock_Sell_Nov-25.csv';

    setLoading(true);
    
    Promise.all([
      fetchCsv(dataUrl).catch(() => []),
      fetchCsv(favoritesUrl).catch(() => []),
      fetchCsv(sellsUrl).catch(() => [])
    ])
      .then(([mainData, favData, sellData]) => {
        setData(mainData);
        setFavoritesData(favData);
        setSellsData(sellData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load data');
        setLoading(false);
      });
  }, []);

  const tabs = [
    { id: 'smart-money', label: 'Smart Money', icon: Wallet },
    { id: 'fresh-buy', label: 'Fresh Buy', icon: Heart },
    { id: 'top-sold', label: 'Top Sold', icon: TrendingDown },
  ];
  const monthLabel = useMemo(() => {
    const names = ["january","february","march","april","may","june","july","august","september","october","november","december"];
    const parse = (m) => {
      const s = (m || "").toString().trim();
      if (!s) return null;
      const parts = s.split(/[-\s]/).filter(Boolean);
      if (parts.length < 2) return null;
      const mi = names.indexOf(parts[0].toLowerCase());
      const yr = parseInt(parts[1], 10);
      if (mi < 0 || isNaN(yr)) return null;
      return { mi, yr, rawMonth: parts[0][0].toUpperCase() + parts[0].slice(1).toLowerCase(), rawYear: parts[1] };
    };
    const vals = (data || []).map(r => parse(r.month)).filter(Boolean);
    if (vals.length === 0) return "";
    const best = vals.reduce((a, b) => (b.yr > a.yr || (b.yr === a.yr && b.mi > a.mi) ? b : a));
    return `${best.rawMonth} ${best.rawYear}`;
  }, [data]);

  return (
    <Layout
      activeView={activeView}
      onNavigate={(view) => {
        setFundsPage(null);
        setActiveView(view);
      }}
    >
      <Analytics />
      {activeView === 'home' ? (
        <LandingPage onNavigate={(view) => {
          setFundsPage(null);
          setActiveView(view);
        }} />
      ) : (
      <div className="max-w-6xl mx-auto space-y-2 sm:space-y-3">
        {/* Compact Hero Section */}
        <div className="relative overflow-hidden bg-white/50 rounded-xl border border-slate-200/60 p-2 sm:p-3">
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Logo className="w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-tight">
                  Mutual Fund Insights
                </h2>
                <p className="text-[10px] text-slate-500 hidden sm:block">
                  Track smart money moves, discover fresh buys/sells, and find portfolio overlaps.
                </p>
              </div>
            </div>
          </div>
        </div>

        {!fundsPage && activeView === 'dashboard' && (
          <div className="overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <nav className="flex gap-1.5 min-w-max sm:min-w-0 sm:flex-nowrap" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "group relative flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap",
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-white text-slate-500 hover:text-slate-900 border border-slate-200"
                    )}
                  >
                    <Icon className={cn("w-3 h-3 transition-transform", isActive ? "scale-110" : "text-slate-400 group-hover:text-blue-600")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}

        {/* Section Info Banner - Even More Compact */}
        {activeView === 'dashboard' && !fundsPage && (
          <div className="space-y-2">
            <div className="bg-indigo-50/50 rounded-xl border border-indigo-100 p-2 sm:p-2.5 mx-1 sm:mx-0 flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-lg shrink-0 shadow-sm">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <p className="text-[11px] sm:text-xs text-indigo-900/80 leading-tight">
                <span className="font-bold text-indigo-900 mr-1">
                  {activeTab === 'smart-money' && "Most Held Stocks:"}
                  {activeTab === 'fresh-buy' && "Strongest Buying:"}
                  {activeTab === 'top-sold' && "Top Selling:"}
                </span>
                {activeTab === 'smart-money' && "Stocks owned by the highest number of mutual funds."}
                {activeTab === 'fresh-buy' && "Stocks where funds increased their holdings most this month."}
                {activeTab === 'top-sold' && "Stocks where funds reduced their holdings most this month."}
              </p>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50/80 border border-slate-200/60 rounded-lg mx-1 sm:mx-0">
              <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                All insights are based on the most recent mutual fund portfolios and are updated after the 10th of each month, following official disclosures by fund houses.
              </p>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeView === 'dashboard' && !fundsPage && activeTab === 'smart-money' && (
            loading ? (
              <div className="flex items-center justify-center py-20 text-slate-500 text-sm">Loading data…</div>
            ) : error ? (
              <div className="flex items-center justify-center py-20 text-red-600 text-sm px-4 text-center">{error}</div>
            ) : (
              <SmartMoneyView
                data={data}
                onOpenFundsPage={(stock, classifications) => setFundsPage({ stock, classifications })}
                onNavigate={(view) => setActiveView(view)}
                monthLabel={monthLabel}
              />
            )
          )}
          {activeView === 'dashboard' && !fundsPage && activeTab === 'fresh-buy' && (
            <FavoriteStocksView monthLabel={monthLabel} initialData={favoritesData} />
          )}
          {activeView === 'dashboard' && !fundsPage && activeTab === 'top-sold' && (
            <SoldStocksView monthLabel={monthLabel} initialData={sellsData} />
          )}
          {activeView === 'dashboard' && fundsPage && (
            <>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 sm:p-4 mb-4 mx-1 sm:mx-0">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Full list of funds holding this stock. Use search to jump to a fund, and browse pages for the rest. Check classification and month to understand the context.
                </p>
              </div>
              <FundsListPage
                stock={fundsPage.stock}
                classificationFilter={fundsPage.classifications}
                onBack={() => setFundsPage(null)}
                monthLabel={monthLabel}
              />
            </>
          )}
          {activeView === 'compare' && (
            <FundCompareView data={data} />
          )}
          {activeView === 'learn' && (
            <EducationView onNavigate={(view) => setActiveView(view)} />
          )}
          {['about', 'privacy', 'terms', 'disclaimer', 'contact'].includes(activeView) && (
            <LegalContent type={activeView} />
          )}
        </div>
      </div>
      )}
    </Layout>
  );
}

export default App;
