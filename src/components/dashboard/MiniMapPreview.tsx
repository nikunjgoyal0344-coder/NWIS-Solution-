import React from 'react';
import { Well } from '../../types';
import { Maximize2, Compass } from 'lucide-react';
import { IsometricSubsurfaceBlock } from '../visualization/IsometricSubsurfaceBlock';

interface MiniMapPreviewProps {
  wells: Well[];
  activeWell: Well;
  onLaunchFullMap: () => void;
  onSelectWell: (well: Well) => void;
}

export const MiniMapPreview: React.FC<MiniMapPreviewProps> = ({
  wells,
  activeWell,
  onLaunchFullMap,
  onSelectWell,
}) => {
  return (
    <div className="bg-white rounded-mild border border-slate-200 shadow-card p-5 flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-800">
            Subsurface Visualization
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">(Isometric Cutaway)</span>
        </div>
        <button
          onClick={onLaunchFullMap}
          className="text-xs font-semibold text-primary hover:text-primary-light flex items-center gap-1 transition-colors"
        >
          <span>Full 3D Map</span>
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Isometric 3D Subsurface Cutaway Block */}
      <div className="flex-1 flex items-center justify-center">
        <IsometricSubsurfaceBlock onLaunchFullMap={onLaunchFullMap} />
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <span>Active Bit: <strong className="text-slate-800 font-mono">{activeWell.currentDepth} m MD</strong></span>
        <span className="text-primary font-semibold font-mono">10 km Monitoring Radius</span>
      </div>
    </div>
  );
};
