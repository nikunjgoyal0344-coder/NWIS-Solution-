import React, { useState, useMemo, useRef } from 'react';
import { Well, Formation, DrillingIncident } from '../../types';
import { FORMATIONS, DRILLING_INCIDENTS } from '../../data/mockData';
import { 
  GitBranch, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  Info, 
  Plus, 
  Check, 
  Download,
  Sliders,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Activity,
  Flame,
  Radio,
  FileText,
  Eye,
  EyeOff,
  MoveHorizontal,
  ChevronRight
} from 'lucide-react';

interface MultiWellCorrelationViewProps {
  wells: Well[];
  activeWell: Well;
  incidents?: DrillingIncident[];
  onSelectWell: (well: Well) => void;
}

// Generates continuous realistic petrophysical log curve data points for a given well
interface LogPoint {
  md: number;
  tvd: number;
  gr: number;       // Gamma Ray (0 - 150 API)
  cali: number;     // Caliper (6 - 16 in)
  resDeep: number;  // Deep Resistivity (0.2 - 2000 ohm.m)
  resShallow: number; // Shallow Resistivity (0.2 - 2000 ohm.m)
  rhob: number;     // Bulk Density (1.95 - 2.95 g/cm3)
  nphi: number;     // Neutron Porosity (-0.15 to 0.45 v/v)
  rop: number;      // Rate of Penetration (0 - 60 m/hr)
  ecd: number;      // Equivalent Circulating Density (1.10 - 1.35 SG)
  porePressure: number; // Pore Pressure gradient (1.00 - 1.30 SG)
  formation: string;
  isHazard: boolean;
  hazardNote?: string;
}

