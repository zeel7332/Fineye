import React, { useState } from 'react';
import { Search, Filter, TrendingUp, BarChart2, ChevronDown, Filter as FilterIcon } from 'lucide-react';

export function Dashboard({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showSectorMenu, setShowSectorMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Identify columns dynamically
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  
  // Get unique values for filters
  const sectors = [...new Set(data.map(item => item.sector).filter(Boolean))].sort();
  const categories = [...new Set(data.map(item => item.classification).filter(Boolean))].sort();

  // Filter data
  const filteredData = data.filter(item => {
    const stockName = item.company_name || item.stock_name || '';
    const ticker = item.ticker || '';
    
    const matchesSearch = searchTerm === '' || 
      stockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesSector = selectedSectors.length === 0 || selectedSectors.includes(item.sector);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.classification);
    
    return matchesSearch && matchesSector && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Stats
  const totalStocks = new Set(filteredData.map(item => item.company_name || item.stock_name)).size;
  const totalFunds = new Set(filteredData.map(item => item.fund_name)).size;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 px-1 sm:px-0">
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg">
              <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <h3 className="text-sm sm:font-semibold text-slate-700">Total Records</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{filteredData.length.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center space-x-3 mb-2">
            <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
            </div>
            <h3 className="text-sm sm:font-semibold text-slate-700">Unique Stocks</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{totalStocks}</p>
        </div>
         <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center space-x-3 mb-2">
            <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
            </div>
            <h3 className="text-sm sm:font-semibold text-slate-700">Mutual Funds</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">{totalFunds}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 px-1 sm:px-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search stock, fund, or any keyword..." 
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>

        <div className="relative">
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
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center px-4 py-2.5 hover:bg-slate-50 cursor-pointer group transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                        checked={selectedCategories.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCategories([...selectedCategories, cat]);
                          else setSelectedCategories(selectedCategories.filter(c => c !== cat));
                          setPage(1);
                        }}
                      />
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
                  {sectors.map(sec => (
                    <label key={sec} className="flex items-center px-4 py-2.5 hover:bg-slate-50 cursor-pointer group transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                        checked={selectedSectors.includes(sec)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedSectors([...selectedSectors, sec]);
                          else setSelectedSectors(selectedSectors.filter(s => s !== sec));
                          setPage(1);
                        }}
                      />
                      <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 font-medium transition-colors">{sec}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Data Table Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mx-1 sm:mx-0">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left text-xs sm:text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
              <tr>
                {columns.slice(0, 8).map((key) => (
                  <th key={key} className="px-4 sm:px-6 py-3 sm:py-4 capitalize whitespace-nowrap">{key.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                     {columns.slice(0, 8).map((key, i) => (
                      <td key={i} className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap max-w-[150px] sm:max-w-xs truncate" title={row[key]}>{row[key]}</td>
                     ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 sm:px-6 py-8 text-center text-slate-500">
                    No results found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2 sm:px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-xs sm:text-sm"
            >
              Prev
            </button>
            <span className="text-xs sm:text-sm text-slate-600 font-medium">
              Page {page} / {totalPages}
            </span>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2 sm:px-3 py-1 rounded border border-slate-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 text-xs sm:text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
