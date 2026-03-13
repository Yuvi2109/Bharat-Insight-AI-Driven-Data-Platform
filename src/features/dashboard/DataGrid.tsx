import { useState, useEffect, useMemo, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useDashboardData, type DashboardData } from '../../hooks/useDashboardData'
import { Map, TrendingUp, RefreshCw, LayoutGrid, BarChart3, Activity, AlertCircle, Download, X } from 'lucide-react'
import { useTenant } from '../../context/TenantContext'
import Shimmer from '../../components/Shimmer'
import { Card, Badge, Button } from '../../components/ui'

interface DataGridProps {
  onDataUpdate?: (data: DashboardData[], stats: any) => void
}

export default function DataGrid({ onDataUpdate }: DataGridProps) {
  // Get data from context and our custom hook
  const { role, searchQuery, setSearchQuery, sorting, setSorting, columnFilters, setColumnFilters } = useTenant()
  const { data: tableData, isLoading, error, refresh, downloadCSV } = useDashboardData()
  
  // State for view mode
  const [viewMode, setViewMode] = useState<'grid' | 'analytics'>('grid')
  
  // Local search state for debouncing
  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Debounce search update to global context
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, setSearchQuery])

  // Sync global search back if it changes elsewhere (e.g. Command Palette)
  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])
  
  // Table container ref for virtualization
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // --- Filter Options Extraction ---
  const filterOptions = useMemo(() => {
    if (tableData.length === 0) return { states: [], districts: [], years: [], categories: [] }
    
    const states = new Set<string>()
    const districts = new Set<string>()
    const years = new Set<string>()
    const categories = new Set<string>()
    
    tableData.forEach(row => {
      if (row.State) states.add(row.State)
      if (row.District) districts.add(row.District)
      if (row.Year) years.add(row.Year)
      if (row.Category) categories.add(row.Category)
    })

    return {
      states: Array.from(states).sort(),
      districts: Array.from(districts).sort(),
      years: Array.from(years).sort((a, b) => b.localeCompare(a)),
      categories: Array.from(categories).sort()
    }
  }, [tableData])

  // --- Table Initialization ---
  const columns = useMemo<ColumnDef<DashboardData>[]>(() => {
    if (tableData.length === 0) return []
    return Object.keys(tableData[0]).map(key => ({
      accessorKey: key,
      header: key,
      cell: (info) => {
        const val = String(info.getValue() || '')
        if (key === 'Category') return <Badge variant="info">{val}</Badge>
        if (key === 'Value') return <span className="text-emerald-400 font-bold">{parseFloat(val).toLocaleString()}</span>
        return <span>{val}</span>
      }
    }))
  }, [tableData])

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, columnFilters, globalFilter: searchQuery },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const { rows } = table.getRowModel()
  
  // Virtualizer for the table rows
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 45, // Rough height of a table row
    overscan: 10,
  })

  const filteredData = useMemo(() => rows.map(r => r.original), [rows])

  // Recalculate stats based on filtered data
  const stats = useMemo(() => {
    let totalValue = 0
    filteredData.forEach(row => {
      const val = parseFloat(String(row.Value).replace(/,/g, ''))
      totalValue += isNaN(val) ? 0 : val
    })
    return {
      count: filteredData.length,
      total: totalValue,
      avg: filteredData.length > 0 ? totalValue / filteredData.length : 0
    }
  }, [filteredData])

  // --- Category Data for Chart (Filtered) ---
  const categoryData = useMemo(() => {
    if (filteredData.length === 0) return []
    const groups: Record<string, number> = {}
    filteredData.forEach(row => {
      const cat = row.Category || 'Other'
      const val = parseFloat(String(row.Value).replace(/,/g, ''))
      groups[cat] = (groups[cat] || 0) + (isNaN(val) ? 0 : val)
    })
    
    return Object.entries(groups)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], i) => ({
        name,
        value,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][i]
      }))
  }, [filteredData])

  // --- State Data for Bars (Filtered) ---
  const stateData = useMemo(() => {
    if (filteredData.length === 0) return []
    const groups: Record<string, number> = {}
    filteredData.forEach(row => {
      const state = row.State || 'Other'
      const val = parseFloat(String(row.Value).replace(/,/g, ''))
      groups[state] = (groups[state] || 0) + (isNaN(val) ? 0 : val)
    })
    return Object.entries(groups)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }))
  }, [filteredData])

  // --- Yearly Trend Data ---
  const yearlyTrendData = useMemo(() => {
    if (filteredData.length === 0) return []
    const groups: Record<string, number> = {}
    filteredData.forEach(row => {
      const year = row.Year || 'Unknown'
      const val = parseFloat(String(row.Value).replace(/,/g, ''))
      groups[year] = (groups[year] || 0) + (isNaN(val) ? 0 : val)
    })
    return Object.entries(groups)
      .sort((a, b) => String(a[0]).localeCompare(String(b[0]), undefined, { numeric: true }))
      .slice(-15)
      .map(([name, value]) => ({ name, value }))
  }, [filteredData])

  const handleRefresh = () => refresh()
  const clearAllFilters = () => {
    setColumnFilters([])
    setSearchQuery('')
  }

  // Effect to send data back to parent
  useEffect(() => {
    if (onDataUpdate && !isLoading && !error) {
      onDataUpdate(filteredData, stats)
    }
  }, [filteredData, stats, isLoading, error])

  const handleColumnFilterChange = (id: string, value: string) => {
    setColumnFilters((prev: ColumnFiltersState) => {
      if (value === 'All') return prev.filter(f => f.id !== id)
      const existing = prev.find(f => f.id === id)
      if (existing) return prev.map(f => f.id === id ? { id, value } : f)
      return [...prev, { id, value }]
    })
  }

  const getFilterValue = (id: string) => columnFilters.find(f => f.id === id)?.value || 'All'

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-3 gap-6"><Shimmer className="h-32 rounded-xl" /><Shimmer className="h-32 rounded-xl" /><Shimmer className="h-32 rounded-xl" /></div>
        <Shimmer className="h-96 rounded-xl w-full" />
      </div>
    )
  }

  const isEmpty = tableData.length === 0

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#030303]">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 shrink-0">
        <Card className="bg-blue-500/5 border-blue-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg"><Activity className="w-6 h-6" /></div>
            <div><p className="text-xs text-gray-500 font-bold uppercase">Records</p><p className="text-2xl font-bold text-white">{stats.count.toLocaleString()}</p></div>
          </div>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
            <div><p className="text-xs text-gray-500 font-bold uppercase">Filtered Value</p><p className="text-2xl font-bold text-white">{Math.round(stats.total).toLocaleString()}</p></div>
          </div>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-lg"><Map className="w-6 h-6" /></div>
            <div><p className="text-xs text-gray-500 font-bold uppercase">Avg/Row</p><p className="text-2xl font-bold text-white">{stats.avg.toFixed(2)}</p></div>
          </div>
        </Card>
      </div>

      {/* Combined Toolbar & Filters */}
      <div className="flex flex-wrap items-center px-6 py-3 border-y border-white/5 bg-black/40 gap-y-3 gap-x-4 shrink-0">
        {/* View Toggles */}
        <div className="flex bg-white/5 p-1 rounded-lg shrink-0">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutGrid size={14} />
            Grid
          </button>
          <button 
            onClick={() => setViewMode('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'analytics' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <BarChart3 size={14} />
            Analytics
          </button>
        </div>

        <div className="h-6 w-px bg-white/10 shrink-0 hidden sm:block" />

        {/* Search */}
        <div className="relative shrink-0 w-full sm:w-auto">
          <Map className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
          <input 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-4 text-[11px] text-white outline-none focus:border-blue-500/50 w-full sm:w-40 transition-all sm:focus:w-64"
          />
        </div>

        <div className="h-6 w-px bg-white/10 shrink-0 hidden md:block" />

        {/* Records Count */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg shrink-0">
          <Activity size={14} className="text-blue-400" />
          <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tight">Records:</span>
          <span className="text-xs font-mono font-bold text-white">{stats.count.toLocaleString()}</span>
        </div>

        <div className="h-6 w-px bg-white/10 shrink-0 hidden lg:block" />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <select value={getFilterValue('State')} onChange={(e) => handleColumnFilterChange('State', e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none focus:border-blue-500/50 min-w-[110px]">
            <option value="All">State: All</option>{filterOptions.states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={getFilterValue('District')} onChange={(e) => handleColumnFilterChange('District', e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none focus:border-blue-500/50 min-w-[110px]">
            <option value="All">District: All</option>{filterOptions.districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={getFilterValue('Year')} onChange={(e) => handleColumnFilterChange('Year', e.target.value)} className="hidden md:hidden bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none focus:border-blue-500/50 min-w-[90px]">
            <option value="All">Year: All</option>{filterOptions.years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select value={getFilterValue('Category')} onChange={(e) => handleColumnFilterChange('Category', e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[11px] text-white outline-none focus:border-blue-500/50 min-w-[110px]">
            <option value="All">Category: All</option>{filterOptions.categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {role === 'Admin' && !isEmpty && <Button variant="secondary" onClick={() => downloadCSV(filteredData)} className="py-1.5 px-3 text-xs"><Download className="w-3 h-3 mr-1.5 inline" /> Export</Button>}
          <Button variant="secondary" onClick={handleRefresh} className="py-1.5 px-3 text-xs"><RefreshCw className="w-3 h-3 mr-1.5 inline" /> Refresh</Button>
          {(columnFilters.length > 0 || searchQuery) && (
            <button onClick={clearAllFilters} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><X size={14} /> Clear</button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10" ref={tableContainerRef}>
        {viewMode === 'analytics' ? (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="p-6">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 text-center">Distribution by Category</h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                {/* Pie Chart Component */}
                <div className="relative w-48 h-48 rounded-full shadow-2xl shrink-0 group" 
                     style={{ 
                       background: `conic-gradient(${
                         categoryData.length > 0 
                         ? categoryData.map((item, i) => {
                             const total = categoryData.reduce((acc, curr) => acc + curr.value, 0)
                             const prevValue = categoryData.slice(0, i).reduce((acc, curr) => acc + curr.value, 0)
                             const startPerc = (prevValue / total) * 100
                             const endPerc = ((prevValue + item.value) / total) * 100
                             return `${item.color} ${startPerc}% ${endPerc}%`
                           }).join(', ')
                         : '#222 0% 100%'
                       })` 
                     }}>
                  <div className="absolute inset-8 bg-[#0a0a0a] rounded-full flex flex-center items-center justify-center border border-white/5">
                    <div className="text-center">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Total</p>
                      <p className="text-lg font-bold text-white leading-none">{(stats.total / 1000).toFixed(1)}k</p>
                    </div>
                  </div>
                </div>

                {/* Legend with Bars */}
                <div className="flex-1 space-y-4 w-full">
                  {categoryData.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-gray-300 font-medium">{item.name}</span>
                        </div>
                        <span className="text-gray-500 font-mono">
                          {Math.round((item.value / categoryData.reduce((a, b) => a + b.value, 0)) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000" 
                             style={{ 
                               width: `${(item.value / (categoryData[0]?.value || 1)) * 100}%`, 
                               backgroundColor: item.color 
                             }} />
                      </div>
                    </div>
                  ))}
                  {categoryData.length === 0 && <p className="text-center text-gray-500 py-4 text-xs">No data available</p>}
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Top Performing States</h3>
              <div className="space-y-5">
                {stateData.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[10px] mb-1.5"><span className="text-gray-400">{item.name}</span><span className="text-blue-400 font-mono">{Math.round(item.value).toLocaleString()}</span></div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${(item.value / (stateData[0]?.value || 1)) * 100}%` }} /></div>
                  </div>
                ))}
                {stateData.length === 0 && <p className="text-center text-gray-500 py-4 text-xs">No data available</p>}
              </div>
            </Card>

            {/* Yearly Trend Chart */}
            <Card className="p-6 lg:col-span-2 relative overflow-hidden">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Yearly Performance Trend</h3>
                  <p className="text-[9px] text-blue-400 font-mono mt-1">Metric: {filteredData[0]?.Metric || 'Value'}</p>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-tighter">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-sm" /> <span>Production</span></div>
                </div>
              </div>

              <div className="h-56 relative mt-4">
                {/* Y-Axis Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className="w-full border-t border-white/[0.03] flex items-start">
                      <span className="text-[8px] text-gray-600 -mt-2 pr-2">
                        {yearlyTrendData.length > 0 ? (Math.max(...yearlyTrendData.map(d => d.value)) * (1 - i/4) / 1000).toFixed(0) + 'k' : ''}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bars Container */}
                <div className="absolute inset-0 flex items-end justify-between gap-1 pl-8 pb-6">
                  {yearlyTrendData.map((item, i) => {
                    const maxVal = Math.max(...yearlyTrendData.map(d => d.value), 1)
                    const height = (item.value / maxVal) * 100
                    return (
                      <div key={i} className="group relative flex-1 flex flex-col items-center justify-end h-full min-w-0">
                        {/* Value Label (Visible on hover or small screens) */}
                        <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-[8px] font-mono text-blue-400 whitespace-nowrap z-10">
                          {(item.value / 1000).toFixed(1)}k
                        </div>
                        
                        {/* Bar */}
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600/20 to-blue-400/40 group-hover:from-blue-600/40 group-hover:to-blue-400/60 border-t border-x border-blue-400/30 rounded-t-sm transition-all duration-1000 ease-out relative" 
                          style={{ height: `${Math.max(height, item.value > 0 ? 3 : 0)}%` }}
                        >
                          <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                        </div>

                        {/* X-Axis Label */}
                        <div className="absolute -bottom-6 w-full text-center">
                          <span className="text-[8px] font-bold text-gray-500 group-hover:text-white transition-colors truncate block">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {yearlyTrendData.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500 italic text-xs">No trend data available</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500 h-full flex flex-col">
            {error ? (
              <div className="h-full flex flex-col items-center justify-center p-12"><AlertCircle className="w-12 h-12 text-rose-500 mb-4" /><h2 className="text-xl font-bold text-white mb-2">Network Error</h2><p className="text-gray-500 mb-6 text-center">{error}</p><Button onClick={handleRefresh}>Retry Loading</Button></div>
            ) : isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center p-12"><AlertCircle className="w-12 h-12 text-gray-600 mb-4" /><h2 className="text-xl font-bold text-white mb-4">No Data Available</h2><Button onClick={handleRefresh}>Refresh Data</Button></div>
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col border border-white/5 rounded-xl mx-6 my-4 bg-[#080808]/50">
                {/* Header Row */}
                <div className="flex bg-[#0a0a0a] border-b border-white/10 z-20">
                  {table.getHeaderGroups().map(hg => (
                    <div key={hg.id} className="flex w-full">
                      {hg.headers.map(h => (
                        <div 
                          key={h.id} 
                          style={{ minWidth: h.id === 'State' ? '180px' : h.id === 'District' ? '180px' : '120px' }}
                          className="flex-1 px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:bg-white/5 flex items-center justify-between border-r border-white/5 last:border-r-0"
                          onClick={h.column.getToggleSortingHandler()}
                        >
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          <span className="text-blue-500 ml-2">
                            {h.column.getIsSorted() ? (h.column.getIsSorted() === 'asc' ? '↑' : '↓') : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Virtualized Body */}
                <div 
                  className="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
                  ref={tableContainerRef}
                >
                  <div 
                    style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative', minWidth: 'fit-content' }}
                  >
                    {rowVirtualizer.getVirtualItems().map(virtualRow => {
                      const row = rows[virtualRow.index]
                      return (
                        <div 
                          key={row.id} 
                          className="flex items-center border-b border-white/5 hover:bg-white/5 transition-colors absolute top-0 left-0 min-w-full"
                          style={{ 
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`
                          }}
                        >
                          {row.getVisibleCells().map(cell => (
                            <div 
                              key={cell.id} 
                              style={{ minWidth: cell.column.id === 'State' ? '180px' : cell.column.id === 'District' ? '180px' : '120px' }}
                              className="flex-1 px-6 py-3 text-xs text-gray-300 truncate border-r border-white/5 last:border-r-0"
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