export const MultiWellCorrelationView: React.FC<MultiWellCorrelationViewProps> = ({
  wells,
  activeWell,
  incidents,
  onSelectWell,
}) => {
  // Navigation Sub-tab: Cross-Well Fence vs Composite Multi-Track Log vs Log Overlay
  const [activeSection, setActiveSection] = useState<'cross-well' | 'composite-log' | 'comparison'>('cross-well');

  // Selected well for Composite Log view
  const [compositeWellId, setCompositeWellId] = useState<string>(activeWell.id);

  // Cross-Well Selection state (supports uploaded sites dynamically)
  const [selectedWellIds, setSelectedWellIds] = useState<string[]>(() => {
    const uploadedIds = wells.filter(w => (w as any).isUploaded).map(w => w.id);
    return Array.from(new Set([
      activeWell.id,
      ...uploadedIds,
      'nhk-124',
      'nhk-109',
      'nhk-088'
    ])).slice(0, 5);
  });

  // Automatically select newly ingested scanned wells
  React.useEffect(() => {
    const uploadedIds = wells.filter(w => (w as any).isUploaded).map(w => w.id);
    if (uploadedIds.length > 0) {
      setSelectedWellIds(prev => {
        const next = [...prev];
        uploadedIds.forEach(id => {
          if (!next.includes(id)) {
            if (next.length >= 5) next.pop();
            next.push(id);
          }
        });
        return next;
      });
    }
  }, [wells]);

  // Datum Flattening Mode for Cross-Well Correlation
  // 'structural' = True Vertical Depth (shows dip/faults)
  // 'stratigraphic' = Flattened on Top Barail Coal marker
  const [datumMode, setDatumMode] = useState<'structural' | 'stratigraphic'>('structural');

  // Interactive Cursor & Scrubber state
  const [hoveredDepth, setHoveredDepth] = useState<number | null>(2845);
  const [zoomRange, setZoomRange] = useState<[number, number]>([0, 3650]);
  const [activePreset, setActivePreset] = useState<'full' | 'tipam' | 'barail' | 'kopili'>('full');

  // Track visibility toggles for Composite Log
  const [visibleTracks, setVisibleTracks] = useState({
    track1_gr: true,
    track2_depth: true,
    track3_res: true,
    track4_porosity: true,
    track5_drilling: true,
  });

  const allIncidents = incidents || DRILLING_INCIDENTS;
  const correlatedWells = wells.filter(w => selectedWellIds.includes(w.id));
  const currentCompositeWell = wells.find(w => w.id === compositeWellId) || activeWell;

  // Toggle well inclusion in cross-section
  const toggleWellSelection = (id: string) => {
    if (selectedWellIds.includes(id)) {
      if (selectedWellIds.length > 2) {
        setSelectedWellIds(selectedWellIds.filter(wId => wId !== id));
      }
    } else {
      if (selectedWellIds.length < 5) {
        setSelectedWellIds([...selectedWellIds, id]);
      }
    }
  };

  // Depth Zoom Presets
  const applyZoomPreset = (preset: 'full' | 'tipam' | 'barail' | 'kopili') => {
    setActivePreset(preset);
    if (preset === 'full') setZoomRange([0, 3650]);
    else if (preset === 'tipam') setZoomRange([1800, 2650]);
    else if (preset === 'barail') setZoomRange([2550, 3180]); // Hazard zone spotlight
    else if (preset === 'kopili') setZoomRange([3100, 3650]);
  };

  // Generate deterministic petrophysical logs for a given well across MD
  const generateWellLog = (well: Well): LogPoint[] => {
    const isAct = well.id === activeWell.id;
    // Regional structural shift based on distance/offset (Nahorkatiya 3.2° E-SE dip)
    const dipShift = well.id === 'nhk-124' ? 40 : well.id === 'nhk-109' ? 75 : well.id === 'nhk-088' ? 110 : (well as any).isUploaded ? 15 : 0;
    const points: LogPoint[] = [];
    const step = 25; // 25m resolution

    for (let depth = 0; depth <= 3650; depth += step) {
      const shifted = depth - dipShift;
      let formation = 'Alluvium / Dhekiajuli';
      let gr = 45 + Math.sin(depth * 0.05) * 15;
      let cali = 8.5 + (depth > 2600 && depth < 2900 ? 1.8 : 0.2);
      let resDeep = 8 + Math.cos(depth * 0.03) * 4;
      let resShallow = resDeep * 0.9;
      let rhob = 2.2 + Math.sin(depth * 0.04) * 0.15;
      let nphi = 0.28 - Math.sin(depth * 0.04) * 0.08;
      let rop = 22 + Math.sin(depth * 0.08) * 8;
      let porePressure = 1.05;
      let ecd = 1.15;
      let isHazard = false;
      let hazardNote: string | undefined;

      if (shifted < 650) {
        formation = 'Alluvium / Dhekiajuli';
        gr = 40 + Math.sin(depth * 0.07) * 12;
        resDeep = 12 + Math.sin(depth * 0.02) * 5;
        rhob = 2.15;
      } else if (shifted < 1850) {
        formation = 'Girujan Clay';
        gr = 110 + Math.sin(depth * 0.06) * 22; // High shale GR
        resDeep = 4.2 + Math.sin(depth * 0.03) * 1.5;
        rhob = 2.45;
        nphi = 0.35;
        rop = 14;
      } else if (shifted < 2600) {
        formation = 'Tipam Sandstone';
        gr = 48 + Math.cos(depth * 0.05) * 18; // Clean reservoir sand
        resDeep = 65 + Math.sin(depth * 0.04) * 45; // High oil/gas resistivity
        resShallow = resDeep * 0.75;
        rhob = 2.30;
        nphi = 0.22;
        rop = 32;
      } else if (shifted < 3150) {
        formation = 'Barail Coal-Shale Sequence';
        // Interbedded coal: extreme low density, extreme high resistivity & nphi
        const inCoal = (shifted >= 2820 && shifted <= 2865) || (shifted >= 2920 && shifted <= 2950);
        if (inCoal) {
          gr = 125 + Math.sin(depth * 0.1) * 20;
          resDeep = 85 + Math.cos(depth * 0.1) * 35;
          rhob = 1.55; // Low coal density
          nphi = 0.62; // High apparent neutron porosity (gas/coal crossover)
          rop = 45;
        } else {
          gr = 95 + Math.sin(depth * 0.05) * 25;
          resDeep = 18 + Math.sin(depth * 0.04) * 8;
          rhob = 2.42;
          nphi = 0.30;
          rop = 24;
        }

        // Highlight critical loss zone at 2,845m - 2,865m
        if (shifted >= 2840 && shifted <= 2865) {
          isHazard = true;
          hazardNote = 'Severe Mud Loss Zone (22 bbl/hr in fractured coal)';
          ecd = 1.25;
        }
      } else {
        formation = 'Kopili Formation';
        gr = 135 + Math.cos(depth * 0.06) * 18;
        resDeep = 3.5 + Math.sin(depth * 0.02) * 1.2;
        rhob = 2.52;
        nphi = 0.28;
        porePressure = 1.28; // Overpressured shale
        ecd = 1.30;
        rop = 12;
      }

      points.push({
        md: depth,
        tvd: depth * 0.985,
        gr: Math.max(10, Math.min(150, gr)),
        cali: Math.max(6, Math.min(16, cali)),
        resDeep: Math.max(0.5, Math.min(200, resDeep)),
        resShallow: Math.max(0.4, Math.min(180, resShallow)),
        rhob: Math.max(1.4, Math.min(2.8, rhob)),
        nphi: Math.max(0.05, Math.min(0.7, nphi)),
        rop: Math.max(5, Math.min(60, rop)),
        ecd,
        porePressure,
        formation,
        isHazard,
        hazardNote
      });
    }
    return points;
  };

  const compositeLogData = useMemo(() => {
    return generateWellLog(currentCompositeWell);
  }, [currentCompositeWell]);

  // Filtered log points based on zoom range
  const filteredLogPoints = useMemo(() => {
    return compositeLogData.filter(p => p.md >= zoomRange[0] && p.md <= zoomRange[1]);
  }, [compositeLogData, zoomRange]);

  // Current hovered readings
  const activeReading = useMemo(() => {
    if (hoveredDepth === null) return compositeLogData.find(p => p.md === 2845) || compositeLogData[0];
    return compositeLogData.find(p => Math.abs(p.md - hoveredDepth) < 15) || compositeLogData[0];
  }, [compositeLogData, hoveredDepth]);

  return (
    <div className="space-y-6">
      {/* 1. SECTION HEADER & PRIMARY NAVIGATION */}
      <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-primary rounded">
              <GitBranch className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-800">
              Cross-Well Stratigraphic &amp; Composite Well-Log Correlation
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Depth-aligned multi-well fence diagram, petrophysical composite logs (GR, Resistivity, Density-Neutron), and real-time geomechanical mud window correlation
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-mild flex items-center gap-1 border border-slate-200 text-xs">
            <button
              onClick={() => setActiveSection('cross-well')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
                activeSection === 'cross-well'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cross-Well Fence</span>
            </button>

            <button
              onClick={() => setActiveSection('composite-log')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
                activeSection === 'composite-log'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Composite Well Log</span>
            </button>

            <button
              onClick={() => setActiveSection('comparison')}
              className={`px-3 py-1.5 rounded font-semibold transition-colors flex items-center gap-1.5 ${
                activeSection === 'comparison'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
              <span>Log Overlay</span>
            </button>
          </div>

          <button
            onClick={() => alert('Exporting high-resolution PDF/SVG composite correlation dossier')}
            className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
            title="Export Vector SVG / PDF Dossier"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Dossier</span>
          </button>
        </div>
      </div>

      {/* 2. GLOBAL TOOLBAR: WELL CHIPS & DATUM / ZOOM CONTROLS */}
      <div className="bg-white p-3.5 rounded-mild border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Correlated Well Selection Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Correlated Sites ({selectedWellIds.length}/5):</span>
          </span>

          {wells.map(w => {
            const isSelected = selectedWellIds.includes(w.id);
            const isAct = w.id === activeWell.id;
            const isUploaded = (w as any).isUploaded;

            return (
              <button
                key={w.id}
                onClick={() => !isAct && toggleWellSelection(w.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? isAct
                      ? 'bg-primary text-white border-primary cursor-default'
                      : isUploaded
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-blue-50 text-primary border-blue-300 font-semibold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-400" />}
                <span>{w.name}</span>
                {isUploaded && <span className="px-1 bg-white text-emerald-800 text-[9px] font-bold rounded">UPLOADED</span>}
              </button>
            );
          })}
        </div>

        {/* Stratigraphic Datum & Zoom Presets */}
        <div className="flex items-center gap-2 shrink-0">
          {activeSection === 'cross-well' && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded text-xs border border-slate-200">
              <span className="text-[11px] text-slate-500 px-2 font-medium">Datum:</span>
              <button
                onClick={() => setDatumMode('structural')}
                className={`px-2 py-1 rounded font-semibold text-[11px] transition-colors ${
                  datumMode === 'structural' ? 'bg-white text-primary shadow-xs' : 'text-slate-600'
                }`}
                title="True Vertical Depth (shows regional 3.2° structural dip)"
              >
                Structural (TVD)
              </button>
              <button
                onClick={() => setDatumMode('stratigraphic')}
                className={`px-2 py-1 rounded font-semibold text-[11px] transition-colors ${
                  datumMode === 'stratigraphic' ? 'bg-white text-primary shadow-xs' : 'text-slate-600'
                }`}
                title="Flatten on Top Barail Coal marker to observe sand geometry"
              >
                Flatten on Barail
              </button>
            </div>
          )}

          {activeSection === 'composite-log' && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Zone Focus:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded text-xs border border-slate-200">
                <button
                  onClick={() => applyZoomPreset('full')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold ${
                    activePreset === 'full' ? 'bg-white text-primary shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Full (0-3650m)
                </button>
                <button
                  onClick={() => applyZoomPreset('tipam')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold ${
                    activePreset === 'tipam' ? 'bg-white text-primary shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tipam Sand
                </button>
                <button
                  onClick={() => applyZoomPreset('barail')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold ${
                    activePreset === 'barail' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                  title="Spotlight Barail Coal Hazard & Mud Loss Zone"
                >
                  ⚠️ Barail Hazard
                </button>
                <button
                  onClick={() => applyZoomPreset('kopili')}
                  className={`px-2 py-1 rounded text-[11px] font-semibold ${
                    activePreset === 'kopili' ? 'bg-white text-primary shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Kopili Shale
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: CROSS-WELL STRATIGRAPHIC FENCE CORRELATION
          ========================================================================= */}
      {activeSection === 'cross-well' && (
        <div className="bg-white rounded-mild border border-slate-200 shadow-card p-6 space-y-5">
          {/* Geologic Dip Indicator Banner */}
          <div className="bg-blue-50/60 p-3 rounded-mild border border-blue-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-700">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary shrink-0" />
              <span>
                <strong>Cross-Well Stratigraphic Tie-Lines:</strong> Correlating {correlatedWells.length} wells across Upper Assam basin formations.
                {datumMode === 'structural' 
                  ? ' Structural mode displays regional tectonic dip (3.2° E-SE) toward the Naga Thrust Belt.' 
                  : ' Stratigraphic mode flattens all wells on the Top Barail Coal marker top to highlight depositional sand body geometry and channel pinch-outs.'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 bg-white border border-blue-200 rounded text-primary text-[10px] font-mono font-semibold">
                Dip: 3.2° E-SE
              </span>
              <span className="px-2 py-0.5 bg-white border border-blue-200 rounded text-emerald-700 text-[10px] font-mono font-semibold">
                Facies: Barail Coal Seam #4
              </span>
            </div>
          </div>

          {/* Interactive Fence SVG & Columns Container */}
          <div 
            className="relative border border-slate-200 rounded-mild bg-slate-50/60 p-6 overflow-x-auto min-w-[760px]"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientY - rect.top - 80) / 460));
              setHoveredDepth(Math.round(ratio * 3650));
            }}
            onMouseLeave={() => setHoveredDepth(2845)}
          >
            {/* Depth Axis Indicator */}
            <div className="absolute left-2 top-24 bottom-6 w-14 flex flex-col justify-between text-[10px] font-mono text-slate-400 border-r border-slate-300 pr-1 select-none">
              <span>0m (Surface)</span>
              <span>650m (Girujan)</span>
              <span>1,850m (Tipam)</span>
              <span className="text-amber-600 font-semibold">2,600m (Barail)</span>
              <span className="text-red-600 font-bold">2,845m (Loss)</span>
              <span>3,150m (Kopili)</span>
              <span>3,650m (TD)</span>
            </div>

            {/* SYNCHRONIZED DEPTH HAIRLINE */}
            {hoveredDepth !== null && (
              <div 
                className="absolute left-16 right-4 border-t-2 border-dashed border-primary/70 z-30 pointer-events-none flex items-center justify-end"
                style={{ top: `${90 + (hoveredDepth / 3650) * 440}px` }}
              >
                <span className="bg-primary text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-sm">
                  Depth: {hoveredDepth}m MD
                </span>
              </div>
            )}

            {/* Wells Columns Grid */}
            <div 
              className="ml-16 grid gap-8 relative z-10" 
              style={{ gridTemplateColumns: `repeat(${correlatedWells.length}, minmax(170px, 1fr))` }}
            >
              {correlatedWells.map((well, idx) => {
                const isAct = well.id === activeWell.id;
                const isUploaded = (well as any).isUploaded;
                const wellIncidents = allIncidents.filter(i => i.wellId === well.id);
                const shiftY = datumMode === 'stratigraphic' ? (idx * -12) : 0; // Flatten compensation

                return (
                  <div 
                    key={well.id} 
                    className="flex flex-col items-center space-y-3 transition-transform duration-300"
                    style={{ transform: `translateY(${shiftY}px)` }}
                  >
                    {/* Header Card */}
                    <div 
                      onClick={() => onSelectWell(well)}
                      className={`w-full p-2.5 rounded-mild border text-center cursor-pointer transition-all ${
                        isAct 
                          ? 'bg-blue-50 border-primary ring-2 ring-primary/20 shadow-xs' 
                          : isUploaded
                          ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300/30 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        isAct ? 'bg-primary text-white' : isUploaded ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {isAct ? 'Active eRTMAC' : isUploaded ? 'Uploaded Site' : 'Historical Offset'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 mt-1 truncate">{well.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {isAct ? `Bit: ${well.currentDepth}m` : `TD: ${well.totalDepth}m`}
                      </p>
                    </div>

                    {/* Dual-Track Wellbore Column: Track 1 Lithology, Track 2 Petrophysical Log Curve */}
                    <div className="relative w-full h-[460px] bg-white rounded border border-slate-200 overflow-hidden flex shadow-inner">
                      
                      {/* Track 1: Lithology Formation Intervals */}
                      <div className="w-1/2 h-full flex flex-col text-[9px] font-medium border-r border-slate-200">
                        <div className="h-[18%] bg-slate-200/80 border-b border-slate-300 flex items-center justify-center text-slate-600">
                          Girujan Clay
                        </div>
                        <div className="h-[28%] bg-amber-100/70 border-b border-slate-300 flex items-center justify-center text-amber-900">
                          Tipam Sand
                        </div>
                        <div className="h-[32%] bg-slate-300/80 border-b border-slate-400 flex flex-col items-center justify-center text-slate-900 font-bold relative">
                          <span>Barail Coal</span>
                          
                          {/* Incident Marker Callout */}
                          {wellIncidents.some(i => i.depth >= 2840 && i.depth <= 2865) && (
                            <div className="mt-1 px-1.5 py-0.5 rounded bg-red-600 text-white text-[8px] font-mono shadow-xs text-center animate-pulse">
                              ⚠️ Loss {wellIncidents.find(i => i.depth >= 2840 && i.depth <= 2865)?.depth}m
                            </div>
                          )}
                        </div>
                        <div className="flex-1 bg-slate-400/80 flex items-center justify-center text-slate-900">
                          Kopili Shale
                        </div>
                      </div>

                      {/* Track 2: Realistic Gamma Ray Log Curve */}
                      <div className="w-1/2 h-full bg-slate-50/80 relative">
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 60 460">
                          {/* Sand Shading (Yellow for low GR) */}
                          <path
                            d={`M 15 80 L 15 210 L 40 210 L 35 150 L 42 110 Z`}
                            fill="rgba(253, 230, 138, 0.45)"
                          />
                          {/* Log Curve */}
                          <path
                            d={`M 15 0 
                               C 45 40, 20 80, 48 110
                               C 18 150, 42 180, 20 210
                               C 55 240, 35 280, 52 320
                               C 15 350, 48 390, 25 430
                               L 28 460`}
                            fill="none"
                            stroke={isAct ? "#2563EB" : isUploaded ? "#059669" : "#64748B"}
                            strokeWidth="1.8"
                          />
                        </svg>

                        {/* Current Bit Marker on Active Well */}
                        {isAct && (
                          <div 
                            className="absolute left-0 right-0 h-1 bg-emerald-500 z-20 flex items-center justify-end"
                            style={{ top: `${(well.currentDepth / 3650) * 100}%` }}
                          >
                            <span className="bg-emerald-600 text-white text-[8px] font-bold px-1 rounded -mr-2 shadow-xs">
                              Bit {well.currentDepth}m
                            </span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: COMPOSITE MULTI-TRACK WELL-LOG SUITE
          ========================================================================= */}
      {activeSection === 'composite-log' && (
        <div className="bg-white rounded-mild border border-slate-200 shadow-card p-6 space-y-6">
          
          {/* Well Switcher & Track Toggles Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Display Well:</span>
              <select
                value={compositeWellId}
                onChange={(e) => setCompositeWellId(e.target.value)}
                className="h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {wells.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} {w.id === activeWell.id ? '(Active eRTMAC)' : ''}
                  </option>
                ))}
              </select>

              <span className="text-[11px] text-slate-500">
                Total Depth: <strong>{currentCompositeWell.totalDepth}m MD</strong> • Rig: {currentCompositeWell.rigName}
              </span>
            </div>

            {/* Track Enable/Disable Toggles */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold text-[11px] mr-1">Active Tracks:</span>
              
              <button
                onClick={() => setVisibleTracks(prev => ({ ...prev, track1_gr: !prev.track1_gr }))}
                className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
                  visibleTracks.track1_gr ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                Track 1: Gamma / Caliper
              </button>

              <button
                onClick={() => setVisibleTracks(prev => ({ ...prev, track3_res: !prev.track3_res }))}
                className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
                  visibleTracks.track3_res ? 'bg-red-50 text-red-800 border-red-300' : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                Track 3: Resistivity
              </button>

              <button
                onClick={() => setVisibleTracks(prev => ({ ...prev, track4_porosity: !prev.track4_porosity }))}
                className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
                  visibleTracks.track4_porosity ? 'bg-blue-50 text-blue-800 border-blue-300' : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                Track 4: Density / Neutron
              </button>

              <button
                onClick={() => setVisibleTracks(prev => ({ ...prev, track5_drilling: !prev.track5_drilling }))}
                className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
                  visibleTracks.track5_drilling ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}
              >
                Track 5: Drilling ECD &amp; Mud
              </button>
            </div>
          </div>

          {/* DYNAMIC INSTANTANEOUS LOG VALUE INSPECTION HUD */}
          <div className="bg-slate-50 p-4 rounded-mild border border-slate-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Scrubbed Depth</span>
              <span className="text-sm font-bold text-primary font-mono">{activeReading.md} m MD</span>
              <span className="text-[9px] text-slate-500 block truncate">{activeReading.formation}</span>
            </div>

            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-[10px] text-amber-700 uppercase font-bold block">Gamma Ray (GR)</span>
              <span className="text-sm font-bold text-slate-800 font-mono">{activeReading.gr.toFixed(1)} API</span>
              <span className="text-[9px] text-slate-500 block">{activeReading.gr < 65 ? 'Clean Sandstone' : 'Shale / Coal'}</span>
            </div>

            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-[10px] text-slate-600 uppercase font-bold block">Caliper (CALI)</span>
              <span className="text-sm font-bold text-slate-800 font-mono">{activeReading.cali.toFixed(2)} in</span>
              <span className="text-[9px] text-slate-500 block">Bit Size: 8.50 in</span>
            </div>

            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-[10px] text-red-700 uppercase font-bold block">Deep Res (LLD)</span>
              <span className="text-sm font-bold text-red-700 font-mono">{activeReading.resDeep.toFixed(1)} Ω·m</span>
              <span className="text-[9px] text-slate-500 block">Shallow: {activeReading.resShallow.toFixed(1)} Ω·m</span>
            </div>

            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-[10px] text-blue-700 uppercase font-bold block">Bulk Density</span>
              <span className="text-sm font-bold text-blue-700 font-mono">{activeReading.rhob.toFixed(2)} g/cm³</span>
              <span className="text-[9px] text-slate-500 block">NPHI: {(activeReading.nphi * 100).toFixed(0)}%</span>
            </div>

            <div className="p-2 bg-white rounded border border-slate-200">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">Drilling ROP</span>
              <span className="text-sm font-bold text-emerald-700 font-mono">{activeReading.rop.toFixed(1)} m/hr</span>
              <span className="text-[9px] text-slate-500 block">ECD: {activeReading.ecd.toFixed(2)} SG</span>
            </div>

            <div className={`p-2 rounded border ${
              activeReading.isHazard ? 'bg-red-50 border-red-300' : 'bg-emerald-50 border-emerald-300'
            }`}>
              <span className={`text-[10px] uppercase font-bold block ${
                activeReading.isHazard ? 'text-red-700' : 'text-emerald-700'
              }`}>
                Hazard Window
              </span>
              <span className={`text-xs font-bold block truncate ${
                activeReading.isHazard ? 'text-red-700' : 'text-emerald-700'
              }`}>
                {activeReading.isHazard ? '⚠️ Mud Loss' : '✓ Safe Margin'}
              </span>
              <span className="text-[9px] text-slate-500 block truncate">
                {activeReading.hazardNote || 'Normal gradient'}
              </span>
            </div>
          </div>

          {/* COMPOSITE MULTI-TRACK SVG GRAPH CONTAINER */}
          <div 
            className="border border-slate-300 rounded-mild bg-white p-4 overflow-x-auto min-w-[800px] select-none cursor-crosshair relative shadow-inner"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.max(0, Math.min(1, (e.clientY - rect.top - 60) / 480));
              const currentRange = zoomRange[1] - zoomRange[0];
              const calcDepth = Math.round(zoomRange[0] + ratio * currentRange);
              setHoveredDepth(calcDepth);
            }}
          >
            {/* Synchronized depth hair-line on hover */}
            {hoveredDepth !== null && (
              <div 
                className="absolute left-4 right-4 border-t border-red-500 z-30 pointer-events-none flex items-center justify-between"
                style={{
                  top: `${60 + ((hoveredDepth - zoomRange[0]) / (zoomRange[1] - zoomRange[0])) * 480}px`
                }}
              >
                <span className="bg-red-600 text-white text-[9px] font-mono px-1 rounded shadow-xs">
                  {hoveredDepth}m
                </span>
                <span className="bg-red-600 text-white text-[9px] font-mono px-1 rounded shadow-xs">
                  Tie-Cursor
                </span>
              </div>
            )}

            {/* Track Column Headers */}
            <div className="grid grid-cols-12 gap-2 text-center text-[10px] font-bold pb-2 border-b border-slate-300 bg-slate-50 py-2 rounded">
              {visibleTracks.track1_gr && (
                <div className="col-span-3 text-amber-900 border-r border-slate-300">
                  <span>TRACK 1: LITHOLOGY</span>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 px-2 mt-0.5">
                    <span>GR: 0 API</span>
                    <span>CALI (6-16")</span>
                    <span>150 API</span>
                  </div>
                </div>
              )}

              {visibleTracks.track2_depth && (
                <div className="col-span-1 text-slate-700 border-r border-slate-300">
                  <span>DEPTH</span>
                  <div className="text-[9px] font-mono text-slate-500 mt-0.5">TVD / MD</div>
                </div>
              )}

              {visibleTracks.track3_res && (
                <div className="col-span-3 text-red-900 border-r border-slate-300">
                  <span>TRACK 2: RESISTIVITY (LOG 10)</span>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 px-2 mt-0.5">
                    <span>0.2 Ω·m</span>
                    <span>LLD (Deep) / LLS (Shallow)</span>
                    <span>2000 Ω·m</span>
                  </div>
                </div>
              )}

              {visibleTracks.track4_porosity && (
                <div className="col-span-3 text-blue-900 border-r border-slate-300">
                  <span>TRACK 3: POROSITY &amp; DENSITY</span>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 px-2 mt-0.5">
                    <span>RHOB 1.95</span>
                    <span>Gas/Coal X-Over</span>
                    <span>NPHI 45%</span>
                  </div>
                </div>
              )}

              {visibleTracks.track5_drilling && (
                <div className="col-span-2 text-emerald-900">
                  <span>TRACK 4: DRILLING &amp; MUD</span>
                  <div className="flex justify-between text-[9px] font-mono text-slate-500 px-1 mt-0.5">
                    <span>ROP (0-60)</span>
                    <span>ECD / Loss Zone</span>
                  </div>
                </div>
              )}
            </div>

            {/* Composite Vector Log Canvas */}
            <div className="relative h-[480px] grid grid-cols-12 gap-2 mt-2">
              
              {/* TRACK 1: Gamma Ray & Caliper */}
              {visibleTracks.track1_gr && (
                <div className="col-span-3 h-full border-r border-slate-300 relative bg-slate-50/50">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 480">
                    {/* Grid lines */}
                    <line x1="25" y1="0" x2="25" y2="480" stroke="#E2E8F0" strokeWidth="0.8" />
                    <line x1="50" y1="0" x2="50" y2="480" stroke="#CBD5E1" strokeWidth="0.8" />
                    <line x1="75" y1="0" x2="75" y2="480" stroke="#E2E8F0" strokeWidth="0.8" />
                    
                    {/* Sand Shading Fill (Yellow for low GR < 65) */}
                    <path
                      d={filteredLogPoints.reduce((acc, pt, idx) => {
                        const y = (idx / (filteredLogPoints.length - 1)) * 480;
                        const x = (pt.gr / 150) * 100;
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '') + ` L 0 480 L 0 0 Z`}
                      fill="rgba(253, 230, 138, 0.4)"
                    />

                    {/* Gamma Ray Curve (Solid Green/Amber) */}
                    <path
                      d={filteredLogPoints.reduce((acc, pt, idx) => {
                        const y = (idx / (filteredLogPoints.length - 1)) * 480;
                        const x = (pt.gr / 150) * 100;
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#D97706"
                      strokeWidth="1.8"
                    />

                    {/* Caliper Curve (Dashed) */}
                    <path
                      d={filteredLogPoints.reduce((acc, pt, idx) => {
                        const y = (idx / (filteredLogPoints.length - 1)) * 480;
                        const x = ((pt.cali - 6) / 10) * 100;
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#64748B"
                      strokeDasharray="3,3"
                      strokeWidth="1.4"
                    />
                  </svg>
                </div>
              )}

              {/* TRACK 2: Depth Track */}
              {visibleTracks.track2_depth && (
                <div className="col-span-1 h-full border-r border-slate-300 relative bg-slate-100/70 flex flex-col justify-between text-[10px] font-mono text-slate-600 text-center py-2 select-none">
                  {Array.from({ length: 9 }).map((_, i) => {
                    const d = Math.round(zoomRange[0] + (i / 8) * (zoomRange[1] - zoomRange[0]));
                    const isHazardInterval = d >= 2840 && d <= 2865;
                    return (
                      <span key={i} className={isHazardInterval ? 'text-red-600 font-bold bg-red-50 rounded' : ''}>
                        {d}m
                      </span>
                    );
                  })}
                </div>
              )}

              {/* TRACK 3: Resistivity Logs (Logarithmic) */}
              {visibleTracks.track3_res && (
                <div className="col-span-3 h-full border-r border-slate-300 relative bg-slate-50/50">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 480">
                    {/* Log Decade Grid Lines */}
                    <line x1="25" y1="0" x2="25" y2="480" stroke="#E2E8F0" strokeWidth="0.8" />
                    <line x1="50" y1="0" x2="50" y2="480" stroke="#CBD5E1" strokeWidth="0.8" />
                    <line x1="75" y1="0" x2="75" y2="480" stroke="#E2E8F0" strokeWidth="0.8" />

                    {/* Deep Resistivity Curve (Red) */}
                    <path
                      d={filteredLogPoints.reduce((acc, pt, idx) => {
                        const y = (idx / (filteredLogPoints.length - 1)) * 480;
                        const logVal = Math.log10(pt.resDeep) / Math.log10(200);
                        const x = Math.max(0, Math.min(100, logVal * 100));
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#DC2626"
                      strokeWidth="1.8"
                    />

                    {/* Shallow Resistivity Curve (Blue Dashed) */}
                    <path
                      d={filteredLogPoints.reduce((acc, pt, idx) => {
                        const y = (idx / (filteredLogPoints.length - 1)) * 480;
                        const logVal = Math.log10(pt.resShallow) / Math.log10(200);
                        const x = Math.max(0, Math.min(100, logVal * 100));
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#2563EB"
                      strokeDasharray="4,3"
                      strokeWidth="1.4"
                    />
                  </svg>
                </div>
              )}

              {/* TRACK 4: Porosity & Bulk Density */}
              {visibleTracks.track4_porosity && (
                <div className="col-span-3 h-full border-r border-slate-300 relative bg-slate-50/50">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 480">
                    {/* Crossover Shading (Yellow for coal/gas) */}
                    <path
                      d={filteredLogPoints.reduce((acc, pt, idx) => {
                        const y = (idx / (filteredLogPoints.length - 1)) * 480;
                        const xRho = ((pt.rhob - 1.95) / 1.0) * 100;
                        const xNphi = (1 - (pt.nphi + 0.15) / 0.6) * 100;
                        return idx === 0 ? `M ${xRho} ${y}` : `${acc} L ${xRho} ${y}`;
                      }, '') + ` L 100 480 L 100 0 Z`}
                      fill="rgba(59, 130, 246, 0.12)"
                    />

                    {/* Density Curve (Red) */}
                    <path
                      d={filteredLogPoints.reduce((acc, pt, idx) => {
                        const y = (idx / (filteredLogPoints.length - 1)) * 480;
                        const x = Math.max(0, Math.min(100, ((pt.rhob - 1.95) / 1.0) * 100));
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#B91C1C"
                      strokeWidth="1.8"
                    />

                    {/* Neutron Porosity (Blue) */}
                    <path
                      d={filteredLogPoints.reduce((acc, pt, idx) => {
                        const y = (idx / (filteredLogPoints.length - 1)) * 480;
                        const x = Math.max(0, Math.min(100, (1 - (pt.nphi + 0.15) / 0.6) * 100));
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#1D4ED8"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>
              )}

              {/* TRACK 5: Drilling ECD vs Mud Weight Window & Loss Zone */}
              {visibleTracks.track5_drilling && (
                <div className="col-span-2 h-full relative bg-slate-50/50">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 480">
                    {/* Safe Mud Window Fill (Green zone) */}
                    <rect x="25" y="0" width="45" height="480" fill="rgba(34, 197, 94, 0.15)" />

                    {/* Hazard Interval Banner at 2848m */}
                    {zoomRange[0] <= 2865 && zoomRange[1] >= 2840 && (
                      <g>
                        <rect 
                          x="0" 
                          y={((2840 - zoomRange[0]) / (zoomRange[1] - zoomRange[0])) * 480} 
                          width="100" 
                          height={Math.max(12, ((25) / (zoomRange[1] - zoomRange[0])) * 480)} 
                          fill="rgba(239, 68, 68, 0.35)" 
                        />
                        <text 
                          x="50" 
                          y={((2852 - zoomRange[0]) / (zoomRange[1] - zoomRange[0])) * 480} 
                          textAnchor="middle" 
                          fill="#DC2626" 
                          fontSize="7" 
                          fontWeight="bold"
                        >
                          ⚠️ LOSS ZONE
                        </text>
                      </g>
                    )}

                    {/* ROP Curve */}
                    <path
                      d={filteredLogPoints.reduce((acc, pt, idx) => {
                        const y = (idx / (filteredLogPoints.length - 1)) * 480;
                        const x = (pt.rop / 60) * 100;
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#059669"
                      strokeWidth="1.6"
                    />
                  </svg>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: LOG CURVE OVERLAY & VARIANCE COMPARISON
          ========================================================================= */}
      {activeSection === 'comparison' && (
        <div className="bg-white rounded-mild border border-slate-200 shadow-card p-6 space-y-6">
          <div className="bg-blue-50/60 p-4 rounded-mild border border-blue-200 text-xs text-slate-700 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-800">Petrophysical Curve Overlay &amp; Variance Engine:</h4>
              <p className="mt-0.5">
                Directly aligns Gamma Ray and Resistivity curves of <strong>{activeWell.name} (Live eRTMAC)</strong> against offset wells (e.g. <strong>Well NHK-124</strong>). Cross-correlation coefficient confirms R = 0.942 facies match with a structural dip displacement of ΔZ = +40m.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gamma Ray Curve Overlay */}
            <div className="p-4 bg-slate-50 rounded-mild border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Gamma Ray Curve Overlay (0 - 150 API)</span>
                <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Match: 94.2%
                </span>
              </div>
              <div className="h-64 bg-white rounded border border-slate-200 p-2 relative">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 240">
                  {/* Active Well Curve (Blue) */}
                  <path
                    d="M 30 0 Q 60 40, 25 80 T 40 140 Q 75 190, 30 240"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.2"
                  />
                  {/* Offset Well Curve (Red dashed) */}
                  <path
                    d="M 35 15 Q 65 55, 30 95 T 45 155 Q 80 205, 35 240"
                    fill="none"
                    stroke="#EF4444"
                    strokeDasharray="4,4"
                    strokeWidth="2.0"
                  />
                </svg>
                <div className="absolute bottom-2 right-2 flex items-center gap-3 text-[10px] font-bold bg-white/90 p-1.5 rounded border border-slate-200">
                  <span className="text-blue-600">— Active Well</span>
                  <span className="text-red-500">--- Offset NHK-124 (+40m)</span>
                </div>
              </div>
            </div>

            {/* Deep Resistivity Overlay */}
            <div className="p-4 bg-slate-50 rounded-mild border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Deep Induction Resistivity Overlay (Log 10)</span>
                <span className="font-mono text-primary font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  ΔZ Shift: +40m
                </span>
              </div>
              <div className="h-64 bg-white rounded border border-slate-200 p-2 relative">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 240">
                  {/* Active Well Res */}
                  <path
                    d="M 20 0 Q 70 50, 30 100 T 80 160 Q 40 210, 25 240"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.2"
                  />
                  {/* Offset Res */}
                  <path
                    d="M 25 15 Q 75 65, 35 115 T 85 175 Q 45 225, 30 240"
                    fill="none"
                    stroke="#D97706"
                    strokeDasharray="4,4"
                    strokeWidth="2.0"
                  />
                </svg>
                <div className="absolute bottom-2 right-2 flex items-center gap-3 text-[10px] font-bold bg-white/90 p-1.5 rounded border border-slate-200">
                  <span className="text-blue-600">— Active LLD</span>
                  <span className="text-amber-600">--- Offset LLD (+40m)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
