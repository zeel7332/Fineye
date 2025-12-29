import React, { useEffect, useMemo, useState } from 'react';
import { Search, Heart, ChevronDown, Filter as FilterIcon } from 'lucide-react';
import { fetchCsv } from '../../lib/fetchCsv';
import { FAVORITES_CSV_URL } from '../../config';
import { cn } from '../../lib/utils';

export function FavoriteStocksView({ monthLabel }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassifications, setSelectedClassifications] = useState([]);
  const [showClassMenu, setShowClassMenu] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const url = FAVORITES_CSV_URL && FAVORITES_CSV_URL.length > 0 ? FAVORITES_CSV_URL : 'Stock_Buy_Nov-25 (1).csv';
    fetchCsv(url)
      .then(data => {
        setRows(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load favorites data');
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
        net_qty_bought: typeof r.net_qty_bought === 'number' ? r.net_qty_bought : null,
        approx_buy_value_cr: typeof r.approx_buy_value_cr === 'number' ? r.approx_buy_value_cr : null,
      }))
      .filter(r => r.stock_name);
  }, [rows]);

  const classifications = useMemo(() => {
    return Array.from(new Set(normalized.map(r => r.classification).filter(Boolean))).sort();
  }, [normalized]);

  const filtered = useMemo(() => {
    const bySearch = searchTerm
      ? normalized.filter(r => 
          r.stock_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.ticker.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : normalized;
    const byClass = selectedClassifications.length > 0
      ? bySearch.filter(r => selectedClassifications.includes(r.classification))
      : bySearch;
    return [...byClass].sort((a, b) => {
      const av = b.approx_buy_value_cr ?? -Infinity;
      const aa = a.approx_buy_value_cr ?? -Infinity;
      if (av !== aa) return av - aa;
      const bv = b.net_qty_bought ?? -Infinity;
      const ba = a.net_qty_bought ?? -Infinity;
      return bv - ba;
    });
  }, [normalized, searchTerm, selectedClassifications]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-500">Loading favorites…</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center py-20 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 px-1 sm:px-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock..."
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        
        <div className="relative">
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider ml-0.5">
              <FilterIcon className="w-3 h-3" />
              Classification
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClassMenu(v => !v)}
                className={`flex-1 sm:flex-none inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs sm:text-sm transition-all shadow-sm ${
                  showClassMenu || selectedClassifications.length > 0 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10' 
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <span className="truncate">
                  {selectedClassifications.length === 0 ? "All Classifications" : `${selectedClassifications.length} selected`}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showClassMenu ? 'rotate-180' : ''}`} />
              </button>
              {selectedClassifications.length > 0 && (
                <button 
                  onClick={() => { setSelectedClassifications([]); setPage(1); }}
                  className="p-2 text-slate-400 hover:text-primary transition-colors"
                >
                  <span className="text-xs font-medium">Clear</span>
                </button>
              )}
            </div>
          </div>

          {showClassMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowClassMenu(false)} />
              <div className="absolute left-0 top-full mt-2 w-full sm:w-64 bg-white rounded-xl border border-slate-200 shadow-2xl z-20 py-2 max-h-[350px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 origin-top">
                <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Classifications</span>
                  {selectedClassifications.length > 0 && (
                    <button 
                      onClick={() => setSelectedClassifications([])}
                      className="text-[10px] text-primary hover:underline font-bold"
                    >
                      RESET
                    </button>
                  )}
                </div>
                <div className="mt-1">
                  {classifications.map(c => (
                    <label key={c} className="flex items-center px-4 py-2.5 hover:bg-slate-50 cursor-pointer group transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                        checked={selectedClassifications.includes(c)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedClassifications([...selectedClassifications, c]);
                          else setSelectedClassifications(selectedClassifications.filter(x => x !== c));
                          setPage(1);
                        }}
                      />
                      <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 font-medium transition-colors">{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {!!monthLabelMemo && (
          <div className="px-4 sm:px-6 py-2 text-[10px] sm:text-xs text-slate-600 border-b border-slate-200">
            Data for: {monthLabelMemo}
          </div>
        )}
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">Stock Name</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">Ticker</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">Sector</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">Classification</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">Month</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">Net Qty Bought</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">Approx. Buy Value (Rs cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length > 0 ? (
                paginated.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-slate-900 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <span className="p-1 sm:p-1.5 bg-pink-50 text-pink-600 rounded-md">
                          <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                        </span>
                        {row.stock_name}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <span className="text-[10px] sm:text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {row.ticker || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">{row.sector || '—'}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">{row.classification || '—'}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">{row.month || '—'}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap font-mono">{row.net_qty_bought?.toLocaleString() ?? '—'}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap font-mono font-semibold text-slate-900">{row.approx_buy_value_cr != null ? row.approx_buy_value_cr.toLocaleString() : '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 sm:px-6 py-8 text-center text-slate-500">No favorites found</td>
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  n === page ? "bg-primary text-white border-primary" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300",
                  "px-2 sm:px-3 py-1 rounded border text-[10px] sm:text-sm flex-shrink-0"
                )}
              >
                {n}
              </button>
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
