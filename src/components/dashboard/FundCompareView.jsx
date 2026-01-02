import React, { useState, useMemo } from 'react';
import { Search, Info, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, ArrowRightLeft, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function FundCompareView({ data }) {
  const [fundA, setFundA] = useState('');
  const [fundB, setFundB] = useState('');
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Get unique fund names from data
  const fundNames = useMemo(() => {
    return Array.from(new Set(data.map(d => d.fund_name))).sort();
  }, [data]);

  const filteredFundsA = useMemo(() => {
    if (!searchA.trim()) return fundNames.slice(0, 100);
    return fundNames.filter(f => f.toLowerCase().includes(searchA.toLowerCase()));
  }, [fundNames, searchA]);

  const filteredFundsB = useMemo(() => {
    if (!searchB.trim()) return fundNames.slice(0, 100);
    return fundNames.filter(f => f.toLowerCase().includes(searchB.toLowerCase()));
  }, [fundNames, searchB]);

  const handleSelectA = (name) => {
    setFundA(name);
    setSearchA(''); // Clear search on select to show selected name in non-focus state
    setShowDropdownA(false);
  };

  const handleSelectB = (name) => {
    setFundB(name);
    setSearchB(''); // Clear search on select to show selected name in non-focus state
    setShowDropdownB(false);
  };

  const clearA = (e) => {
    e.stopPropagation();
    setFundA('');
    setSearchA('');
  };

  const clearB = (e) => {
    e.stopPropagation();
    setFundB('');
    setSearchB('');
  };

  const fundAData = useMemo(() => {
    if (!fundA) return [];
    return data.filter(d => d.fund_name === fundA);
  }, [data, fundA]);

  const fundBData = useMemo(() => {
    if (!fundB) return [];
    return data.filter(d => d.fund_name === fundB);
  }, [data, fundB]);

  const comparison = useMemo(() => {
    if (!fundA || !fundB) return null;

    const stocksA = new Map(fundAData.map(s => [s.company_name || s.stock_name, s.percent_aum]));
    const stocksB = new Map(fundBData.map(s => [s.company_name || s.stock_name, s.percent_aum]));

    const common = [];
    const uniqueA = [];
    const uniqueB = [];

    stocksA.forEach((weightA, name) => {
      if (stocksB.has(name)) {
        common.push({ name, weightA, weightB: stocksB.get(name) });
      } else {
        uniqueA.push({ name, weightA });
      }
    });

    stocksB.forEach((weightB, name) => {
      if (!stocksA.has(name)) {
        uniqueB.push({ name, weightB });
      }
    });

    const totalUnique = uniqueA.length + uniqueB.length + common.length;
    const overlapPercentage = totalUnique > 0 ? (common.length / totalUnique) * 100 : 0;

    return {
      common: common.sort((a, b) => ((b.weightA || 0) + (b.weightB || 0)) - ((a.weightA || 0) + (a.weightB || 0))),
      uniqueA: uniqueA.sort((a, b) => (b.weightA || 0) - (a.weightA || 0)),
      uniqueB: uniqueB.sort((a, b) => (b.weightB || 0) - (a.weightB || 0)),
      overlapPercentage,
      totalA: stocksA.size,
      totalB: stocksB.size,
      commonCount: common.length
    };
  }, [fundA, fundB, fundAData, fundBData]);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Intro Section */}
      <div className="bg-primary/5 rounded-2xl p-4 sm:p-6 border border-primary/10">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900">How to use this tool</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Select two mutual funds to see how much their stock holdings overlap. 
              If the overlap is high, both funds behave similarly. 
              If it's low, they offer better diversification for your portfolio.
            </p>
            <p className="text-[10px] sm:text-xs text-slate-400 italic font-medium mt-1">
              Note: Only Equity is considered in this calculation.
            </p>
          </div>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Fund A Selector */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wider">Fund A</label>
          <div className="relative">
            <div 
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-white transition-all cursor-text flex items-center gap-2",
                fundA ? "border-primary/30 ring-2 ring-primary/5" : "border-slate-200"
              )}
              onClick={() => setShowDropdownA(true)}
            >
              <input
                type="text"
                className="bg-transparent border-none focus:outline-none flex-1 text-sm font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="Search first fund..."
                value={showDropdownA ? searchA : (fundA || '')}
                onChange={(e) => setSearchA(e.target.value)}
                onFocus={() => setShowDropdownA(true)}
              />
              <div className="flex items-center gap-1 shrink-0">
                {(fundA || searchA) && (
                  <button 
                    onClick={clearA}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showDropdownA && "rotate-180")} />
              </div>
            </div>
            
            {showDropdownA && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {filteredFundsA.length > 0 ? (
                  filteredFundsA.map(name => (
                    <button
                      key={name}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                      onClick={() => handleSelectA(name)}
                    >
                      {name}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">No funds found</div>
                )}
              </div>
            )}
          </div>
          {showDropdownA && <div className="fixed inset-0 z-40" onClick={() => setShowDropdownA(false)} />}
        </div>

        {/* Fund B Selector */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wider">Fund B</label>
          <div className="relative">
            <div 
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-white transition-all cursor-text flex items-center gap-2",
                fundB ? "border-primary/30 ring-2 ring-primary/5" : "border-slate-200"
              )}
              onClick={() => setShowDropdownB(true)}
            >
              <input
                type="text"
                className="bg-transparent border-none focus:outline-none flex-1 text-sm font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="Search second fund..."
                value={showDropdownB ? searchB : (fundB || '')}
                onChange={(e) => setSearchB(e.target.value)}
                onFocus={() => setShowDropdownB(true)}
              />
              <div className="flex items-center gap-1 shrink-0">
                {(fundB || searchB) && (
                  <button 
                    onClick={clearB}
                    className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                )}
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", showDropdownB && "rotate-180")} />
              </div>
            </div>
            
            {showDropdownB && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                {filteredFundsB.length > 0 ? (
                  filteredFundsB.map(name => (
                    <button
                      key={name}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                      onClick={() => handleSelectB(name)}
                    >
                      {name}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">No funds found</div>
                )}
              </div>
            )}
          </div>
          {showDropdownB && <div className="fixed inset-0 z-40" onClick={() => setShowDropdownB(false)} />}
        </div>
      </div>

      {comparison ? (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Snapshot Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Fund A Stocks</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{comparison.totalA}</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Fund B Stocks</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{comparison.totalB}</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Common Stocks</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{comparison.commonCount}</p>
            </div>
            <div className={cn(
              "p-3 sm:p-4 rounded-2xl border shadow-sm",
              comparison.overlapPercentage > 60 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"
            )}>
              <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Overlap %</p>
              <p className={cn(
                "text-xl sm:text-2xl font-bold",
                comparison.overlapPercentage > 60 ? "text-amber-700" : "text-emerald-700"
              )}>
                {comparison.overlapPercentage.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Smart Insight */}
          <div className={cn(
            "p-4 rounded-2xl flex items-center gap-3 border",
            comparison.overlapPercentage > 60 
              ? "bg-amber-50 border-amber-200 text-amber-800" 
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          )}>
            {comparison.overlapPercentage > 60 ? (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            ) : (
              <CheckCircle className="w-5 h-5 shrink-0" />
            )}
            <p className="text-xs sm:text-sm font-medium">
              {comparison.overlapPercentage > 60 
                ? "High overlap – diversification benefit is limited. Both funds are investing in many of the same stocks." 
                : "Low overlap – better diversification. These funds complement each other by holding different stocks."}
            </p>
          </div>

          {/* Venn-style Visualization */}
          <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="max-w-xl mx-auto flex flex-col items-center">
              <div className="flex items-center justify-center w-full aspect-[2/1] relative mb-12">
                {/* Fund A Circle */}
                <div className="absolute left-0 w-[60%] aspect-square rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center animate-in zoom-in duration-700">
                  <div className="text-center -translate-x-1/4">
                    <p className="text-[10px] sm:text-xs font-bold text-primary/60 uppercase">Fund A</p>
                    <p className="text-lg sm:text-xl font-bold text-primary">{comparison.uniqueA.length} unique</p>
                  </div>
                </div>
                {/* Fund B Circle */}
                <div className="absolute right-0 w-[60%] aspect-square rounded-full border-2 border-slate-300/40 bg-slate-100/50 flex items-center justify-center animate-in zoom-in duration-700">
                  <div className="text-center translate-x-1/4">
                    <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase">Fund B</p>
                    <p className="text-lg sm:text-xl font-bold text-slate-700">{comparison.uniqueB.length} unique</p>
                  </div>
                </div>
                {/* Common Area */}
                <div className="absolute z-10 w-[30%] aspect-square bg-white border border-slate-200 rounded-2xl shadow-lg flex flex-col items-center justify-center animate-in slide-in-from-top-4 duration-1000">
                  <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mb-1" />
                  <p className="text-lg sm:text-xl font-bold text-slate-900">{comparison.commonCount}</p>
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase">Common</p>
                </div>
              </div>

              {/* Visualization Legend/Info */}
              <div className="w-full pt-8 border-t border-slate-100 text-center">
                <p className="text-[10px] sm:text-xs text-slate-400 italic">
                  * Overlap is based on latest available portfolio disclosures
                </p>
              </div>
            </div>
          </div>

          {/* Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full py-4 px-6 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:bg-slate-100 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">Detailed Breakdown</span>
              <span className="text-xs text-slate-500 px-2 py-0.5 bg-white border border-slate-200 rounded-full">
                {comparison.commonCount + comparison.uniqueA.length + comparison.uniqueB.length} stocks
              </span>
            </div>
            {showDetails ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>

          {showDetails && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Common Holdings Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 px-1">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  Common Holdings ({comparison.commonCount})
                </h4>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-slate-900">Stock Name</th>
                          <th className="px-4 py-3 font-semibold text-slate-900 text-right">Fund A (%)</th>
                          <th className="px-4 py-3 font-semibold text-slate-900 text-right">Fund B (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {comparison.common.map(stock => (
                          <tr key={stock.name} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-800">{stock.name}</td>
                            <td className="px-4 py-3 text-right text-slate-600">{typeof stock.weightA === 'number' ? `${stock.weightA.toFixed(2)}%` : '—'}</td>
                            <td className="px-4 py-3 text-right text-slate-600">{typeof stock.weightB === 'number' ? `${stock.weightB.toFixed(2)}%` : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Unique Holdings Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Unique A */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 px-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Only in Fund A ({comparison.uniqueA.length})
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="max-h-80 overflow-y-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 font-semibold text-slate-900">Stock Name</th>
                            <th className="px-4 py-3 font-semibold text-slate-900 text-right">Weight (%)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {comparison.uniqueA.map(stock => (
                            <tr key={stock.name} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 font-medium text-slate-800">{stock.name}</td>
                              <td className="px-4 py-3 text-right text-slate-600">{typeof stock.weightA === 'number' ? `${stock.weightA.toFixed(2)}%` : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Unique B */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2 px-1">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                    Only in Fund B ({comparison.uniqueB.length})
                  </h4>
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="max-h-80 overflow-y-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 font-semibold text-slate-900">Stock Name</th>
                            <th className="px-4 py-3 font-semibold text-slate-900 text-right">Weight (%)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {comparison.uniqueB.map(stock => (
                            <tr key={stock.name} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 font-medium text-slate-800">{stock.name}</td>
                              <td className="px-4 py-3 text-right text-slate-600">{typeof stock.weightB === 'number' ? `${stock.weightB.toFixed(2)}%` : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reset Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setFundA('');
                setFundB('');
                setSearchA('');
                setSearchB('');
                setShowDetails(false);
              }}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-semibold rounded-full hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95"
            >
              Compare another fund
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="py-12 sm:py-20 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center">
            <ArrowRightLeft className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-900 font-semibold">Ready to compare?</p>
            <p className="text-sm text-slate-500">Select two funds from the list above to get started.</p>
          </div>
        </div>
      )}
    </div>
  );
}
