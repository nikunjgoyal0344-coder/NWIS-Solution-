import React, { useState } from 'react';
import { AIWarning, Well, RiskLevel } from '../../types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  History, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  GitCompare,
  TrendingDown,
  Gauge,
  Sliders,
  DollarSign
} from 'lucide-react';

interface WarningDataCenterViewProps {
  warnings: AIWarning[];
  activeWell: Well;
  onCompareWithOffset: (wellName: string) => void;
  onSelectWell: (well: Well) => void;
}

export const WarningDataCenterView: React.FC<WarningDataCenterViewProps> = ({
  warnings,
  activeWell,
  onCompareWithOffset,
  onSelectWell,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [simulatedBitDepth, setSimulatedBitDepth] = useState<number>(activeWell.currentDepth);

  const criticalCount = warnings.filter(w => w.severity === 'critical').length;
  const highCount = warnings.filter(w => w.severity === 'high').length;
  const mediumCount = warnings.filter(w => w.severity === 'medium').length;
  const lowCount = warnings.filter(w => w.severity === 'low').length;

  const filteredWarnings = warnings.filter(w => {
    if (selectedSeverity === 'all') return true;
    return w.severity === selectedSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-red-50 text-red-600 rounded">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-slate-800">
                Warning Data Center (AI Decision Engine)
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time predictive hazard analytics comparing active well eRTMAC telemetry against historical offset incidents
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200 text-xs">
            <span className="text-slate-500">Active Well:</span>
            <strong className="text-primary font-mono">{activeWell.name}</strong>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-mono font-bold">{simulatedBitDepth}m</span>
          </div>
        </div>
      </div>

      {/* Top Severity Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'critical' ? 'all' : 'critical')}
          className={`p-3.5 rounded-mild border text-left transition-all ${
            selectedSeverity === 'critical'
              ? 'bg-red-50 border-red-400 ring-2 ring-red-400/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-700 uppercase">Critical Alerts</span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{criticalCount}</p>
          <p className="text-[11px] text-slate-400">Immediate look-ahead &lt; 10m</p>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'high' ? 'all' : 'high')}
          className={`p-3.5 rounded-mild border text-left transition-all ${
            selectedSeverity === 'high'
              ? 'bg-orange-50 border-orange-400 ring-2 ring-orange-400/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-700 uppercase">High Risk</span>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{highCount}</p>
          <p className="text-[11px] text-slate-400">Formation boundary hazards</p>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'medium' ? 'all' : 'medium')}
          className={`p-3.5 rounded-mild border text-left transition-all ${
            selectedSeverity === 'medium'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase">Medium Risk</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{mediumCount}</p>
          <p className="text-[11px] text-slate-400">Mechanical &amp; tripping warnings</p>
        </button>

        <button
          onClick={() => setSelectedSeverity(selectedSeverity === 'low' ? 'all' : 'low')}
          className={`p-3.5 rounded-mild border text-left transition-all ${
            selectedSeverity === 'low'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase">Low Risk</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-1">{lowCount}</p>
          <p className="text-[11px] text-slate-400">Normal operating parameters</p>
        </button>
      </div>

      {/* Main Grid: Left Warnings List + Right Simulator/Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Warning Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {filteredWarnings.map((warning) => {
            const isCritical = warning.severity === 'critical';
            const isHigh = warning.severity === 'high';

            return (
              <div
                key={warning.id}
                className={`bg-white rounded-mild border p-5 shadow-card space-y-3 transition-all ${
                  isCritical 
                    ? 'border-l-4 border-l-red-600 border-slate-200' 
                    : isHigh 
                    ? 'border-l-4 border-l-orange-500 border-slate-200' 
                    : 'border-l-4 border-l-amber-500 border-slate-200'
                }`}
              >
                {/* Warning Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isCritical ? 'bg-red-100 text-red-800' : isHigh ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {warning.severity.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-slate-800">{warning.riskType}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded border border-red-200">
                      {warning.probability}% Probability
                    </span>
                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Depth: {warning.depthRange[0]}m – {warning.depthRange[1]}m
                    </span>
                  </div>
                </div>

                {/* Target Formation & Proximity Tag */}
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Geological Target:</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                    {warning.formation}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-primary font-semibold">
                    {Math.max(0, warning.depthRange[0] - simulatedBitDepth)}m ahead of current bit
                  </span>
                </div>

                {/* Similar Incidents in Offset Wells */}
                <div className="bg-slate-50 p-3 rounded-mild border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <History className="w-3.5 h-3.5 text-slate-500" />
                    <span>Historical Offset Evidence &amp; Precedents:</span>
                  </div>
                  <div className="space-y-1.5 pl-5">
                    {warning.similarIncidents.map((inc, i) => (
                      <div key={i} className="text-slate-600">
                        <strong className="text-slate-800">{inc.wellName}</strong> at <span className="font-mono font-medium text-slate-700">{inc.depth} m</span>: {inc.description}
                        <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                          ↳ Past Resolution: {inc.actionTaken}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Explanation */}
                <div className="text-xs text-slate-600 bg-blue-50/40 p-3 rounded border border-blue-100">
                  <div className="flex items-center gap-1.5 font-semibold text-primary mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Geological &amp; Petrophysical Root Cause Analysis:</span>
                  </div>
                  <p className="leading-relaxed">{warning.aiExplanation}</p>
                </div>

                {/* Suggested Action Box */}
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-mild text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Prescribed Operational Action Plan:</span>
                  </div>
                  <pre className="font-sans text-emerald-900 whitespace-pre-line leading-relaxed pl-5">
                    {warning.suggestedAction}
                  </pre>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">Generated {warning.timestamp}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCompareWithOffset(warning.similarIncidents[0]?.wellName || '')}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-primary text-xs font-semibold rounded border border-blue-200 transition-colors flex items-center gap-1"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>Compare with Offset</span>
                    </button>
                    <button
                      onClick={() => alert(`Warning acknowledged and recorded in OISD Merkle audit chain.`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Depth Simulator & Safe Window (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* 1. Live Bit Simulation Controller */}
          <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <Sliders className="w-4 h-4" />
              <span>Bit Depth Look-Ahead Simulator</span>
            </div>
            <p className="text-xs text-slate-500">
              Advance the simulated drill bit to observe look-ahead hazard threshold triggers in real time.
            </p>

            <div className="bg-slate-50 p-3 rounded border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-500 font-medium">Simulated Bit Depth:</span>
                <span className="font-bold text-primary font-mono text-sm">{simulatedBitDepth} m</span>
              </div>
              <input
                type="range"
                min="2820"
                max="2870"
                step="2"
                value={simulatedBitDepth}
                onChange={(e) => setSimulatedBitDepth(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>2,820m (Safe)</span>
                <span className="text-red-600 font-bold">2,845m (Loss Zone)</span>
                <span>2,870m</span>
              </div>
            </div>

            {/* Simulation Status Tag */}
            <div className={`p-2.5 rounded border text-xs ${
              simulatedBitDepth >= 2840 && simulatedBitDepth <= 2860
                ? 'bg-red-50 border-red-200 text-red-700 font-bold'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium'
            }`}>
              {simulatedBitDepth >= 2840 && simulatedBitDepth <= 2860 ? (
                <span>⚠️ IN HAZARD ZONE: High risk of lost circulation at current depth!</span>
              ) : (
                <span>✓ NORMAL DRILLING: Bit is outside critical hazard interval.</span>
              )}
            </div>
          </div>

          {/* 2. Pore Pressure vs. Mud Weight Safe Window */}
          <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider">
              <Gauge className="w-4 h-4 text-primary" />
              <span>Safe Operational Mud Window</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Pore Pressure Gradient:</span>
                <span className="font-mono font-semibold text-slate-800">1.02 SG</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Fracture Gradient:</span>
                <span className="font-mono font-semibold text-slate-800">1.26 SG</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Current Mud Weight (In):</span>
                <span className="font-mono font-semibold text-emerald-700">1.18 SG</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Dynamic ECD:</span>
                <span className="font-mono font-semibold text-amber-700">1.22 SG (Near Frac)</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded">
              Maintain active ECD below 1.20 SG when entering Barail coal seam at 2,845m to prevent hydraulic fracturing.
            </p>
          </div>

          {/* 3. NPT Financial Impact Avoidance */}
          <div className="bg-emerald-50/70 p-5 rounded-mild border border-emerald-200 shadow-card space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>Cost Avoidance Value</span>
            </div>
            <p className="text-2xl font-bold text-emerald-800 font-mono">
              ₹70.5 Lakhs
            </p>
            <p className="text-xs text-emerald-700 leading-snug">
              Estimated operational savings by proactively mitigating mud loss and secondary gas kick based on NHK-124 &amp; NHK-109 lessons learned.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
