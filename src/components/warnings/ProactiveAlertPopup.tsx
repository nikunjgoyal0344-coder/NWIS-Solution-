import React from 'react';
import { AIWarning } from '../../types';
import { AlertTriangle, ArrowRight, X, ShieldAlert, GitCompare } from 'lucide-react';

interface ProactiveAlertPopupProps {
  warning: AIWarning;
  onDismiss: () => void;
  onViewWarningCenter: () => void;
  onCompareWithOffset: (offsetWellName: string) => void;
}

export const ProactiveAlertPopup: React.FC<ProactiveAlertPopupProps> = ({
  warning,
  onDismiss,
  onViewWarningCenter,
  onCompareWithOffset,
}) => {
  const isCritical = warning.severity === 'critical';

  return (
    <div className="fixed top-20 right-6 z-40 max-w-md w-full animate-in slide-in-from-top-4 duration-200">
      <div className={`bg-white rounded-mild border-2 shadow-modal p-4 ${
        isCritical ? 'border-red-600 bg-red-50/10' : 'border-amber-500 bg-amber-50/10'
      }`}>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded ${isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isCritical ? 'text-red-700' : 'text-amber-700'}`}>
                PROACTIVE LOOK-AHEAD WARNING (5m AHEAD)
              </span>
              <h3 className="text-sm font-bold text-slate-800 leading-tight">
                {warning.riskType}
              </h3>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-slate-700 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Body */}
        <div className="text-xs text-slate-600 space-y-2 mt-2">
          <div className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200 font-mono">
            <span>Target Depth: <strong>{warning.depthRange[0]}m – {warning.depthRange[1]}m</strong></span>
            <span className="font-bold text-red-600">Risk: {warning.probability}%</span>
          </div>

          <p className="text-xs text-slate-700 leading-snug">
            <strong>Offset Precedent:</strong> {warning.similarIncidents[0]?.wellName} encountered severe mud loss at {warning.similarIncidents[0]?.depth}m.
          </p>

          <p className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-100 italic">
            "{warning.suggestedAction.split('\n')[0]}"
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200">
          <button
            onClick={() => onCompareWithOffset(warning.similarIncidents[0]?.wellName || '')}
            className="text-xs font-semibold text-primary hover:text-primary-light flex items-center gap-1"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Offset</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onDismiss}
              className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded border border-slate-200"
            >
              Acknowledge
            </button>
            <button
              onClick={onViewWarningCenter}
              className="px-3 py-1 text-xs font-semibold bg-primary hover:bg-primary-hover text-white rounded shadow-xs"
            >
              View Full Warning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
