import React, { useState } from 'react';
import { Well, DrillingIncident, Formation } from '../../types';
import { FORMATIONS, DRILLING_INCIDENTS } from '../../data/mockData';
import { Flag, ShieldAlert, CheckCircle, ChevronDown, Wrench, Layers } from 'lucide-react';

interface TimelineBarProps {
  well: Well;
}

interface MilestoneNode {
  id: string;
  type: 'spud' | 'casing' | 'formation' | 'incident' | 'completion' | 'bit';
  label: string;
  depth: number;
  date?: string;
  details: string;
  color: string;
}

export const TimelineBar: React.FC<TimelineBarProps> = ({ well }) => {
  const isPresent = well.type === 'present';
  const wellIncidents = DRILLING_INCIDENTS.filter(inc => inc.wellId === well.id);

  // Construct milestones along depth axis
  const milestones: MilestoneNode[] = [
    {
      id: 'spud',
      type: 'spud' as const,
      label: 'Spud In',
      depth: 0,
      date: well.spudDate,
      details: `Rig spudded at surface. Conductor pipe set at 120m.`,
      color: '#1E3A5F'
    },
    ...well.casingProgram.map((c, idx) => ({
      id: `csg-${idx}`,
      type: 'casing' as const,
      label: `${c.size} Casing Shoe`,
      depth: c.shoeDepth,
      details: `${c.casingType} casing cemented at ${c.shoeDepth}m. Cement top: ${c.cementTop}m. Status: ${c.status}.`,
      color: '#475569'
    })),
    ...FORMATIONS.slice(2, 5).map((f) => ({
      id: `form-${f.id}`,
      type: 'formation' as const,
      label: `${f.name} Top`,
      depth: f.topDepth,
      details: `Stratigraphic boundary transition at ${f.topDepth}m. Lithology: ${f.lithology}.`,
      color: '#D97706'
    })),
    ...wellIncidents.map(inc => ({
      id: `inc-${inc.id}`,
      type: 'incident' as const,
      label: inc.title.split(' ')[0] + ' ' + inc.title.split(' ')[1],
      depth: inc.depth,
      date: inc.date,
      details: `Depth ${inc.depth}m: ${inc.description} | NPT Lost: ${inc.durationHours} hrs.`,
      color: '#DC2626'
    })),
    ...(isPresent ? [{
      id: 'bit-pos',
      type: 'bit' as const,
      label: 'Active Bit Head',
      depth: well.currentDepth,
      details: `Live bit currently drilling at ${well.currentDepth}m. Approaching Barail loss zone.`,
      color: '#16A34A'
    }] : [{
      id: 'completion',
      type: 'completion' as const,
      label: 'Total Depth (TD)',
      depth: well.totalDepth,
      date: well.completionDate,
      details: `Reached target total depth at ${well.totalDepth}m. Well completed and secured.`,
      color: '#16A34A'
    }])
  ].sort((a, b) => a.depth - b.depth);

  const [selectedMilestone, setSelectedMilestone] = useState<MilestoneNode>(milestones[0]);

  return (
    <div className="bg-slate-50 p-4 rounded-mild border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Life-of-Well Timeline &amp; Depth Milestones
        </span>
        <span className="text-xs text-slate-500 font-mono">
          Depth Span: 0m – {well.totalDepth.toLocaleString()}m
        </span>
      </div>

      {/* Horizontal Bar Track */}
      <div className="relative py-8 my-2">
        {/* Baseline Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-300 -translate-y-1/2 rounded" />

        {/* Milestone Pin Nodes */}
        <div className="relative flex justify-between items-center">
          {milestones.map((m) => {
            const isSelected = selectedMilestone.id === m.id;
            const isBit = m.type === 'bit';
            const isIncident = m.type === 'incident';

            return (
              <div 
                key={m.id}
                onClick={() => setSelectedMilestone(m)}
                className="flex flex-col items-center cursor-pointer group relative -my-4"
              >
                {/* Node Marker */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'ring-4 ring-primary/20 scale-125 z-10'
                      : 'hover:scale-110'
                  } ${
                    isBit 
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 animate-pulse'
                      : isIncident
                      ? 'bg-red-600 text-white'
                      : 'bg-white border-2 border-slate-400 text-slate-700'
                  }`}
                  style={{ borderColor: isSelected ? '#1E3A5F' : undefined }}
                >
                  <span className="text-[10px] font-bold">
                    {m.type === 'incident' ? '!' : m.type === 'bit' ? '▶' : m.depth === 0 ? '0' : '•'}
                  </span>
                </div>

                {/* Node Label Below */}
                <span className="text-[10px] font-medium text-slate-600 mt-2 max-w-[70px] text-center truncate">
                  {m.label}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {m.depth}m
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Detail Box */}
      {selectedMilestone && (
        <div className="bg-white p-3 rounded border border-slate-200 shadow-xs flex items-start gap-3 mt-2">
          <div className="p-2 rounded bg-slate-100 text-primary mt-0.5">
            {selectedMilestone.type === 'incident' ? (
              <ShieldAlert className="w-4 h-4 text-red-600" />
            ) : selectedMilestone.type === 'casing' ? (
              <Wrench className="w-4 h-4 text-slate-600" />
            ) : (
              <Layers className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800">
                {selectedMilestone.label} (Depth: {selectedMilestone.depth}m)
              </h4>
              {selectedMilestone.date && (
                <span className="text-[11px] text-slate-500 font-mono">
                  Date: {selectedMilestone.date}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {selectedMilestone.details}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
