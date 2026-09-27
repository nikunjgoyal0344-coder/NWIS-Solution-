import React, { useState } from 'react';
import { AIWarning } from '../../types';
import { AlertTriangle, MoreHorizontal, ArrowRight, CheckCircle2, History } from 'lucide-react';

interface ActiveWarningsPreviewProps {
  warnings: AIWarning[];
  onOpenWarningCenter: () => void;
  onSelectWarning: (warning: AIWarning) => void;
}

export const ActiveWarningsPreview: React.FC<ActiveWarningsPreviewProps> = ({
  warnings,
  onOpenWarningCenter,
  onSelectWarning,
}) => {
  const primaryWarning = warnings[0];
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="bg-white rounded-mild border border-slate-200 shadow-card p-5 flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-slate-800">
          AI Warning Data Center
        </h3>
        <button 
          onClick={onOpenWarningCenter}
          className="text-slate-400 hover:text-slate-600 p-1 rounded"
          title="Open Full Warning Center"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Red Alert Banner matching mockup */}
      <div className="p-3 bg-red-50/80 border border-red-200 rounded-mild flex items-center gap-2 text-red-800 text-xs font-bold shadow-xs">
        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 animate-pulse" />
        <span>WARNING: Formation Anomaly Detected!</span>
      </div>

      {/* Hazard Title & Status */}
      <div className="space-y-1.5">
        <h4 className="text-base font-bold text-slate-800 leading-snug">
          Potential KICK &amp; Lost Circulation Risk (Formation Gas Flow)
        </h4>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Current Status:</span>
          <span className="font-bold text-risk-high">Risk: High Hazard / Red (88% Confidence)</span>
        </div>
        <p className="text-[11px] text-slate-500 font-mono">
          Depth Horizon: 2,840m – 2,865m (Barail Coal Seam #4)
        </p>
      </div>

      {/* Numbered Operational Recommendations */}
      <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-mild border border-slate-200/80">
        <span className="font-bold text-slate-800 block text-xs">
          Recommended Operational Actions:
        </span>
        <ol className="space-y-1.5 text-slate-700 pl-4 list-decimal text-xs font-medium">
          <li>Check Casing Pressure &amp; Line Up Choke Manifold</li>
          <li>Verify Mud Density (Maintain 1.18 – 1.20 SG Equivalent)</li>
          <li>Reduce ROP (Limit to 6 – 8 m/hr Across Seam)</li>
        </ol>
      </div>

      {/* Dual Buttons matching mockup */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => {
            setAcknowledged(true);
            alert('Risk acknowledged and logged to OISD audit chain.');
          }}
          className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded border border-slate-300 transition-colors shadow-xs"
        >
          {acknowledged ? '✓ Acknowledged & Monitored' : 'Acknowledge & Monitor'}
        </button>

        <button
          onClick={onOpenWarningCenter}
          className="w-full py-2 px-3 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded shadow-xs transition-colors"
        >
          Proceed with Actions &rarr;
        </button>
      </div>
    </div>
  );
};
