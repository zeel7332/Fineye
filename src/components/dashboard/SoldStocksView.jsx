import React, { useEffect, useMemo, useState } from 'react';
import { Search, TrendingDown, ChevronDown, Filter as FilterIcon } from 'lucide-react';
import { fetchCsv } from '../../lib/fetchCsv';
import { SELLS_CSV_URL } from '../../config';
import { cn } from '../../lib/utils';

export function SoldStocksView({ monthLabel }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassifications, setSelectedClassifications] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [showClassMenu, setShowClassMenu] = useState(false);
  const [showSectorMenu, setShowSectorMenu] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const maxPages = 10;

  useEffect(() => {
    const url = SELLS_CSV_URL && SELLS_CSV_URL.length > 0 ? SELLS_CSV_URL : 'Stock_Sell_Nov-25.csv';
    fetchCsv(url)
      .then(data => {
        setRows(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load sells data');
        setLoading(false);
      });
  }, []);

  const monthLabelMemo = monthLabel;

  const normalized = useMemo(() => {
    return rows
      .map(r => ({
        stock_name: (r.company_name || r.stock_name || '').trim(),
        ticker: (r.ticker || '').trim(),
        sector: (r.sector || '').trim(),
        classification: (r.classification || '').trim(),
        month: (r.month || '').trim(),
        net_qty_sold: typeof r.net_qty_sold === 'number' ? r.net_qty_sold : (r.net_qty_sold ?? null),
        approx_sell_value_cr: typeof r.approx_sell_value_cr === 'number' ? r.approx_sell_value_cr : (r.approx_sell_value_cr ?? null),
      }))
      .filter(r => r.stock_name);
  }, [rows]);

  const classifications = useMemo(() => {
    return Array.from(new Set(normalized.map(r => r.classification).filter(Boolean))).sort();
  }, [normalized]);

  const allSectors = useMemo(() => {
    return Array.from(new Set(normalized.map(r => r.sector).filter(Boolean))).sort();
  }, [normalized]);

  const filtered = useMemo(() => {
    const bySearch = searchTerm
      ? normalized.filter(r => 
          r.stock_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : normalized;
    const byClass = selectedClassifications.length > 0
      ? bySearch.filter(r => selectedClassifications.includes(r.classification))
      : bySearch;
    const bySector = selectedSectors.length > 0
      ? byClass.filter(r => selectedSectors.includes(r.sector))
      : byClass;
    return [...bySector].sort((a, b) => {
      const av = b.approx_sell_value_cr ?? -Infinity;
      const aa = a.approx_sell_value_cr ?? -Infinity;
      if (av !== aa) return av - aa;
      const bv = b.net_qty_sold ?? -Infinity;
      const ba = a.net_qty_sold ?? -Infinity;
      return bv - ba;
    });
  }, [normalized, searchTerm, selectedClassifications, selectedSectors]);

  const totalPages = (() => {
    const pages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const isFiltering = Boolean(searchTerm.trim()) || (selectedClassifications.length > 0) || (selectedSectors.length > 0);
    return isFiltering ? pages : Math.min(maxPages, pages);
  })();

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-500">Loading sells…</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center py-20 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filters Card - Ultra Compact */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm mx-1 sm:mx-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search stock..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Classification */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowClassMenu(v => !v);
                  setShowSectorMenu(false);
                }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  showClassMenu || selectedClassifications.length > 0 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                <FilterIcon className="w-3 h-3" />
                <span>{selectedClassifications.length === 0 ? "Classification" : `${selectedClassifications.length} selected`}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showClassMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showClassMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowClassMenu(false)} />
                  <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl border border-slate-200 shadow-2xl z-20 py-2 max-h-[300px] overflow-y-auto">
                    <div className="px-4 py-1.5 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Classifications</span>
                      {selectedClassifications.length > 0 && (
                        <button onClick={() => setSelectedClassifications([])} className="text-[10px] text-primary font-bold">RESET</button>
                      )}
                    </div>
                    {classifications.map(c => (
                      <label key={c} className="flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-0"
                          checked={selectedClassifications.includes(c)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedClassifications([...selectedClassifications, c]);
                            else setSelectedClassifications(selectedClassifications.filter(x => x !== c));
                            setPage(1);
                          }}
                        />
                        <span className="ml-2.5 text-xs text-slate-600 group-hover:text-slate-900">{c}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Sector */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowSectorMenu(v => !v);
                  setShowClassMenu(false);
                }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  showSectorMenu || selectedSectors.length > 0 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                <FilterIcon className="w-3 h-3" />
                <span>{selectedSectors.length === 0 ? "Sector" : `${selectedSectors.length} selected`}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showSectorMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showSectorMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSectorMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl border border-slate-200 shadow-2xl z-20 py-2 max-h-[300px] overflow-y-auto">
                    <div className="px-4 py-1.5 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Sectors</span>
                      {selectedSectors.length > 0 && (
                        <button onClick={() => setSelectedSectors([])} className="text-[10px] text-primary font-bold">RESET</button>
                      )}
                    </div>
                    {allSectors.map(sec => (
                      <label key={sec} className="flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-0"
                          checked={selectedSectors.includes(sec)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedSectors([...selectedSectors, sec]);
                            else setSelectedSectors(selectedSectors.filter(s => s !== sec));
                            setPage(1);
                          }}
                        />
                        <span className="ml-2.5 text-xs text-slate-600 group-hover:text-slate-900">{sec}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Reset Button */}
            {(selectedClassifications.length > 0 || selectedSectors.length > 0) && (
              <button 
                onClick={() => { setSelectedClassifications([]); setSelectedSectors([]); setPage(1); }}
                className="px-2 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 uppercase"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mx-1 sm:mx-0">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600 min-w-[800px]">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 sm:px-6 py-2.5 text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-slate-50 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)] max-w-[140px] sm:max-w-none">Stock Name</th>
                <th className="px-4 sm:px-6 py-2.5 text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Sector</th>
                <th className="px-4 sm:px-6 py-2.5 text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Classification</th>
                <th className="px-4 sm:px-6 py-2.5 text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Month</th>
                <th className="px-4 sm:px-6 py-2.5 text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Net Qty Sold</th>
                <th className="px-4 sm:px-6 py-2.5 text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap">Approx. Sell Value (Rs cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length > 0 ? (
                paginated.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 group">
                    <td 
                      className="px-4 sm:px-6 py-2 sm:py-2.5 font-medium text-slate-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 transition-colors shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)] max-w-[140px] sm:max-w-none truncate text-xs sm:text-sm"
                      title={row.stock_name}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span className="p-1 bg-amber-50 text-amber-600 rounded-md shrink-0">
                          <TrendingDown className="w-3 h-3" />
                        </span>
                        <span className="truncate">{row.stock_name}</span>
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-2 sm:py-2.5 whitespace-nowrap text-xs sm:text-sm">{row.sector || '—'}</td>
                    <td className="px-4 sm:px-6 py-2 sm:py-2.5 whitespace-nowrap text-xs sm:text-sm">{row.classification || '—'}</td>
                    <td className="px-4 sm:px-6 py-2 sm:py-2.5 whitespace-nowrap text-xs sm:text-sm">{row.month || '—'}</td>
                    <td className="px-4 sm:px-6 py-2 sm:py-2.5 text-right whitespace-nowrap font-mono text-xs sm:text-sm">{row.net_qty_sold?.toLocaleString() ?? '—'}</td>
                    <td className="px-4 sm:px-6 py-2 sm:py-2.5 text-right whitespace-nowrap font-mono font-semibold text-slate-900 text-xs sm:text-sm">{row.approx_sell_value_cr != null ? row.approx_sell_value_cr.toLocaleString() : '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 sm:px-6 py-8 text-center text-slate-500">No sold stocks found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 sm:px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-xs sm:text-sm"
          >
            Prev
          </button>
          <div className="flex gap-1 overflow-x-auto max-w-[120px] sm:max-w-none scrollbar-hide">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => {
                if (totalPages <= 5) return true;
                if (n === 1 || n === totalPages) return true;
                if (Math.abs(n - page) <= 1) return true;
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
                      n === page ? "bg-primary text-white border-primary shadow-sm" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300",
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
            disabled={page === totalPages}
            className="px-2 sm:px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-xs sm:text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
