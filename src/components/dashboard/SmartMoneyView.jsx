import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Filter as FilterIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SmartMoneyView({ data, onOpenFundsPage, monthLabel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStock, setExpandedStock] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const maxPages = 10;

  const monthLabelMemo = monthLabel;

  // 1. Group data by Stock
  const groupedData = useMemo(() => {
    const groups = new Map();
    data.forEach(item => {
      const raw = (item.stock_name ?? '').trim();
      if (!raw) return;
      const key = raw.toLowerCase();
      if (!groups.has(key)) {
        groups.set(key, { name: raw, funds: [] });
      }
      groups.get(key).funds.push(item);
    });

    // Convert to array and sort by fundCount (descending)
    return Array.from(groups.values()).sort(
      (a, b) =>
        new Set(b.funds.map(f => f.fund_name)).size -
        new Set(a.funds.map(f => f.fund_name)).size
    );
  }, [data]);
  const classifications = useMemo(() => {
    return Array.from(new Set((data || []).map(r => (r.classification || '').trim()).filter(Boolean))).sort();
  }, [data]);

  // 2. Filter data
  const filteredStocks = useMemo(() => {
    const isFiltering = Boolean(searchTerm.trim()) || (selectedCategories.length > 0);
    const base = isFiltering ? groupedData : groupedData.slice(0, itemsPerPage * maxPages);
    const bySearch = searchTerm
      ? base.filter(stock => stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : base;
    const byClass = selectedCategories.length > 0
      ? bySearch.filter(stock => stock.funds.some(f => selectedCategories.includes((f.classification || '').trim())))
      : bySearch;
    const countFor = (stock) => {
      const funds = selectedCategories.length > 0
        ? stock.funds.filter(f => selectedCategories.includes((f.classification || '').trim()))
        : stock.funds;
      return new Set(funds.map(f => f.fund_name)).size;
    };
    return [...byClass].sort((a, b) => countFor(b) - countFor(a));
  }, [groupedData, searchTerm, selectedCategories]);

  const totalPages = (() => {
    const pages = Math.ceil(filteredStocks.length / itemsPerPage) || 1;
    const isFiltering = Boolean(searchTerm.trim()) || (selectedCategories.length > 0);
    return isFiltering ? pages : Math.min(maxPages, pages);
  })();
  const paginatedStocks = filteredStocks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleExpand = (stockName) => {
    setExpandedStock(expandedStock === stockName ? null : stockName);
  };

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search for a stock..." 
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
        />
      </div>
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <FilterIcon className="w-4 h-4 text-slate-500" />
            Fund Category
          </span>
          <button
            onClick={() => setShowCategoryMenu(v => !v)}
            aria-haspopup="menu"
            aria-expanded={showCategoryMenu ? 'true' : 'false'}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm transition-colors ${showCategoryMenu ? 'border-primary bg-primary/5 text-slate-800' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'} shadow-sm`}
            title="Filter by fund category"
          >
            <span className="truncate">
              {selectedCategories.length === 0 ? "All Categories" : `${selectedCategories.length} selected`}
            </span>
            <ChevronDown className={`w-4 h-4 ${showCategoryMenu ? 'rotate-180' : ''} transition-transform text-slate-500`} />
          </button>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => { setSelectedCategories([]); setPage(1); }}
              className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-50"
              title="Clear selected categories"
            >
              Clear
            </button>
          )}
        </div>
        {showCategoryMenu && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowCategoryMenu(false)}
            />
            <div className="absolute z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white shadow-lg">
              <div className="px-3 py-2 border-b border-slate-200 text-xs text-slate-500">
                Select one or more categories
              </div>
              <div className="max-h-60 overflow-auto py-2">
                {classifications.map(c => {
                  const active = selectedCategories.includes(c);
                  return (
                    <label key={c} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => {
                          setSelectedCategories(prev => {
                            const has = prev.includes(c);
                            const next = has ? prev.filter(x => x !== c) : [...prev, c];
                            setPage(1);
                            return next;
                          });
                        }}
                      />
                      <span>{c}</span>
                    </label>
                  );
                })}
              </div>
              <div className="flex items-center justify-end gap-2 px-3 py-2 border-t border-slate-200">
                <button
                  onClick={() => setShowCategoryMenu(false)}
                  className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-sm text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Stock List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {!!monthLabelMemo && (
          <div className="px-6 py-2 text-xs text-slate-600 border-b border-slate-200">
            Data for: {monthLabelMemo}
          </div>
        )}
        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 px-6 py-4 text-sm font-semibold text-slate-700">
          <div className="col-span-7 md:col-span-6">Stock Name</div>
          <div className="col-span-3 md:col-span-3 text-center">Funds Invested</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-slate-100">
          {paginatedStocks.length > 0 ? (
            paginatedStocks.map((stock) => (
              <div key={stock.name} className="transition-colors hover:bg-slate-50">
                <div 
                  className="grid grid-cols-12 items-center px-6 py-4 cursor-pointer"
                  onClick={() => toggleExpand(stock.name)}
                >
                  <div className="col-span-7 md:col-span-6 font-medium text-slate-900">
                    {stock.name}
                  </div>
                   <div className="col-span-3 md:col-span-3 text-center">
                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                       {new Set(
                         stock.funds
                          .filter(f => selectedCategories.length === 0 || selectedCategories.includes((f.classification || '').trim()))
                          .map(f => f.fund_name)
                       ).size} Funds
                     </span>
                   </div>
                  <div className="col-span-2 text-right">
                    {expandedStock === stock.name ? (
                      <ChevronDown className="w-5 h-5 text-slate-400 inline-block" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400 inline-block" />
                    )}
                  </div>
                </div>

                {expandedStock === stock.name && (
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-slate-700">
                        Top Funds Holding {stock.name}
                      </h4>
                      <button
                        onClick={() => {
                          if (onOpenFundsPage) onOpenFundsPage(stock, selectedCategories);
                        }}
                        className="px-3 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 text-sm"
                      >
                        View all funds
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {([...stock.funds]
                        .filter(f => selectedCategories.length === 0 || selectedCategories.includes((f.classification || '').trim()))
                        .sort((a, b) => {
                          const av = typeof b.percent_aum === 'number' ? b.percent_aum : -Infinity;
                          const aa = typeof a.percent_aum === 'number' ? a.percent_aum : -Infinity;
                          return av - aa;
                        })
                        .slice(0, 12)).map((fund, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                            <span className="font-medium text-slate-800 text-sm">{fund.fund_name}</span>
                            <div className="flex justify-between mt-2 text-xs text-slate-500">
                              <span>{fund.classification || 'N/A'}</span>
                              {typeof fund.percent_aum === 'number' && (
                                <span className="font-semibold text-green-700">{fund.percent_aum}%</span>
                              )}
                            </div>
                            {fund.month && (
                              <div className="mt-1 text-[11px] text-slate-400">Month: {fund.month}</div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center text-slate-500">
              No stocks found matching "{searchTerm}"
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  n === page ? "bg-primary text-white border-primary" : "bg-white text-slate-700 hover:bg-slate-50 border-slate-300",
                  "px-3 py-1 rounded border text-sm"
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
