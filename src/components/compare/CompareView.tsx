import React, { useState } from 'react';
import { Well, TelemetryPoint, DrillingIncident } from '../../types';
import { 
  DRILLING_INCIDENTS, 
  generateDepthTelemetry,
  FORMATIONS 
} from '../../data/mockData';
import { 
  GitCompare, 
  ArrowRightLeft, 
  AlertTriangle, 
  CheckCircle, 
  Gauge, 
  Download, 
  Layers, 
  ShieldAlert,
  Info
} from 'lucide-react';

interface CompareViewProps {
  wells: Well[];
  activeWell: Well;
  initialOffsetWell?: Well | null;
  onSelectWellDetails: (well: Well) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  wells,
  activeWell,
  initialOffsetWell,
  onSelectWellDetails,
}) => {
  const historicalWells = wells.filter(w => w.type === 'previous');
  const [selectedOffsetId, setSelectedOffsetId] = useState<string>(
    initialOffsetWell ? initialOffsetWell.id : historicalWells[0]?.id || ''
  );

  const selectedOffsetWell = wells.find(w => w.id === selectedOffsetId) || historicalWells[0];

  // Telemetry for both wells
  const activeTelemetry = generateDepthTelemetry(true, activeWell.id);
  const offsetTelemetry = generateDepthTelemetry(false, selectedOffsetWell.id);

  // Incidents at depth for both
  const activeIncidents = DRILLING_INCIDENTS.filter(i => i.wellId === activeWell.id);
  const offsetIncidents = DRILLING_INCIDENTS.filter(i => i.wellId === selectedOffsetWell.id);

  // Equivalence depth station (at active bit: 2835m)
  const currentBitDepth = activeWell.currentDepth;
  const activePoint = activeTelemetry.find(p => p.depth >= currentBitDepth - 10) || activeTelemetry[activeTelemetry.length - 1];
  const offsetPoint = offsetTelemetry.find(p => p.depth >= currentBitDepth - 10) || offsetTelemetry[offsetTelemetry.length - 1];

  const handleExportPDF = () => {
    alert(`Exporting depth-aligned comparative petrotechnical dossier: ${activeWell.name} vs ${selectedOffsetWell.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Well Selector Controls */}
      <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-bold text-slate-800">
              Depth-Aligned Compare View
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Side-by-side operational comparison between Live eRTMAC Active Well and Historical Offset Experience
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Offset Well Selector Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Compare with:</label>
            <select
              value={selectedOffsetId}
              onChange={(e) => setSelectedOffsetId(e.target.value)}
              className="h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-mild font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {historicalWells.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.distanceFromActiveKm} km • TD {w.totalDepth}m • {w.riskLevel.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportPDF}
            className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Difference Highlights Banner */}
      <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-mild text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-amber-800">
          <Info className="w-4 h-4 text-amber-600" />
          <span>Automated Variance Analysis at Depth Station ~{currentBitDepth}m:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-5 text-amber-900">
          <div>
            • <strong>Mud Weight Overbalance:</strong> Active is at 1.18 SG vs Offset {selectedOffsetWell.name} at 1.16 SG (Offset experienced 22 bbl/hr mud loss at 2,845m).
          </div>
          <div>
            • <strong>Torque Trend:</strong> Active surface torque is 24.5 kN.m (+3.5 kN.m above normal baseline), consistent with pre-kick stick-slip in {selectedOffsetWell.name}.
          </div>
          <div>
            • <strong>Casing Shoe Margin:</strong> Active 9-5/8" casing set at 2,580m vs Offset at {selectedOffsetWell.casingProgram[2]?.shoeDepth || 2595}m (good structural agreement).
          </div>
        </div>
      </div>

      {/* Split-Screen Columns: Active Left vs Offset Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: ACTIVE WELL (Live eRTMAC) */}
        <div className="bg-white rounded-mild border-2 border-blue-600/30 p-5 shadow-card space-y-4">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-bold text-primary">{activeWell.name}</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-primary border border-blue-200">
                  Live eRTMAC
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeWell.field} ({activeWell.block}) • Rig: {activeWell.rigName}
              </p>
            </div>
            <button
              onClick={() => onSelectWellDetails(activeWell)}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Full Profile
            </button>
          </div>

          {/* Key Parameters at Current Bit Position */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Depth</span>
              <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">{activeWell.currentDepth} m</p>
              <p className="text-[10px] text-slate-500">TD: {activeWell.totalDepth}m</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Mud Wt (In / Out)</span>
              <p className="text-lg font-bold text-emerald-700 font-mono mt-0.5">
                {activePoint?.mudWeightIn} / {activePoint?.mudWeightOut} <span className="text-xs font-normal">SG</span>
              </p>
              <p className="text-[10px] text-slate-500">ECD: {activePoint?.ecd} SG</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">ROP / WOB</span>
              <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                {activePoint?.rop} <span className="text-xs font-normal">m/h</span>
              </p>
              <p className="text-[10px] text-slate-500">WOB: {activePoint?.wob} klbs</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Torque / RPM</span>
              <p className="text-lg font-bold text-amber-700 font-mono mt-0.5">
                {activePoint?.torque} <span className="text-xs font-normal">kN.m</span>
              </p>
              <p className="text-[10px] text-slate-500">RPM: {activePoint?.rpm}</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Standpipe Pressure</span>
              <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                {activePoint?.spp} <span className="text-xs font-normal">psi</span>
              </p>
              <p className="text-[10px] text-slate-500">Normal Range</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Gas Shows</span>
              <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                {activePoint?.gasUnits} <span className="text-xs font-normal">units</span>
              </p>
              <p className="text-[10px] text-slate-500">Connection gas stable</p>
            </div>
          </div>

          {/* Current Geological Status */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
            <span className="font-semibold text-slate-700">Active Horizon: </span>
            <span className="font-bold text-primary">Barail Coal-Shale Sequence</span> (2,600m – 3,150m)
            <p className="text-slate-500 mt-1">
              Active bit is 10m above fractured coal seam #4. 9-5/8" casing shoe tested to 1.45 SG FIT.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: HISTORICAL OFFSET WELL */}
        <div className="bg-white rounded-mild border border-slate-200 p-5 shadow-card space-y-4">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-800">{selectedOffsetWell.name}</h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                  Historical Offset ({selectedOffsetWell.distanceFromActiveKm} km away)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedOffsetWell.field} • Spud: {selectedOffsetWell.spudDate} • Completed: {selectedOffsetWell.completionDate}
              </p>
            </div>
            <button
              onClick={() => onSelectWellDetails(selectedOffsetWell)}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Full Profile
            </button>
          </div>

          {/* Parameters at Equivalent Depth */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Equivalent Depth</span>
              <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">{offsetPoint?.depth} m</p>
              <p className="text-[10px] text-slate-500">TD: {selectedOffsetWell.totalDepth}m</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Historical Mud Wt</span>
              <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                {offsetPoint?.mudWeightIn} <span className="text-xs font-normal">SG</span>
              </p>
              <p className="text-[10px] text-red-600 font-semibold">Underbalanced &rarr; Loss</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Historical ROP</span>
              <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                {offsetPoint?.rop} <span className="text-xs font-normal">m/h</span>
              </p>
              <p className="text-[10px] text-slate-500">WOB: {offsetPoint?.wob} klbs</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Historical Torque</span>
              <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                {offsetPoint?.torque} <span className="text-xs font-normal">kN.m</span>
              </p>
              <p className="text-[10px] text-slate-500">RPM: {offsetPoint?.rpm}</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">SPP at Event</span>
              <p className="text-lg font-bold text-slate-800 font-mono mt-0.5">
                {offsetPoint?.spp} <span className="text-xs font-normal">psi</span>
              </p>
              <p className="text-[10px] text-slate-500">Pressure dropped on loss</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400">Gas Spike</span>
              <p className="text-lg font-bold text-red-600 font-mono mt-0.5">
                {offsetPoint?.gasUnits} <span className="text-xs font-normal">units</span>
              </p>
              <p className="text-[10px] text-red-600 font-semibold">Gas kick detected</p>
            </div>
          </div>

          {/* Historical Incident at this Horizon */}
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Recorded Incident at this Depth:</span>
            </div>
            {offsetIncidents.length > 0 ? (
              <p className="text-red-900 leading-snug">
                <strong>{offsetIncidents[0].title}</strong> at {offsetIncidents[0].depth}m: {offsetIncidents[0].description} (NPT: {offsetIncidents[0].durationHours} hrs).
              </p>
            ) : (
              <p className="text-slate-600">No major NPT incident recorded at this specific depth station.</p>
            )}
          </div>
        </div>

      </div>

      {/* Depth-Synchronized Log Comparison Table */}
      <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Synchronized Multi-Track Parameter Log Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Normalized side-by-side progression from 2,600m through active bit depth
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Stations: 25m intervals</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Depth (m)</th>
                <th className="py-2 px-3 text-blue-700">Active ROP (m/h)</th>
                <th className="py-2 px-3 text-slate-700">Offset ROP (m/h)</th>
                <th className="py-2 px-3 text-blue-700">Active Torque (kN.m)</th>
                <th className="py-2 px-3 text-slate-700">Offset Torque (kN.m)</th>
                <th className="py-2 px-3 text-blue-700">Active Mud Wt (SG)</th>
                <th className="py-2 px-3 text-slate-700">Offset Mud Wt (SG)</th>
                <th className="py-2 px-3">Lithological Horizon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTelemetry.map((pt, i) => {
                const offPt = offsetTelemetry[i] || pt;
                const isLossHorizon = pt.depth >= 2840 && pt.depth <= 2865;

                return (
                  <tr key={i} className={`hover:bg-slate-50 ${isLossHorizon ? 'bg-amber-50/40' : ''}`}>
                    <td className="py-1.5 px-3 font-bold text-slate-800">
                      {pt.depth}m
                      {isLossHorizon && <span className="ml-1 text-[10px] text-red-600 font-sans font-bold">⚠️ Hazard</span>}
                    </td>
                    <td className="py-1.5 px-3 text-blue-700 font-semibold">{pt.rop}</td>
                    <td className="py-1.5 px-3 text-slate-600">{offPt.rop}</td>
                    <td className="py-1.5 px-3 text-blue-700 font-semibold">{pt.torque}</td>
                    <td className="py-1.5 px-3 text-slate-600">{offPt.torque}</td>
                    <td className="py-1.5 px-3 text-blue-700 font-semibold">{pt.mudWeightIn}</td>
                    <td className="py-1.5 px-3 text-slate-600">{offPt.mudWeightIn}</td>
                    <td className="py-1.5 px-3 font-sans text-slate-600 text-[11px]">
                      {pt.depth < 2600 ? 'Tipam Sand' : 'Barail Coal-Shale'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
