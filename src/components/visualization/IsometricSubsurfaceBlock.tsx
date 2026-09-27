import React, { useState } from 'react';

interface IsometricSubsurfaceBlockProps {
  onLaunchFullMap?: () => void;
}

export const IsometricSubsurfaceBlock: React.FC<IsometricSubsurfaceBlockProps> = ({ onLaunchFullMap }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [unitMode, setUnitMode] = useState<'ft' | 'm'>('ft');

  // Depth markers based on unit mode
  const depths = unitMode === 'ft' 
    ? ['0', '5,000', '10,000', '15,000', '20,000', '25,000']
    : ['0m', '800m', '1,850m', '2,600m', '3,150m', '3,650m'];

  const nodeLabels = unitMode === 'ft'
    ? { n1: '9,850 ft', n2: '3,360 ft', n3: '3,400 ft', n4: '1,800 ft', off1: '4,350 ft' }
    : { n1: '850 m', n2: '1,850 m', n3: '2,600 m', n4: '2,835 m', off1: '2,845 m' };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Top Unit Switcher */}
      <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
        <span className="font-semibold text-slate-700">Subsurface Visualization</span>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px] font-mono">
          <button
            onClick={() => setUnitMode('ft')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors ${
              unitMode === 'ft' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Feet (ft)
          </button>
          <button
            onClick={() => setUnitMode('m')}
            className={`px-2 py-0.5 rounded font-semibold transition-colors ${
              unitMode === 'm' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Meters (m)
          </button>
        </div>
      </div>

      {/* Main Isometric SVG Graphic */}
      <div 
        onClick={onLaunchFullMap}
        className="w-full relative cursor-pointer group"
      >
        <svg 
          viewBox="0 0 460 430" 
          className="w-full h-auto max-h-[380px] drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.01]"
        >
          <defs>
            {/* Strata Gradients */}
            <linearGradient id="topSurfaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            <linearGradient id="strata1Left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>

            <linearGradient id="strata2Left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>

            <linearGradient id="strata3Left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            <linearGradient id="strata4Left" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            <linearGradient id="rightFaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Drop Shadow Filter */}
            <filter id="blockShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodOpacity="0.08" />
            </filter>
          </defs>

          {/* Depth Scale Grid on Left */}
          <g className="text-[10px] font-mono fill-slate-400 font-medium">
            <text x="65" y="112" textAnchor="end">{depths[0]}</text>
            <text x="65" y="162" textAnchor="end">{depths[1]}</text>
            <text x="65" y="215" textAnchor="end">{depths[2]}</text>
            <text x="65" y="270" textAnchor="end">{depths[3]}</text>
            <text x="65" y="325" textAnchor="end">{depths[4]}</text>
            <text x="65" y="375" textAnchor="end">{depths[5]}</text>
            
            {/* Thin scale ticks */}
            <line x1="70" y1="108" x2="76" y2="108" stroke="#94A3B8" strokeWidth="1" />
            <line x1="70" y1="158" x2="76" y2="158" stroke="#94A3B8" strokeWidth="1" />
            <line x1="70" y1="211" x2="76" y2="211" stroke="#94A3B8" strokeWidth="1" />
            <line x1="70" y1="266" x2="76" y2="266" stroke="#94A3B8" strokeWidth="1" />
            <line x1="70" y1="321" x2="76" y2="321" stroke="#94A3B8" strokeWidth="1" />
            <line x1="70" y1="371" x2="76" y2="371" stroke="#94A3B8" strokeWidth="1" />
          </g>

          {/* Right Label "Depth" */}
          <text x="395" y="85" className="text-[11px] font-bold fill-slate-600 font-sans">
            Depth
          </text>

          {/* --- 1. ISOMETRIC 3D BLOCK GEOMETRY --- */}
          <g filter="url(#blockShadow)">
            
            {/* Top Surface Plane (Ground level) */}
            <polygon 
              points="230,45 375,108 230,172 85,108" 
              fill="url(#topSurfaceGrad)" 
              stroke="#CBD5E1" 
              strokeWidth="1.2"
            />

            {/* Left Face - Layer 1 (Surface / Light Strata) */}
            <path 
              d="M 85,108 L 230,172 L 230,225 Q 160,200 85,148 Z" 
              fill="#F1F5F9" 
              stroke="#CBD5E1" 
              strokeWidth="0.8" 
            />

            {/* Left Face - Layer 2 (Medium Gray Strata) */}
            <path 
              d="M 85,148 Q 160,200 230,225 L 230,270 Q 155,240 85,195 Z" 
              fill="#94A3B8" 
              stroke="#64748B" 
              strokeWidth="0.8" 
            />

            {/* Left Face - Layer 3 (Light Slate Strata) */}
            <path 
              d="M 85,195 Q 155,240 230,270 L 230,320 Q 150,290 85,245 Z" 
              fill="#E2E8F0" 
              stroke="#CBD5E1" 
              strokeWidth="0.8" 
            />

            {/* Left Face - Layer 4 (Darker Coal-Shale Strata) */}
            <path 
              d="M 85,245 Q 150,290 230,320 L 230,370 Q 160,335 85,295 Z" 
              fill="#64748B" 
              stroke="#475569" 
              strokeWidth="0.8" 
            />

            {/* Left Face - Layer 5 (Bottom Subsurface) */}
            <path 
              d="M 85,295 Q 160,335 230,370 L 230,405 L 85,340 Z" 
              fill="#475569" 
              stroke="#334155" 
              strokeWidth="0.8" 
            />

            {/* Right Face - Layer 1 (Surface Layer) */}
            <path 
              d="M 230,172 L 375,108 L 375,150 Q 300,185 230,225 Z" 
              fill="#E2E8F0" 
              stroke="#CBD5E1" 
              strokeWidth="0.8" 
            />

            {/* Right Face - Layer 2 (Medium Gray Strata) */}
            <path 
              d="M 230,225 Q 300,185 375,150 L 375,195 Q 300,230 230,270 Z" 
              fill="#64748B" 
              stroke="#475569" 
              strokeWidth="0.8" 
            />

            {/* Right Face - Layer 3 (Light Slate Strata) */}
            <path 
              d="M 230,270 Q 300,230 375,195 L 375,245 Q 305,280 230,320 Z" 
              fill="#CBD5E1" 
              stroke="#94A3B8" 
              strokeWidth="0.8" 
            />

            {/* Right Face - Layer 4 (Dark Coal Layer) */}
            <path 
              d="M 230,320 Q 305,280 375,245 L 375,295 Q 305,335 230,370 Z" 
              fill="#475569" 
              stroke="#334155" 
              strokeWidth="0.8" 
            />

            {/* Right Face - Layer 5 (Bottom Face) */}
            <path 
              d="M 230,370 Q 305,335 375,295 L 375,340 L 230,405 Z" 
              fill="#334155" 
              stroke="#1E293B" 
              strokeWidth="0.8" 
            />

            {/* Block Corner Outline */}
            <line x1="230" y1="172" x2="230" y2="405" stroke="#CBD5E1" strokeWidth="1.2" />
          </g>

          {/* --- 2. SURFACE DERRICKS & LABELS --- */}
          {/* Active Well Derrick (Left) */}
          <g transform="translate(155, 82)">
            {/* Small derrick frame */}
            <polygon points="6,0 0,18 12,18" fill="none" stroke="#1E3A5F" strokeWidth="1.5" />
            <line x1="3" y1="9" x2="9" y2="9" stroke="#1E3A5F" strokeWidth="1" />
            <line x1="6" y1="0" x2="6" y2="18" stroke="#1E3A5F" strokeWidth="1" />
            <text x="6" y="-6" textAnchor="middle" className="text-[10px] font-bold fill-slate-800 font-sans">
              Active Well
            </text>
          </g>

          {/* Offset Well 1 (Middle Back - Dashed) */}
          <g transform="translate(225, 48)">
            <polygon points="6,0 0,18 12,18" fill="none" stroke="#64748B" strokeWidth="1.2" />
            <line x1="3" y1="9" x2="9" y2="9" stroke="#64748B" strokeWidth="1" />
            <text x="6" y="-6" textAnchor="middle" className="text-[9px] font-semibold fill-slate-600 font-sans">
              Offset Well
            </text>
          </g>

          {/* Offset Well 2 (Right - Vertical) */}
          <g transform="translate(285, 70)">
            <polygon points="6,0 0,18 12,18" fill="none" stroke="#64748B" strokeWidth="1.2" />
            <line x1="3" y1="9" x2="9" y2="9" stroke="#64748B" strokeWidth="1" />
            <text x="6" y="-6" textAnchor="middle" className="text-[9px] font-semibold fill-slate-600 font-sans">
              Offset Well
            </text>
          </g>

          {/* --- 3. WELLBORE TRAJECTORY PATHS --- */}
          
          {/* A. Offset Well 2 (Right Straight Vertical Line) */}
          <line 
            x1="291" y1="88" 
            x2="291" y2="305" 
            stroke="#64748B" 
            strokeWidth="1.5" 
            opacity="0.85"
          />

          {/* B. Offset Well 1 (Middle Dashed S-Curve) */}
          <path 
            d="M 231,66 C 231,160 260,200 291,250" 
            fill="none" 
            stroke="#64748B" 
            strokeWidth="1.5" 
            strokeDasharray="4 3" 
            opacity="0.85"
          />
          {/* Offset 1 Depth Marker */}
          <circle cx="291" cy="250" r="3.5" fill="#64748B" stroke="#FFFFFF" strokeWidth="1.2" />
          <text x="285" y="254" textAnchor="end" className="text-[10px] font-bold font-mono fill-slate-700">
            {nodeLabels.off1}
          </text>

          {/* C. ACTIVE WELL (Solid Deep Blue S-Curve Trajectory) */}
          <path 
            d="M 161,100 L 161,170 C 161,220 185,250 230,295 C 265,330 280,345 291,345" 
            fill="none" 
            stroke="#1E3A5F" 
            strokeWidth="2.4" 
            strokeLinecap="round"
          />

          {/* Active Well Projected Silhouette Line */}
          <path 
            d="M 161,100 L 161,170 C 161,215 168,235 178,255" 
            fill="none" 
            stroke="#94A3B8" 
            strokeWidth="1" 
            strokeDasharray="2 2"
            opacity="0.6"
          />

          {/* Active Well Callout Nodes */}
          {/* Node 1 */}
          <g className="cursor-pointer" onMouseEnter={() => setHoveredNode('n1')} onMouseLeave={() => setHoveredNode(null)}>
            <circle cx="161" cy="170" r="3.5" fill="#1E3A5F" stroke="#FFFFFF" strokeWidth="1.2" />
            <text x="153" y="174" textAnchor="end" className="text-[10px] font-bold font-mono fill-slate-800">
              {nodeLabels.n1}
            </text>
          </g>

          {/* Node 2 */}
          <g className="cursor-pointer" onMouseEnter={() => setHoveredNode('n2')} onMouseLeave={() => setHoveredNode(null)}>
            <circle cx="161" cy="220" r="3.5" fill="#1E3A5F" stroke="#FFFFFF" strokeWidth="1.2" />
            <text x="153" y="224" textAnchor="end" className="text-[10px] font-bold font-mono fill-slate-800">
              {nodeLabels.n2}
            </text>
          </g>

          {/* Node 3 */}
          <g className="cursor-pointer" onMouseEnter={() => setHoveredNode('n3')} onMouseLeave={() => setHoveredNode(null)}>
            <circle cx="185" cy="254" r="4" fill="#1E3A5F" stroke="#FFFFFF" strokeWidth="1.2" />
            <text x="177" y="258" textAnchor="end" className="text-[10px] font-bold font-mono fill-slate-800">
              {nodeLabels.n3}
            </text>
          </g>

          {/* Node 4 (Active Bit Terminal Marker) */}
          <g className="cursor-pointer" onMouseEnter={() => setHoveredNode('n4')} onMouseLeave={() => setHoveredNode(null)}>
            <circle cx="291" cy="345" r="4.5" fill="#16A34A" stroke="#FFFFFF" strokeWidth="1.5" className="animate-pulse" />
            <text x="283" y="352" textAnchor="end" className="text-[10px] font-bold font-mono fill-emerald-800">
              {nodeLabels.n4}
            </text>
          </g>
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredNode && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded border border-slate-200 shadow-md text-[10px] font-medium text-slate-700 pointer-events-none">
            {hoveredNode === 'n1' && <span>Surface Conductor Shoe (850m)</span>}
            {hoveredNode === 'n2' && <span>Tipam Sandstone Entry (1,850m)</span>}
            {hoveredNode === 'n3' && <span>Barail Coal Top Kickoff (2,600m)</span>}
            {hoveredNode === 'n4' && <span className="text-emerald-700 font-bold">Active Drill Bit (2,835m MD) • Pre-Loss Zone</span>}
          </div>
        )}
      </div>

      {/* Caption & Status */}
      <div className="w-full flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 mt-2">
        <span className="font-mono">Barail Formation Strata Block</span>
        <button 
          onClick={onLaunchFullMap}
          className="text-primary font-semibold hover:underline"
        >
          Expand 3D WebGL &rarr;
        </button>
      </div>
    </div>
  );
};
