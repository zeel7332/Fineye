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
          ticker: item.ticker || '',
          sector: item.sector || '',
          funds: [] 
        });
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
    <div className="space-y-6">
      <div className="relative max-w-md px-1 sm:px-0">
        <Search className="absolute left-4 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search for a stock..." 
          className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
        />
      </div>
      <div className="relative px-1 sm:px-0">
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
          {/* Fund Category Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider ml-0.5">
              <FilterIcon className="w-3 h-3" />
              Fund Category
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowCategoryMenu(v => !v);
                  setShowSectorMenu(false);
                }}
                className={`flex-1 sm:flex-none inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs sm:text-sm transition-all shadow-sm ${
                  showCategoryMenu || selectedCategories.length > 0 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10' 
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <span className="truncate">
                  {selectedCategories.length === 0 ? "All Categories" : `${selectedCategories.length} selected`}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showCategoryMenu ? 'rotate-180' : ''}`} />
              </button>
              {selectedCategories.length > 0 && (
                <button 
                  onClick={() => { setSelectedCategories([]); setPage(1); }}
                  className="p-2 text-slate-400 hover:text-primary transition-colors"
                  title="Clear Category Filter"
                >
                  <span className="text-xs font-medium">Clear</span>
                </button>
              )}
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-slate-200 mx-1" />

          {/* Sector Filter */}
          <div className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider ml-0.5">
              <FilterIcon className="w-3 h-3" />
              Sector
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowSectorMenu(v => !v);
                  setShowCategoryMenu(false);
                }}
                className={`flex-1 sm:flex-none inline-flex items-center justify-between gap-2 px-3 py-2 rounded-lg border text-xs sm:text-sm transition-all shadow-sm ${
                  showSectorMenu || selectedSectors.length > 0 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10' 
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'
                }`}
              >
                <span className="truncate">
                  {selectedSectors.length === 0 ? "All Sectors" : `${selectedSectors.length} selected`}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSectorMenu ? 'rotate-180' : ''}`} />
              </button>
              {selectedSectors.length > 0 && (
                <button 
                  onClick={() => { setSelectedSectors([]); setPage(1); }}
                  className="p-2 text-slate-400 hover:text-primary transition-colors"
                  title="Clear Sector Filter"
                >
                  <span className="text-xs font-medium">Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Dropdown */}
        {showCategoryMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowCategoryMenu(false)} />
            <div className="absolute left-0 top-full mt-2 w-full sm:w-64 bg-white rounded-xl border border-slate-200 shadow-2xl z-20 py-2 max-h-[350px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 origin-top">
              <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Categories</span>
                {selectedCategories.length > 0 && (
                  <button 
                    onClick={() => setSelectedCategories([])}
                    className="text-[10px] text-primary hover:underline font-bold"
                  >
                    RESET
                  </button>
                )}
              </div>
              <div className="mt-1">
                {classifications.map(cat => (
                  <label key={cat} className="flex items-center px-4 py-2.5 hover:bg-slate-50 cursor-pointer group transition-colors">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                        checked={selectedCategories.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCategories([...selectedCategories, cat]);
                          else setSelectedCategories(selectedCategories.filter(c => c !== cat));
                          setPage(1);
                        }}
                      />
                    </div>
                    <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 font-medium transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Sector Dropdown */}
        {showSectorMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowSectorMenu(false)} />
            <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-full sm:w-64 bg-white rounded-xl border border-slate-200 shadow-2xl z-20 py-2 max-h-[350px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 origin-top">
              <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-between sticky top-0 bg-white z-10">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Select Sectors</span>
                {selectedSectors.length > 0 && (
                  <button 
                    onClick={() => setSelectedSectors([])}
                    className="text-[10px] text-primary hover:underline font-bold"
                  >
                    RESET
                  </button>
                )}
              </div>
              <div className="mt-1">
                {allSectors.map(sec => (
                  <label key={sec} className="flex items-center px-4 py-2.5 hover:bg-slate-50 cursor-pointer group transition-colors">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                        checked={selectedSectors.includes(sec)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedSectors([...selectedSectors, sec]);
                          else setSelectedSectors(selectedSectors.filter(s => s !== sec));
                          setPage(1);
                        }}
                      />
                    </div>
                    <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 font-medium transition-colors">{sec}</span>
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {/* Stock List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mx-1 sm:mx-0">
        {!!monthLabelMemo && (
          <div className="px-4 sm:px-6 py-2 text-[10px] sm:text-xs text-slate-600 border-b border-slate-200">
            Data for: {monthLabelMemo}
          </div>
        )}
        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-700">
          <div className="col-span-4 md:col-span-5">Stock Name</div>
          <div className="col-span-3 md:col-span-2 text-center">Ticker</div>
          <div className="col-span-3 md:col-span-3 text-center">Funds</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        <div className="divide-y divide-slate-100">
          {paginatedStocks.length > 0 ? (
            paginatedStocks.map((stock) => (
              <div key={stock.name} className="transition-colors hover:bg-slate-50">
                <div 
                  className="grid grid-cols-12 items-center px-4 sm:px-6 py-3 sm:py-4 cursor-pointer"
                  onClick={() => toggleExpand(stock.name)}
                >
                  <div className="col-span-4 md:col-span-5 font-medium text-slate-900 text-sm sm:text-base truncate">
                    {stock.name}
                  </div>
                  <div className="col-span-3 md:col-span-2 text-center">
                    <span className="text-[10px] sm:text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {stock.ticker || 'N/A'}
                    </span>
                  </div>
                   <div className="col-span-3 md:col-span-3 text-center">
                     <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                       {new Set(
                         stock.funds
                          .filter(f => selectedCategories.length === 0 || selectedCategories.includes((f.classification || '').trim()))
                          .map(f => f.fund_name)
                       ).size} <span className="hidden xs:inline ml-1">Funds</span>
                     </span>
                   </div>
                  <div className="col-span-2 text-right">
                    {expandedStock === stock.name ? (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 inline-block" />
                    ) : (
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 inline-block" />
                    )}
                  </div>
                </div>

                {expandedStock === stock.name && (
                  <div className="bg-slate-50 px-4 sm:px-6 py-4 border-t border-slate-100">
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
