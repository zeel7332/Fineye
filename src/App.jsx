import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from './components/layout/Layout';
import { SmartMoneyView } from './components/dashboard/SmartMoneyView';
import { FavoriteStocksView } from './components/dashboard/FavoriteStocksView';
import { SoldStocksView } from './components/dashboard/SoldStocksView';
import { cn } from './lib/utils';
import { fetchCsv } from './lib/fetchCsv';
import { DATA_CSV_URL } from './config';
import { X } from 'lucide-react';

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
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={pageSafe === 1}
            className="px-2 sm:px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-xs sm:text-sm"
          >
            Prev
          </button>
          <div className="text-[10px] sm:text-sm text-slate-600 font-medium">
            Page {pageSafe} / {totalPages}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={pageSafe === totalPages}
            className="px-2 sm:px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-xs sm:text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('smart-money');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fundsPage, setFundsPage] = useState(null);
  const [showHero, setShowHero] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('hideHero') === '1' ? false : true;
    }
    return true;
  });

  useEffect(() => {
    const url = DATA_CSV_URL && DATA_CSV_URL.length > 0 ? DATA_CSV_URL : 'data.csv';
    fetchCsv(url)
      .then(rows => {
        setData(rows);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load data');
        setLoading(false);
      });
  }, []);

  const tabs = [
    { id: 'smart-money', label: 'Where Smart Money Goes' },
    { id: 'future-1', label: 'Funds’ Favorite Stocks' },
    { id: 'future-2', label: 'Top Sold Stocks by Funds' },
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
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {showHero && (
          <div className="relative text-center py-4 sm:py-6 px-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">Mutual Fund Insights</h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">Clear, simple views into how mutual funds are investing.</p>
            <button
              onClick={() => {
                setShowHero(false);
                if (typeof window !== 'undefined' && window.localStorage) {
                  window.localStorage.setItem('hideHero', '1');
                }
              }}
              aria-label="Hide intro"
              className="absolute top-0 right-0 sm:top-2 sm:right-2 inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}

        {!fundsPage && activeView === 'dashboard' && (
          <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <nav className="flex gap-2 min-w-max" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={
                    tab.id === 'smart-money'
                      ? 'Stocks most owned by mutual funds'
                      : tab.id === 'future-1'
                      ? 'Stocks most bought this month'
                      : 'More insights coming soon'
                  }
                  className={cn(
                    'whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}
        {/* Removed global month label to rely on dataset-driven labels inside each section */}
        {activeView === 'dashboard' && !fundsPage && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 sm:p-4 mx-1 sm:mx-0">
            {activeTab === 'smart-money' && (
              <div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  This section shows which stocks are most commonly held by mutual funds. A higher rank means the stock is owned by more funds.
                </p>
              </div>
            )}
            {activeTab === 'future-1' && (
              <div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  See which stocks mutual funds added more of in the selected month. Stocks higher in the list saw stronger buying activity.
                </p>
              </div>
            )}
            {activeTab === 'future-2' && (
              <div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  See which stocks mutual funds reduced or sold in the selected month. Stocks higher in the list saw more selling by funds.
                </p>
              </div>
            )}
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
                monthLabel={monthLabel}
              />
            )
          )}
          {activeView === 'dashboard' && !fundsPage && activeTab === 'future-1' && (
            <FavoriteStocksView monthLabel={monthLabel} />
          )}
          {activeView === 'dashboard' && !fundsPage && activeTab === 'future-2' && (
            <SoldStocksView monthLabel={monthLabel} />
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
          {activeView === 'about' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 mx-1 sm:mx-0">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">About FinEye</h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                FinEye is an educational finance website. We help you observe how mutual funds behave—what they’re buying or holding—so you can learn patterns without receiving advice.
              </p>
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-semibold text-slate-800">Purpose</h4>
                <p className="text-sm sm:text-base text-slate-700">Learning and research. We present insights to make disclosures easier to understand.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-semibold text-slate-800">Data Sources</h4>
                <p className="text-sm sm:text-base text-slate-700">Public mutual fund disclosures compiled into a structured dataset.</p>
                <p className="text-[10px] sm:text-xs text-slate-500">Data freshness depends on the latest available disclosures.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-semibold text-slate-800">What FinEye does</h4>
                <p className="text-sm sm:text-base text-slate-700">Shows which stocks mutual funds are buying or holding.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-semibold text-slate-800">What FinEye does NOT do</h4>
                <p className="text-sm sm:text-base text-slate-700">No stock recommendations, no tips, and no guarantees.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-semibold text-slate-800">Disclaimer</h4>
                <p className="text-sm sm:text-base text-slate-700">For educational and informational purposes only. You are responsible for your decisions.</p>
                <p className="text-[10px] sm:text-xs text-slate-500">Always do your own research.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm sm:text-base font-semibold text-slate-800">North Star</h4>
                <p className="text-sm sm:text-base text-slate-700">FinEye helps you observe smart money — not follow it blindly.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
