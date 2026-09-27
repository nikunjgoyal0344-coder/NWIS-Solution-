import React from 'react';
import { Well, AIWarning, QuickStats } from '../../types';
import { QuickStatsRow } from './QuickStatsRow';
import { WellCard } from './WellCard';
import { ActiveWarningsPreview } from './ActiveWarningsPreview';
import { MiniMapPreview } from './MiniMapPreview';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface DashboardViewProps {
  stats: QuickStats;
  wells: Well[];
  warnings: AIWarning[];
  onSelectWell: (well: Well) => void;
  onCompareWithActive: (well: Well) => void;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  wells,
  warnings,
  onSelectWell,
  onCompareWithActive,
  onNavigateToTab,
}) => {
  const activeWells = wells.filter(w => w.type === 'present');
  const historicalWells = wells.filter(w => w.type === 'previous');
  const activeWell = activeWells[0] || wells[0];

  return (
    <div className="space-y-6">
      {/* 1. Quick Stats Row */}
      <QuickStatsRow
        stats={stats}
        onNavigateToWarnings={() => onNavigateToTab('warnings')}
        onNavigateToDirectory={() => onNavigateToTab('directory')}
      />

      {/* 2. Main 3-Column Command Workspace matching Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUMN 1: Present Active Wells & Previous Wells (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
          
          {/* Section A: Present Active Wells */}
          <div className="bg-white rounded-mild border border-slate-200 shadow-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Present Active Wells
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('directory')}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                View Directory &rarr;
              </button>
            </div>

            <div className="space-y-2.5">
              {activeWells.map(well => (
                <div
                  key={well.id}
                  onClick={() => onSelectWell(well)}
                  className="p-3 rounded-mild border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Well ID</span>
                      <h4 className="text-xs font-bold text-slate-800">{well.name}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Medium Risk / Amber
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-600">
                      <span>{well.currentDepth.toLocaleString()} m / {well.totalDepth.toLocaleString()} m MD</span>
                      <span className="font-semibold text-primary">
                        {Math.round((well.currentDepth / well.totalDepth) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${(well.currentDepth / well.totalDepth) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Previous Wells */}
          <div className="bg-white rounded-mild border border-slate-200 shadow-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Previous Offset Wells
              </h3>
              <button
                onClick={() => onNavigateToTab('directory')}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                All ({historicalWells.length}) &rarr;
              </button>
            </div>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {historicalWells.slice(0, 3).map(well => (
                <div
                  key={well.id}
                  onClick={() => onSelectWell(well)}
                  className="p-3 rounded-mild border border-slate-200 hover:border-slate-300 bg-white cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Well ID</span>
                      <h4 className="text-xs font-bold text-slate-800">{well.name}</h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      well.riskLevel === 'high' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {well.riskLevel === 'high' ? 'High Hazard / Red' : 'Low Risk (Green)'}
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-500 font-mono">
                    TD: {well.totalDepth.toLocaleString()} m • {well.distanceFromActiveKm} km from active well
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* COLUMN 2: Subsurface Visualization (Center 4 cols) */}
        <div className="lg:col-span-4">
          <MiniMapPreview
            wells={wells}
            activeWell={activeWell}
            onLaunchFullMap={() => onNavigateToTab('map')}
            onSelectWell={onSelectWell}
          />
        </div>

        {/* COLUMN 3: AI Warning Data Center (Right 4 cols) */}
        <div className="lg:col-span-4">
          <ActiveWarningsPreview
            warnings={warnings}
            onOpenWarningCenter={() => onNavigateToTab('warnings')}
            onSelectWarning={(w) => onNavigateToTab('warnings')}
          />
        </div>

      </div>
    </div>
  );
};
