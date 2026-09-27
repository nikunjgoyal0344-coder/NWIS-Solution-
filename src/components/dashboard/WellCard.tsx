import React from 'react';
import { Well, RiskLevel } from '../../types';
import { MapPin, ArrowRight, Gauge, AlertCircle, GitCompare } from 'lucide-react';

interface WellCardProps {
  well: Well;
  onSelectWell: (well: Well) => void;
  onCompareWithActive?: (well: Well) => void;
}

export const WellCard: React.FC<WellCardProps> = ({
  well,
  onSelectWell,
  onCompareWithActive,
}) => {
  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Low Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Medium Risk
          </span>
        );
      case 'high':
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            High Hazard
          </span>
        );
    }
  };

  const isPresent = well.type === 'present';
  const progressPercent = Math.min(100, Math.round((well.currentDepth / well.totalDepth) * 100));

  return (
    <div className="bg-white rounded-mild border border-slate-200 shadow-card hover:border-slate-300 transition-all flex flex-col justify-between p-4 min-w-[280px] max-w-[320px] flex-shrink-0">
      <div>
        {/* Top Header: Name & Status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="text-sm font-semibold text-primary hover:text-primary-light transition-colors cursor-pointer" onClick={() => onSelectWell(well)}>
              {well.name}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{well.field} ({well.block})</span>
            </div>
          </div>
          {getRiskBadge(well.riskLevel)}
        </div>

        {/* Depths & Progress */}
        <div className="bg-slate-50 rounded p-2.5 my-3 border border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 font-medium">
              {isPresent ? 'Current Depth:' : 'Total Depth:'}
            </span>
            <span className="font-semibold text-slate-800 font-mono">
              {well.currentDepth.toLocaleString()} m
              {isPresent && <span className="text-slate-400 font-normal"> / {well.totalDepth.toLocaleString()} m</span>}
            </span>
          </div>

          {/* Depth Progress Bar */}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                isPresent ? 'bg-primary' : 'bg-slate-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
            <span>Spud: {well.spudDate}</span>
            {well.distanceFromActiveKm !== undefined && well.distanceFromActiveKm > 0 && (
              <span className="font-medium text-slate-600">{well.distanceFromActiveKm} km from active</span>
            )}
          </div>
        </div>

        {/* Sparkline / Event Highlights */}
        <div className="flex items-center justify-between text-xs py-1 px-0.5">
          <span className="text-[11px] text-slate-500 font-medium">Incident Profile:</span>
          <div className="flex items-center gap-1.5">
            {well.eventsCount.mudLoss > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium">
                {well.eventsCount.mudLoss} Losses
              </span>
            )}
            {well.eventsCount.kick > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-red-50 text-red-700 border border-red-200 rounded font-medium">
                {well.eventsCount.kick} Kicks
              </span>
            )}
            {well.eventsCount.stuckPipe > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] bg-red-50 text-red-700 border border-red-200 rounded font-medium">
                {well.eventsCount.stuckPipe} Stuck
              </span>
            )}
            {well.eventsCount.mudLoss === 0 && well.eventsCount.kick === 0 && well.eventsCount.stuckPipe === 0 && (
              <span className="text-[10px] text-emerald-600 font-medium">No major NPT</span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
        <button
          onClick={() => onSelectWell(well)}
          className="flex-1 py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-primary text-xs font-medium rounded border border-slate-200 transition-colors flex items-center justify-center gap-1"
        >
          <span>View Details</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        {!isPresent && onCompareWithActive && (
          <button
            onClick={() => onCompareWithActive(well)}
            title="Compare with Active Well"
            className="p-1.5 text-primary hover:bg-blue-50 border border-slate-200 rounded transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
