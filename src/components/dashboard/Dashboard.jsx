import React, { useState } from 'react';
import { Search, Filter, TrendingUp, BarChart2 } from 'lucide-react';

export function Dashboard({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Identify columns dynamically
  const columns = data.length > 0 ? Object.keys(data[0]) : [];
  const stockCol = columns.find(c => c.toLowerCase().includes('stock') || c.toLowerCase().includes('company')) || columns[0];
  const fundCol = columns.find(c => c.toLowerCase().includes('fund') || c.toLowerCase().includes('scheme'));
  const sectorCol = columns.find(c => c.toLowerCase().includes('sector'));
  const categoryCol = columns.find(c => c.toLowerCase().includes('category') || c.toLowerCase().includes('cap'));

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
    const matchesSector = sectorFilter === '' || item.sector === sectorFilter;
    const matchesCategory = categoryFilter === '' || item.classification === categoryFilter;
    
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
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 px-1 sm:px-0">
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
        <div className="flex gap-2">
           {sectors.length > 0 && (
             <select 
               className="flex-1 md:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs sm:text-sm max-w-none md:max-w-[200px]"
               value={sectorFilter}
               onChange={(e) => { setSectorFilter(e.target.value); setPage(1); }}
             >
              <option value="">All Sectors</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
           )}
           {categories.length > 0 && (
             <select 
               className="flex-1 md:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs sm:text-sm max-w-none md:max-w-[200px]"
               value={categoryFilter}
               onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
             >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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
