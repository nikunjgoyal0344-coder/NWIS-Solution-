import React, { useState, useMemo } from 'react';
import { Well, RiskLevel, WellType, WellStatus } from '../../types';
import { WellCard } from '../dashboard/WellCard';
import { 
  Filter, 
  ArrowUpDown, 
  LayoutGrid, 
  List, 
  Search, 
  MapPin, 
  Activity, 
  ChevronRight, 
  GitCompare,
  ExternalLink
} from 'lucide-react';

interface SiteDirectoryViewProps {
  wells: Well[];
  onSelectWell: (well: Well) => void;
  onCompareWithActive: (well: Well) => void;
}

export const SiteDirectoryView: React.FC<SiteDirectoryViewProps> = ({
  wells,
  onSelectWell,
  onCompareWithActive,
}) => {
  // Tabs: 'all' | 'present' | 'previous'
  const [activeTab, setActiveTab] = useState<'all' | 'present' | 'previous'>('all');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'depth' | 'risk' | 'date'>('depth');
  
  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Unique fields for filter
  const fieldList = useMemo(() => {
    const fields = new Set(wells.map(w => w.field));
    return Array.from(fields);
  }, [wells]);

  // Filtered & sorted wells
  const filteredWells = useMemo(() => {
    return wells
      .filter(w => {
        // Tab filter
        if (activeTab === 'present' && w.type !== 'present') return false;
        if (activeTab === 'previous' && w.type !== 'previous') return false;

        // Search filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = w.name.toLowerCase().includes(q);
          const matchField = w.field.toLowerCase().includes(q);
          const matchTarget = w.targetFormation.toLowerCase().includes(q);
          if (!matchName && !matchField && !matchTarget) return false;
        }

        // Field filter
        if (selectedField !== 'all' && w.field !== selectedField) return false;

        // Risk filter
        if (selectedRisk !== 'all' && w.riskLevel !== selectedRisk) return false;

        // Status filter
        if (selectedStatus !== 'all' && w.status !== selectedStatus) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'depth') return b.totalDepth - a.totalDepth;
        if (sortBy === 'risk') {
          const riskWeight: Record<RiskLevel, number> = { critical: 4, high: 3, medium: 2, low: 1 };
          return riskWeight[b.riskLevel] - riskWeight[a.riskLevel];
        }
        if (sortBy === 'date') return new Date(b.spudDate).getTime() - new Date(a.spudDate).getTime();
        return 0;
      });
  }, [wells, activeTab, searchQuery, selectedField, selectedRisk, selectedStatus, sortBy]);

  const presentCount = wells.filter(w => w.type === 'present').length;
  const previousCount = wells.filter(w => w.type === 'previous').length;

  return (
    <div className="space-y-6">
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-mild border border-slate-200 shadow-card">
        <div>
          <h1 className="text-lg font-semibold text-slate-800">Site Directory</h1>
          <p className="text-xs text-slate-500">
            Comprehensive registry of present active drilling sites and historical offset wells across OIL blocks
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              viewMode === 'grid' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden md:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Table View"
            className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
              viewMode === 'table' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-mild border border-slate-200 shadow-card space-y-4">
        {/* Category Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            All Sites ({wells.length})
          </button>
          <button
            onClick={() => setActiveTab('present')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'present'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Present Active Sites ({presentCount})
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'previous'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Previous Offset Sites ({previousCount})
          </button>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-1">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by well name or formation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-mild focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Field Filter */}
          <div>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full h-9 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-mild text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Fields</option>
              {fieldList.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full h-9 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-mild text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-9 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-mild text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="depth">Sort by Depth (TD)</option>
              <option value="risk">Sort by Risk Severity</option>
              <option value="name">Sort by Well Name</option>
              <option value="date">Sort by Spud Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong>{filteredWells.length}</strong> matching wells</span>
        {(searchQuery || selectedField !== 'all' || selectedRisk !== 'all' || selectedStatus !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedField('all');
              setSelectedRisk('all');
              setSelectedStatus('all');
            }}
            className="text-primary hover:underline font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Content: Grid View or Table View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWells.map(well => (
            <WellCard
              key={well.id}
              well={well}
              onSelectWell={onSelectWell}
              onCompareWithActive={onCompareWithActive}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-mild border border-slate-200 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Well Name</th>
                  <th className="py-3 px-4">Field &amp; Block</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Depth (Current / TD)</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">NPT Incidents</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWells.map(well => {
                  const isPresent = well.type === 'present';
                  return (
                    <tr key={well.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-primary">
                        <button onClick={() => onSelectWell(well)} className="hover:underline text-left">
                          {well.name}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {well.field} ({well.block})
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          isPresent ? 'bg-blue-50 text-primary border border-blue-200' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isPresent ? 'Active eRTMAC' : 'Historical Offset'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="capitalize">{well.status}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium">
                        {well.currentDepth.toLocaleString()} m / {well.totalDepth.toLocaleString()} m
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {well.distanceFromActiveKm ? `${well.distanceFromActiveKm} km` : '0 km (Active)'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          well.riskLevel === 'low'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : well.riskLevel === 'medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            well.riskLevel === 'low' ? 'bg-emerald-600' : well.riskLevel === 'medium' ? 'bg-amber-600' : 'bg-red-600'
                          }`} />
                          {well.riskLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600">
                          {well.eventsCount.mudLoss + well.eventsCount.kick + well.eventsCount.stuckPipe} recorded
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => onSelectWell(well)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
                        >
                          Details
                        </button>
                        {!isPresent && (
                          <button
                            onClick={() => onCompareWithActive(well)}
                            title="Compare with Active"
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-primary rounded text-xs font-medium border border-blue-200 transition-colors"
                          >
                            Compare
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
