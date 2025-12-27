import React, { useEffect, useMemo, useState } from 'react';
import { Search, TrendingDown } from 'lucide-react';
import { fetchCsv } from '../../lib/fetchCsv';
import { SELLS_CSV_URL } from '../../config';
import { cn } from '../../lib/utils';

export function SoldStocksView({ monthLabel }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

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
        stock_name: (r.stock_name || '').trim(),
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

  const filtered = useMemo(() => {
    const bySearch = searchTerm
      ? normalized.filter(r => r.stock_name.toLowerCase().includes(searchTerm.toLowerCase()))
      : normalized;
    const byClass = classificationFilter
      ? bySearch.filter(r => r.classification === classificationFilter)
      : bySearch;
    return [...byClass].sort((a, b) => {
      const av = b.approx_sell_value_cr ?? -Infinity;
      const aa = a.approx_sell_value_cr ?? -Infinity;
      if (av !== aa) return av - aa;
      const bv = b.net_qty_sold ?? -Infinity;
      const ba = a.net_qty_sold ?? -Infinity;
      return bv - ba;
    });
  }, [normalized, searchTerm, classificationFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-slate-500">Loading sells…</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center py-20 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative md:max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          value={classificationFilter}
          onChange={(e) => { setClassificationFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Classifications</option>
          {classifications.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
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
                <th className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">Sector</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">Classification</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">Month</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">Net Qty Sold</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">Approx. Sell Value (Rs cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length > 0 ? (
                paginated.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-slate-900 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <span className="p-1 sm:p-1.5 bg-red-50 text-red-600 rounded-md">
                          <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        </span>
                        {row.stock_name}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">{row.sector || '—'}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">{row.classification || '—'}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">{row.month || '—'}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap font-mono">{row.net_qty_sold?.toLocaleString() ?? '—'}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap font-mono font-semibold text-slate-900">{row.approx_sell_value_cr != null ? row.approx_sell_value_cr.toLocaleString() : '—'}</td>
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
