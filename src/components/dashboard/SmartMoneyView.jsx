import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight, Filter as FilterIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SmartMoneyView({ data, onOpenFundsPage, monthLabel }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStock, setExpandedStock] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showSectorMenu, setShowSectorMenu] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const maxPages = 10;

  const monthLabelMemo = monthLabel;

  // 1. Group data by Stock
  const groupedData = useMemo(() => {
    const groups = new Map();
    data.forEach(item => {
      const raw = (item.company_name || item.stock_name || '').trim();
      if (!raw) return;
      const key = raw.toLowerCase();
      if (!groups.has(key)) {
        groups.set(key, { 
          name: raw, 
          ticker: (item.ticker || '').trim(),
          sector: (item.sector || '').trim(),
          funds: [] 
        });
      } else {
        // If ticker was empty before, try to fill it from this row
        const existing = groups.get(key);
        if (!existing.ticker && item.ticker) {
          existing.ticker = item.ticker.trim();
        }
        if (!existing.sector && item.sector) {
          existing.sector = item.sector.trim();
        }
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
  const allSectors = useMemo(() => {
    return Array.from(new Set((data || []).map(r => (r.sector || '').trim()).filter(Boolean))).sort();
  }, [data]);

  // 2. Filter data
  const filteredStocks = useMemo(() => {
    const isFiltering = Boolean(searchTerm.trim()) || (selectedCategories.length > 0) || (selectedSectors.length > 0);
    const base = isFiltering ? groupedData : groupedData.slice(0, itemsPerPage * maxPages);
    
    const bySearch = searchTerm
      ? base.filter(stock => 
          stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (stock.ticker && stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : base;
    
    const byClass = selectedCategories.length > 0
      ? bySearch.filter(stock => stock.funds.some(f => selectedCategories.includes((f.classification || '').trim())))
      : bySearch;

    const bySector = selectedSectors.length > 0
      ? byClass.filter(stock => selectedSectors.includes((stock.sector || '').trim()))
      : byClass;

    const countFor = (stock) => {
      let funds = stock.funds;
      if (selectedCategories.length > 0) {
        funds = funds.filter(f => selectedCategories.includes((f.classification || '').trim()));
      }
      return new Set(funds.map(f => f.fund_name)).size;
    };
    return [...bySector].sort((a, b) => countFor(b) - countFor(a));
  }, [groupedData, searchTerm, selectedCategories, selectedSectors]);

  const totalPages = (() => {
    const pages = Math.ceil(filteredStocks.length / itemsPerPage) || 1;
    const isFiltering = Boolean(searchTerm.trim()) || (selectedCategories.length > 0) || (selectedSectors.length > 0);
    return isFiltering ? pages : Math.min(maxPages, pages);
  })();
  const paginatedStocks = filteredStocks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const toggleExpand = (stockName) => {
    setExpandedStock(expandedStock === stockName ? null : stockName);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filters Card - Ultra Compact */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm mx-1 sm:mx-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search - Primary */}
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

          {/* Filters - Inline */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Fund Category */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowCategoryMenu(v => !v);
                  setShowSectorMenu(false);
                }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  showCategoryMenu || selectedCategories.length > 0 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                <FilterIcon className="w-3 h-3" />
                <span>{selectedCategories.length === 0 ? "Category" : `${selectedCategories.length} selected`}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showCategoryMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowCategoryMenu(false)} />
                  <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-xl border border-slate-200 shadow-2xl z-20 py-2 max-h-[300px] overflow-y-auto">
                    <div className="px-4 py-1.5 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Categories</span>
                      {selectedCategories.length > 0 && (
                        <button onClick={() => setSelectedCategories([])} className="text-[10px] text-primary font-bold">RESET</button>
                      )}
                    </div>
                    {classifications.map(cat => (
                      <label key={cat} className="flex items-center px-4 py-2 hover:bg-slate-50 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-0"
                          checked={selectedCategories.includes(cat)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedCategories([...selectedCategories, cat]);
                            else setSelectedCategories(selectedCategories.filter(c => c !== cat));
                            setPage(1);
                          }}
                        />
                        <span className="ml-2.5 text-xs text-slate-600 group-hover:text-slate-900">{cat}</span>
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
                  setShowCategoryMenu(false);
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
            {(selectedCategories.length > 0 || selectedSectors.length > 0) && (
              <button 
                onClick={() => { setSelectedCategories([]); setSelectedSectors([]); setPage(1); }}
                className="px-2 py-1.5 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 uppercase"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info Banner for Mobile Interaction */}
      <div className="sm:hidden bg-blue-50/50 border border-blue-100/50 rounded-lg p-2 mx-1 flex items-center gap-2">
        <div className="bg-blue-600 w-1 h-4 rounded-full" />
        <p className="text-[10px] text-blue-800 font-medium">Tap on any stock to view detailed mutual fund holdings.</p>
      </div>

      {/* Stock List Content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mx-1 sm:mx-0">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-full sm:min-w-[600px]">
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Stock Name</div>
              <div className="col-span-3">Ticker</div>
              <div className="col-span-2 text-center">Funds</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            <div className="divide-y divide-slate-100">
              {paginatedStocks.length > 0 ? (
                paginatedStocks.map((stock) => (
                  <div key={stock.name} className="transition-colors hover:bg-slate-50 group">
                    <div 
                      className="grid grid-cols-12 items-center px-4 sm:px-6 py-3 sm:py-2.5 cursor-pointer"
                      onClick={() => toggleExpand(stock.name)}
                    >
                      <div 
                        className="col-span-5 font-medium text-slate-900 text-xs sm:text-sm"
                        title={stock.name}
                      >
                        <div className="flex flex-col">
                          <span className="truncate max-w-[120px] sm:max-w-none">{stock.name}</span>
                        </div>
                      </div>
                      <div className="col-span-3 text-slate-500 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                        {stock.ticker || '—'}
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                          {new Set(
                            stock.funds
                              .filter(f => selectedCategories.length === 0 || selectedCategories.includes((f.classification || '').trim()))
                              .map(f => f.fund_name)
                          ).size}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center ml-auto transition-colors",
                          expandedStock === stock.name ? "bg-primary/10" : "bg-slate-50"
                        )}>
                          {expandedStock === stock.name ? (
                            <ChevronDown className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedStock === stock.name && (
                      <div className="bg-slate-50 px-4 sm:px-6 py-4 border-t border-slate-100 min-w-full sticky left-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-700">
                            Top Funds Holding {stock.name}
                          </h4>
                          <button
                            onClick={() => {
                              if (onOpenFundsPage) onOpenFundsPage(stock, selectedCategories);
                            }}
                            className="px-3 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 text-xs sm:text-sm w-fit"
                          >
                            View all funds
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                          {([...stock.funds]
                            .filter(f => selectedCategories.length === 0 || selectedCategories.includes((f.classification || '').trim()))
                            .sort((a, b) => {
                              const av = typeof b.percent_aum === 'number' ? b.percent_aum : -Infinity;
                              const aa = typeof a.percent_aum === 'number' ? a.percent_aum : -Infinity;
                              return av - aa;
                            })
                            .slice(0, 12)).map((fund, idx) => (
                              <div key={idx} className="bg-white p-2.5 sm:p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                                <span className="font-medium text-slate-800 text-xs sm:text-sm leading-snug">{fund.fund_name}</span>
                                <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-slate-500">
                                  <span className="truncate mr-2">{fund.classification || 'N/A'}</span>
                                  {typeof fund.percent_aum === 'number' && (
                                    <span className="font-semibold text-green-700 whitespace-nowrap">{fund.percent_aum}%</span>
                                  )}
                                </div>
                                {fund.month && (
                                  <div className="mt-1 text-[9px] sm:text-[11px] text-slate-400">Month: {fund.month}</div>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center text-slate-500 text-sm sm:text-base">
                  No stocks found matching "{searchTerm}"
                </div>
              )}
            </div>
          </div>
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
