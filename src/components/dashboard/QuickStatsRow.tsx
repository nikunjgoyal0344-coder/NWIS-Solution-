import React from 'react';
import { QuickStats } from '../../types';

interface QuickStatsRowProps {
  stats: QuickStats;
  onNavigateToWarnings: () => void;
  onNavigateToDirectory: () => void;
}

export const QuickStatsRow: React.FC<QuickStatsRowProps> = ({
  stats,
  onNavigateToWarnings,
  onNavigateToDirectory,
}) => {
  return (
    <div className="space-y-2">
      <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        Quick Stats
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Active Drilling Wells */}
        <div 
          onClick={onNavigateToDirectory}
          className="bg-white p-5 rounded-mild border border-slate-200 shadow-card hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <p className="text-xs font-medium text-slate-500">Active Drilling Wells</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-800 font-mono">12</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Stream
            </span>
          </div>
        </div>

        {/* 2. Nearby Wells Monitored */}
        <div 
          onClick={onNavigateToDirectory}
          className="bg-white p-5 rounded-mild border border-slate-200 shadow-card hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <p className="text-xs font-medium text-slate-500">Nearby Wells Monitored</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-800 font-mono">184</span>
            <span className="text-xs text-slate-400">Within Radius</span>
          </div>
        </div>

        {/* 3. Potential Hazards */}
        <div 
          onClick={onNavigateToWarnings}
          className="bg-white p-5 rounded-mild border border-slate-200 shadow-card hover:border-red-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <p className="text-xs font-medium text-slate-500">Potential Hazards</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-risk-high font-mono">3</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">
              Imminent
            </span>
          </div>
        </div>

        {/* 4. Drilling Efficiency */}
        <div 
          className="bg-white p-5 rounded-mild border border-slate-200 shadow-card flex flex-col justify-between"
        >
          <p className="text-xs font-medium text-slate-500">Drilling Efficiency</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-slate-800 font-mono">88%</span>
            <span className="text-xs text-emerald-600 font-semibold">
              +4.2% vs Baseline
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
