import React, { useState, useMemo, useEffect } from 'react';
import { Well, Formation, DrillingIncident, CrewMember, WellDocument } from '../../types';
import { 
  Search, 
  X, 
  MapPin, 
  AlertTriangle, 
  Layers, 
  Users, 
  FileText, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  wells: Well[];
  formations: Formation[];
  incidents: DrillingIncident[];
  crew: CrewMember[];
  documents: WellDocument[];
  onSelectWell: (well: Well) => void;
  onNavigateToTab: (tab: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  wells,
  formations,
  incidents,
  crew,
  documents,
  onSelectWell,
  onNavigateToTab,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const matchedWells = wells.filter(w => 
      w.name.toLowerCase().includes(q) || 
      w.field.toLowerCase().includes(q) ||
      w.targetFormation.toLowerCase().includes(q)
    );

    const matchedIncidents = incidents.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.type.toLowerCase().includes(q)
    );

    const matchedFormations = formations.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.lithology.toLowerCase().includes(q)
    );

    const matchedCrew = crew.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.notableAchievement.toLowerCase().includes(q)
    );

    const matchedDocs = documents.filter(d =>
      d.title.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q)
    );

    return {
      wells: matchedWells,
      incidents: matchedIncidents,
      formations: matchedFormations,
      crew: matchedCrew,
      documents: matchedDocs,
    };
  }, [query, wells, formations, incidents, crew, documents]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white w-full max-w-2xl rounded-mild border border-slate-200 shadow-modal overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search across all historical wells, formations, incidents, crew, and dossiers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-500 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {!results && (
            <div className="text-center py-10 text-slate-400 space-y-1">
              <p className="font-semibold text-slate-600">Quick Petroleum Suggestions:</p>
              <p>Try searching: <strong>"Barail"</strong>, <strong>"Mud Loss"</strong>, <strong>"Gas Kick"</strong>, <strong>"Gogoi"</strong>, or <strong>"NHK-124"</strong></p>
            </div>
          )}

          {results && (
            <>
              {/* 1. Wells */}
              {results.wells.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                    Wells &amp; Drill Sites ({results.wells.length})
                  </span>
                  <div className="space-y-1">
                    {results.wells.map(w => (
                      <div
                        key={w.id}
                        onClick={() => {
                          onSelectWell(w);
                          onClose();
                        }}
                        className="p-2 rounded hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span className="font-bold text-slate-800">{w.name}</span>
                          <span className="text-slate-500">({w.field} • {w.targetFormation})</span>
                        </div>
                        <span className="text-slate-400 text-[10px] font-mono">{w.currentDepth}m / {w.totalDepth}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Incidents */}
              {results.incidents.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                    Operational NPT Incidents ({results.incidents.length})
                  </span>
                  <div className="space-y-1">
                    {results.incidents.map(inc => (
                      <div
                        key={inc.id}
                        onClick={() => {
                          const parentWell = wells.find(w => w.id === inc.wellId);
                          if (parentWell) onSelectWell(parentWell);
                          onClose();
                        }}
                        className="p-2 rounded hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                          <span className="font-semibold text-slate-800">{inc.title}</span>
                          <span className="text-slate-500">({inc.wellName} at {inc.depth}m)</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                          {inc.type.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Formations */}
              {results.formations.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                    Stratigraphic Horizons ({results.formations.length})
                  </span>
                  <div className="space-y-1">
                    {results.formations.map(f => (
                      <div
                        key={f.id}
                        onClick={() => {
                          onNavigateToTab('map');
                          onClose();
                        }}
                        className="p-2 rounded hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-amber-600" />
                          <span className="font-bold text-slate-800">{f.name}</span>
                          <span className="text-slate-500">({f.lithology})</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[10px]">{f.topDepth}m – {f.bottomDepth}m</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Crew */}
              {results.crew.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                    Personnel &amp; Crew Experts ({results.crew.length})
                  </span>
                  <div className="space-y-1">
                    {results.crew.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onNavigateToTab('crew');
                          onClose();
                        }}
                        className="p-2 rounded hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-primary" />
                          <span className="font-bold text-slate-800">{c.name}</span>
                          <span className="text-slate-500">({c.role} • {c.field})</span>
                        </div>
                        <span className="text-emerald-700 font-semibold">{c.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. Documents */}
              {results.documents.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                    WCR &amp; DDR Dossiers ({results.documents.length})
                  </span>
                  <div className="space-y-1">
                    {results.documents.map(d => (
                      <div
                        key={d.id}
                        onClick={() => {
                          alert(`Accessing encrypted dossier: ${d.title}`);
                          onClose();
                        }}
                        className="p-2 rounded hover:bg-slate-50 border border-slate-100 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold text-slate-800">{d.title}</span>
                        </div>
                        <span className="text-slate-400 text-[10px] font-mono">{d.fileSizeBytes}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {results.wells.length === 0 && results.incidents.length === 0 && results.formations.length === 0 && results.crew.length === 0 && results.documents.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No records matched "{query}".
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
