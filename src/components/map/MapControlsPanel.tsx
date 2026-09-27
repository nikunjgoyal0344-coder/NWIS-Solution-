import React from 'react';
import { Well, Formation } from '../../types';
import { Search, Sliders, Layers, Eye, ShieldAlert, Compass } from 'lucide-react';

interface MapControlsPanelProps {
  wells: Well[];
  activeWell: Well;
  radiusKm: number;
  onRadiusChange: (radius: number) => void;
  showTrajectories: boolean;
  onToggleTrajectories: () => void;
  showFormations: boolean;
  onToggleFormations: () => void;
  showIncidents: boolean;
  onToggleIncidents: () => void;
  showTerrain: boolean;
  onToggleTerrain: () => void;
  onSelectWell: (well: Well) => void;
}

export const MapControlsPanel: React.FC<MapControlsPanelProps> = ({
  wells,
  activeWell,
  radiusKm,
  onRadiusChange,
  showTrajectories,
  onToggleTrajectories,
  showFormations,
  onToggleFormations,
  showIncidents,
  onToggleIncidents,
  showTerrain,
  onToggleTerrain,
  onSelectWell,
}) => {
  const nearbyWells = wells.filter(w => {
    if (w.id === activeWell.id) return true;
    return (w.distanceFromActiveKm || 0) <= radiusKm;
  });

  return (
    <div className="w-80 bg-white border-r border-slate-200 p-5 flex flex-col justify-between overflow-y-auto space-y-6">
      <div className="space-y-5">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Compass className="w-4 h-4" />
            <h3>3D Subsurface Controls</h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Spatial radius &amp; geological layer filters
          </p>
        </div>

        {/* 1. Proximity Radius Selector */}
        <div className="bg-slate-50 p-3.5 rounded-mild border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700">Offset Search Radius:</span>
            <span className="font-bold text-primary font-mono">{radiusKm} km</span>
          </div>
          <input
            type="range"
            min="2"
            max="25"
            step="1"
            value={radiusKm}
            onChange={(e) => onRadiusChange(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>2 km</span>
            <span>10 km</span>
            <span>25 km</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Wells in Range: <strong>{nearbyWells.length}</strong> (Active + {nearbyWells.length - 1} Offset)
          </p>
        </div>

        {/* 2. Layer Visibility Toggles */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Layer Overlays
          </span>

          <label className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs cursor-pointer hover:bg-slate-100 transition-colors">
            <span className="text-slate-700 font-medium">Wellbore Trajectories</span>
            <input
              type="checkbox"
              checked={showTrajectories}
              onChange={onToggleTrajectories}
              className="accent-primary w-4 h-4 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs cursor-pointer hover:bg-slate-100 transition-colors">
            <span className="text-slate-700 font-medium">Stratigraphic Horizons</span>
            <input
              type="checkbox"
              checked={showFormations}
              onChange={onToggleFormations}
              className="accent-primary w-4 h-4 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs cursor-pointer hover:bg-slate-100 transition-colors">
            <span className="text-slate-700 font-medium">Historical NPT Event Pins</span>
            <input
              type="checkbox"
              checked={showIncidents}
              onChange={onToggleIncidents}
              className="accent-primary w-4 h-4 rounded"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs cursor-pointer hover:bg-slate-100 transition-colors">
            <span className="text-slate-700 font-medium">Surface Grid &amp; Radar Ring</span>
            <input
              type="checkbox"
              checked={showTerrain}
              onChange={onToggleTerrain}
              className="accent-primary w-4 h-4 rounded"
            />
          </label>
        </div>

        {/* 3. Nearby Wells List in Radius */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Wells in Selected Radius
          </span>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {nearbyWells.map(w => {
              const isAct = w.id === activeWell.id;
              return (
                <div
                  key={w.id}
                  onClick={() => onSelectWell(w)}
                  className={`p-2 rounded border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    isAct 
                      ? 'bg-blue-50 border-blue-200 font-semibold text-primary' 
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`w-2 h-2 rounded-full ${
                      isAct ? 'bg-primary' : w.riskLevel === 'high' ? 'bg-red-500' : 'bg-slate-400'
                    }`} />
                    <span className="truncate">{w.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {isAct ? 'Active' : `${w.distanceFromActiveKm} km`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="pt-4 border-t border-slate-200 space-y-1.5 text-[11px] text-slate-600">
        <span className="font-semibold text-slate-700 text-xs block mb-1">Subsurface Legend</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-blue-600 rounded" />
          <span>Active eRTMAC Well Path</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 bg-slate-400 rounded" />
          <span>Offset Well Trajectory</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
          <span>Kick / Loss / Stuck Incident Pin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-2 bg-slate-300 rounded opacity-60" />
          <span>Formation Horizon Plane</span>
        </div>
      </div>
    </div>
  );
};
