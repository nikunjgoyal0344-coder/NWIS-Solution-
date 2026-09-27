import React, { useState, useMemo } from 'react';
import { Well, Formation, DrillingIncident } from '../../types';
import { ThreeSubsurfaceMap } from './ThreeSubsurfaceMap';
import { MapControlsPanel } from './MapControlsPanel';
import { 
  RotateCcw, 
  Layers, 
  Maximize2, 
  Compass, 
  AlertTriangle, 
  ChevronRight,
  Sliders,
  Flag,
  ShieldAlert,
  Info
} from 'lucide-react';

interface SubsurfaceMapViewProps {
  wells: Well[];
  formations: Formation[];
  incidents: DrillingIncident[];
  onSelectWell: (well: Well) => void;
}

export const SubsurfaceMapView: React.FC<SubsurfaceMapViewProps> = ({
  wells,
  formations,
  incidents,
  onSelectWell,
}) => {
  const activeWell = wells.find(w => w.type === 'present') || wells[0];

  // Map state
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [inspectedDepth, setInspectedDepth] = useState<number>(activeWell.currentDepth || 2835);
  const [showTrajectories, setShowTrajectories] = useState(true);
  const [showFormations, setShowFormations] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showTerrain, setShowTerrain] = useState(true);
  const [is2DView, setIs2DView] = useState(false);
  const [controlsCollapsed, setControlsCollapsed] = useState(false);

  // Depth calculations
  const totalTD = activeWell.totalDepth || 3650;
  const bitDepth = activeWell.currentDepth || 2835;
  const bitPercent = Math.min(100, (inspectedDepth / totalTD) * 100);

  // Identify formation at inspected depth
  const currentFormation = useMemo(() => {
    return formations.find(f => inspectedDepth >= f.topDepth && inspectedDepth < f.bottomDepth) || formations[formations.length - 1];
  }, [formations, inspectedDepth]);

  // Identify incidents near inspected depth (within 40m)
  const nearbyIncidents = useMemo(() => {
    return incidents.filter(i => Math.abs(i.depth - inspectedDepth) <= 40);
  }, [incidents, inspectedDepth]);

  const milestones = [
    { label: 'Surface', depth: 0, tag: '0m' },
    { label: 'Tipam Sand', depth: 1850, tag: '1,850m' },
    { label: 'Barail Top', depth: 2600, tag: '2,600m' },
    { label: 'Active Bit', depth: bitDepth, tag: `${bitDepth}m` },
    { label: 'Loss Zone', depth: 2845, tag: '2,845m', hazard: true },
    { label: 'Kopili Top', depth: 3150, tag: '3,150m' },
    { label: 'Target TD', depth: totalTD, tag: `${totalTD}m` },
  ];

  return (
    <div className="bg-white rounded-mild border border-slate-200 shadow-card flex flex-col h-[calc(100vh-140px)] min-h-[640px] overflow-hidden">
      {/* Top Map Header */}
      <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-bold text-slate-800">
            3D Subsurface Digital Twin &amp; Offset Proximity
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">
            • Upper Assam Basin Formation Model
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Inspected Depth Display */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-mono">
            <span className="text-slate-400 font-sans text-[11px]">Depth Slice:</span>
            <strong className="text-primary">{inspectedDepth} m MD</strong>
          </div>

          {/* 2D / 3D Toggle */}
          <div className="flex items-center bg-slate-200 p-0.5 rounded text-xs">
            <button
              onClick={() => setIs2DView(false)}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                !is2DView ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              3D Ortho
            </button>
            <button
              onClick={() => setIs2DView(true)}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                is2DView ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              2D Plan View
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Body: Left Controls + Center WebGL Canvas */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel */}
        {!controlsCollapsed && (
          <MapControlsPanel
            wells={wells}
            activeWell={activeWell}
            radiusKm={radiusKm}
            onRadiusChange={setRadiusKm}
            showTrajectories={showTrajectories}
            onToggleTrajectories={() => setShowTrajectories(!showTrajectories)}
            showFormations={showFormations}
            onToggleFormations={() => setShowFormations(!showFormations)}
            showIncidents={showIncidents}
            onToggleIncidents={() => setShowIncidents(!showIncidents)}
            showTerrain={showTerrain}
            onToggleTerrain={() => setShowTerrain(!showTerrain)}
            onSelectWell={onSelectWell}
          />
        )}

        {/* Center WebGL Canvas */}
        <div className="flex-1 relative bg-slate-100 flex flex-col">
          <ThreeSubsurfaceMap
            wells={wells}
            activeWell={activeWell}
            formations={formations}
            incidents={incidents}
            radiusKm={radiusKm}
            inspectedDepth={inspectedDepth}
            showTrajectories={showTrajectories}
            showFormations={showFormations}
            showIncidents={showIncidents}
            showTerrain={showTerrain}
            is2DView={is2DView}
            onSelectWell={onSelectWell}
          />

          {/* INGESTED SCANNED WELL FLOATING INDICATOR */}
          {wells.find(w => (w as any).isUploaded) && (() => {
            const uploadedWell = wells.find(w => (w as any).isUploaded)!;
            return (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-mild border-2 border-emerald-500 shadow-md flex items-center gap-3 text-xs z-10 animate-in fade-in duration-300">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800 text-[11px]">Ingested Scanned Site:</span>
                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">LIVE IN 3D</span>
                  </div>
                  <div className="text-slate-700 font-semibold text-xs">{uploadedWell.name}</div>
                  <div className="text-[10px] text-slate-400">
                    Depth: {uploadedWell.totalDepth}m • 3.2km offset • Extracted Loss at 2,848m
                  </div>
                </div>
                <button
                  onClick={() => setInspectedDepth(2848)}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded shadow-xs transition-colors shrink-0 flex items-center gap-1"
                  title="Move 3D depth slice to extracted 2,848m loss zone"
                >
                  <span>Focus Loss Depth</span>
                  <span className="font-mono text-[10px] bg-emerald-700 px-1 rounded">2,848m</span>
                </button>
              </div>
            );
          })()}

          {/* FLOATING VERTICAL DEPTH INDICATOR HUD (Right side) */}
          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-mild border border-slate-200 shadow-md flex gap-3 text-xs z-10">
            {/* Clickable Vertical Depth Bar */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickY = e.clientY - rect.top;
                const ratio = Math.max(0, Math.min(1, clickY / rect.height));
                setInspectedDepth(Math.round(ratio * totalTD));
              }}
              className="relative w-6 h-56 bg-slate-100 rounded border border-slate-300 flex flex-col overflow-hidden shadow-inner cursor-pointer"
              title="Click on vertical gauge to scrub depth slice"
            >
              <div className="h-[18%] bg-slate-200 border-b border-slate-300" title="Girujan Clay (0-650m)" />
              <div className="h-[32%] bg-amber-100 border-b border-slate-300" title="Tipam Sandstone (1850m)" />
              <div className="h-[36%] bg-slate-300 border-b border-slate-400 relative" title="Barail Coal Sequence (2600m)">
                <div className="absolute top-[68%] left-0 right-0 h-1 bg-red-600 animate-pulse" title="Loss Hazard at 2845m" />
              </div>
              <div className="flex-1 bg-slate-400" title="Kopili Shale (3150m)" />

              {/* Inspected Depth Cursor Line */}
              <div 
                className="absolute left-0 right-0 h-1.5 bg-blue-600 shadow-xs z-20 pointer-events-none"
                style={{ top: `${bitPercent}%` }}
              />
            </div>

            {/* Depth Numbers & Formation Labels */}
            <div className="flex flex-col justify-between text-[11px] font-mono py-0.5">
              <button onClick={() => setInspectedDepth(0)} className="flex items-center gap-1.5 hover:text-primary text-left">
                <span className="font-bold text-slate-800">0 m</span>
                <span className="text-slate-400 text-[10px] font-sans">Surface</span>
              </button>
              <button onClick={() => setInspectedDepth(650)} className="flex items-center gap-1.5 hover:text-primary text-left">
                <span className="text-slate-600">650 m</span>
                <span className="text-slate-400 text-[10px] font-sans">Girujan</span>
              </button>
              <button onClick={() => setInspectedDepth(1850)} className="flex items-center gap-1.5 hover:text-primary text-left">
                <span className="text-slate-600">1,850 m</span>
                <span className="text-amber-700 text-[10px] font-sans font-medium">Tipam Sand</span>
              </button>
              <button onClick={() => setInspectedDepth(bitDepth)} className="flex items-center gap-1.5 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 -mx-1 text-left">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="font-bold text-emerald-800 text-[11px]">{bitDepth} m</span>
                <span className="text-emerald-700 text-[10px] font-sans font-bold">Live Bit</span>
              </button>
              <button onClick={() => setInspectedDepth(2845)} className="flex items-center gap-1.5 text-red-700 font-bold hover:underline text-left">
                <span>2,845 m</span>
                <span className="text-[10px] font-sans">⚠️ Loss Zone</span>
              </button>
              <button onClick={() => setInspectedDepth(3150)} className="flex items-center gap-1.5 hover:text-primary text-left">
                <span className="text-slate-600">3,150 m</span>
                <span className="text-slate-500 text-[10px] font-sans">Kopili</span>
              </button>
              <button onClick={() => setInspectedDepth(totalTD)} className="flex items-center gap-1.5 hover:text-primary text-left">
                <span className="font-bold text-slate-800">{totalTD} m</span>
                <span className="text-slate-400 text-[10px] font-sans">Target TD</span>
              </button>
            </div>
          </div>

          {/* FLOATING DEPTH INSPECTION CARD (Bottom Left of Canvas) */}
          <div className="absolute bottom-20 left-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-mild border border-slate-200 shadow-md max-w-sm w-full text-xs space-y-2 z-10">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Sliders className="w-3.5 h-3.5 text-primary" />
                <span>Depth Horizon Inspector</span>
              </div>
              <span className="font-mono font-bold text-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {inspectedDepth} m
              </span>
            </div>

            <div className="text-slate-600">
              <div className="font-semibold text-slate-800">{currentFormation.name}</div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{currentFormation.description}</p>
            </div>

            {/* If nearby incident found at this depth */}
            {nearbyIncidents.length > 0 ? (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-[11px] text-red-800 space-y-0.5">
                <div className="flex items-center gap-1 font-bold">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span>Historical Offset Hazard at this Depth:</span>
                </div>
                <p className="font-medium">
                  {nearbyIncidents[0].wellName} at {nearbyIncidents[0].depth}m: {nearbyIncidents[0].title}
                </p>
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Info className="w-3 h-3 text-slate-400" />
                <span>No historical lost circulation or kicks recorded at this depth.</span>
              </div>
            )}
          </div>

          {/* INTERACTIVE DEPTH NAVIGATOR SCRUBBER BAR (Bottom Center) */}
          <div className="bg-white/95 border-t border-slate-200 px-6 py-2.5 z-20 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 text-xs">Scrub Subsurface Depth:</span>
                <span className="font-mono font-bold text-primary bg-slate-100 px-2 py-0.5 rounded">
                  {inspectedDepth} m
                </span>
                <span className="text-[11px] text-slate-400">
                  ({inspectedDepth === bitDepth ? 'Active Drill Bit Position' : `${Math.abs(inspectedDepth - bitDepth)}m ${inspectedDepth > bitDepth ? 'ahead of bit' : 'above bit'}`})
                </span>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-1 text-[11px]">
                {milestones.map((m, i) => (
                  <button
                    key={i}
                    onClick={() => setInspectedDepth(m.depth)}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] transition-colors ${
                      inspectedDepth === m.depth
                        ? 'bg-primary text-white font-bold'
                        : m.hazard
                        ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {m.label} ({m.tag})
                  </button>
                ))}
              </div>
            </div>

            {/* Depth Range Slider */}
            <input
              type="range"
              min="0"
              max={totalTD}
              step="5"
              value={inspectedDepth}
              onChange={(e) => setInspectedDepth(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Bottom Toolbar Info */}
          <div className="h-8 bg-slate-50 border-t border-slate-200 px-4 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setControlsCollapsed(!controlsCollapsed)}
                className="hover:text-primary font-medium flex items-center gap-1"
              >
                <span>{controlsCollapsed ? 'Show Layer Filters' : 'Hide Filters'}</span>
              </button>
              <span>•</span>
              <span className="font-mono text-slate-700">
                Target Formation: {activeWell.targetFormation}
              </span>
            </div>

            <button
              onClick={() => {
                setIs2DView(false);
                setInspectedDepth(bitDepth);
              }}
              className="flex items-center gap-1 text-slate-600 hover:text-primary font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Bit Depth</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
