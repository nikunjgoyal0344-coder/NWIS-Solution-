import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Copy, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  MapPin, 
  User, 
  ChevronRight,
  Download
} from 'lucide-react';

interface LessonItem {
  id: string;
  title: string;
  category: 'mud_loss' | 'kick' | 'stuck_pipe' | 'cementing' | 'torque';
  formation: string;
  depth: number;
  originWell: string;
  field: string;
  supervisor: string;
  date: string;
  challengeSummary: string;
  rootCause: string;
  mitigationRecipe: string;
  nptHoursAvoided: number;
  costSavingsLakhs: number;
}

export const LessonsLearnedView: React.FC<{ onSelectWellName: (name: string) => void }> = ({ onSelectWellName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormation, setSelectedFormation] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const lessons: LessonItem[] = [
    {
      id: 'les-01',
      title: 'Curing Catastrophic Mud Loss in Fractured Barail Coal Seams',
      category: 'mud_loss',
      formation: 'Barail Coal-Shale Sequence',
      depth: 2845,
      originWell: 'Well NHK-124',
      field: 'Nahorkatiya Block-3',
      supervisor: 'Er. B. K. Gogoi (Company Man)',
      date: 'May 2023',
      challengeSummary: 'Total lost circulation of 22 bbl/hr upon entering naturally fractured Barail coal seam with sub-hydrostatic reservoir pressure.',
      rootCause: 'Dynamic ECD surging above 1.22 SG induced hydraulic fracture opening in depleted coal cleats.',
      mitigationRecipe: '1. Prepare 40 bbl high-viscosity pill with 30 ppb dual-grade coarse Nut-Plug + 10 ppb mica flakes.\n2. Spot across loss zone at 2,845m and allow 4 hours squeeze/soak.\n3. Cut mud weight in active pit from 1.21 SG to 1.16 SG.\n4. Reduce flow rate to 380 GPM during subsequent drilling.',
      nptHoursAvoided: 36,
      costSavingsLakhs: 28.5
    },
    {
      id: 'les-02',
      title: 'Controlling High-Pressure Gas Influx Following Hydrostatic Head Loss',
      category: 'kick',
      formation: 'Barail Coal-Shale Sequence',
      depth: 2852,
      originWell: 'Well NHK-109',
      field: 'Nahorkatiya South',
      supervisor: 'Er. Ranjan K. Saikia (Mud Eng)',
      date: 'Oct 2022',
      challengeSummary: 'Gas kick (14 bbl pit gain, SIDPP 380 psi) occurred immediately after partial mud loss lowered the hydrostatic fluid column.',
      rootCause: 'Underbalanced condition triggered methane desorption from coal matrix into wellbore.',
      mitigationRecipe: '1. Shut in well on annular preventer immediately.\n2. Execute Wait and Weight kill method with 1.22 SG barite-weighted KCL-PHPA mud.\n3. Maintain constant bottomhole pressure using remote choke.\n4. Degas active pits before resuming circulation.',
      nptHoursAvoided: 48,
      costSavingsLakhs: 42.0
    },
    {
      id: 'les-03',
      title: 'Freeing Mechanically Stuck Drillstring in Reactive Kopili Shale',
      category: 'stuck_pipe',
      formation: 'Kopili Formation',
      depth: 3180,
      originWell: 'Well MOR-18',
      field: 'Moran Field',
      supervisor: 'Er. Tsering Dorjee (Drilling Supt)',
      date: 'Jan 2022',
      challengeSummary: 'Drillstring stuck with 80 klbs overpull and zero rotation during wiper trip through sloughing brittle shale.',
      rootCause: 'Chemical hydration and mechanical shearing of smectitic shale due to inadequate KCl concentration (<4%).',
      mitigationRecipe: '1. Spot 50 bbl lubricating oil-based pipe-freeing pill with surfactant.\n2. Apply maximum allowable downward jar impact (120 klbs).\n3. Recondition mud to 7.0% wt KCl and 1.5 ppb PHPA polymer.\n4. Perform short wiper trips every 90m drilled in Kopili.',
      nptHoursAvoided: 54,
      costSavingsLakhs: 48.2
    },
    {
      id: 'les-04',
      title: 'Preventing Micro-Annular Gas Channels in Intermediate Casing Cement',
      category: 'cementing',
      formation: 'Tipam Sandstone Formation',
      depth: 2450,
      originWell: 'Well DUL-07',
      field: 'Duliajan HQ',
      supervisor: 'Er. Debojit Borah',
      date: 'Feb 2024',
      challengeSummary: 'CBL-VDL acoustic bond log showed gas migration and micro-annular channeling behind 9-5/8" casing across Tipam sand.',
      rootCause: 'Slurry fluid loss into high-permeability thief sand caused cement fallback and dehydration prior to initial set.',
      mitigationRecipe: '1. Utilize thixotropic lead slurry with gas-tight polymer fluid loss additive (<25 ml/30min API).\n2. Pump 30 bbl reactive chemical flush ahead of slurry.\n3. Install centralizers at 1 per joint through Tipam sands to ensure 85%+ standoff.',
      nptHoursAvoided: 24,
      costSavingsLakhs: 18.0
    }
  ];

  const filteredLessons = useMemo(() => {
    return lessons.filter(item => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.challengeSummary.toLowerCase().includes(q);
        const matchRecipe = item.mitigationRecipe.toLowerCase().includes(q);
        const matchWell = item.originWell.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchRecipe && !matchWell) return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedFormation !== 'all' && item.formation !== selectedFormation) return false;
      return true;
    });
  }, [lessons, searchQuery, selectedCategory, selectedFormation]);

  const handleCopyRecipe = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 text-amber-700 rounded">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Institutional Knowledge &amp; Lessons Learned Repository
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Searchable knowledge base of operational challenges, geomechanical root causes, and field-proven mitigation SOPs across OIL drilling campaigns
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-mild border border-slate-200 shadow-card grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mitigations (e.g. 'Nut-Plug', 'Gas Kick', 'Kopili', 'NHK-124')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-mild focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-mild text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Operational Hazards</option>
            <option value="mud_loss">Lost Circulation / Mud Loss</option>
            <option value="kick">Gas Kick &amp; Well Control</option>
            <option value="stuck_pipe">Stuck Pipe &amp; Sloughing Shale</option>
            <option value="cementing">Casing &amp; Cementing</option>
          </select>
        </div>

        <div>
          <select
            value={selectedFormation}
            onChange={(e) => setSelectedFormation(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-mild text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Formations</option>
            <option value="Barail Coal-Shale Sequence">Barail Coal-Shale</option>
            <option value="Kopili Formation">Kopili Formation</option>
            <option value="Tipam Sandstone Formation">Tipam Sandstone</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Found <strong>{filteredLessons.length}</strong> operational lessons and mitigation procedures</span>
      </div>

      {/* Lessons Cards List */}
      <div className="space-y-4">
        {filteredLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-mild border border-slate-200 shadow-card p-5 space-y-4 hover:border-slate-300 transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {lesson.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <h3 className="text-base font-bold text-slate-800">{lesson.title}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <button onClick={() => onSelectWellName(lesson.originWell)} className="text-primary font-semibold hover:underline">
                      {lesson.originWell}
                    </button>
                    <span>({lesson.field}) at {lesson.depth}m</span>
                  </span>
                  <span>•</span>
                  <span>{lesson.formation}</span>
                  <span>•</span>
                  <span>Handled by: <strong>{lesson.supervisor}</strong></span>
                </div>
              </div>

              {/* Economic Savings Tag */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">NPT Avoidance</span>
                  <span className="text-sm font-bold text-emerald-700 font-mono">
                    {lesson.nptHoursAvoided} hrs (₹{lesson.costSavingsLakhs}L)
                  </span>
                </div>
              </div>
            </div>

            {/* Problem & Root Cause Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-200/80">
                <span className="font-bold text-slate-700 block mb-1">Operational Crisis:</span>
                <p className="text-slate-600 leading-relaxed">{lesson.challengeSummary}</p>
              </div>

              <div className="bg-red-50/60 p-3 rounded border border-red-200">
                <span className="font-bold text-red-800 block mb-1">Geomechanical Root Cause:</span>
                <p className="text-red-900 leading-relaxed">{lesson.rootCause}</p>
              </div>
            </div>

            {/* Field-Proven Mitigation Recipe */}
            <div className="bg-emerald-50/60 p-3.5 rounded-mild border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Field-Proven Standard Operating Procedure (SOP):</span>
                </div>
                <button
                  onClick={() => handleCopyRecipe(lesson.id, lesson.mitigationRecipe)}
                  className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold rounded border border-slate-200 transition-colors flex items-center gap-1"
                >
                  {copiedId === lesson.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-500" />
                      <span>Copy SOP</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="font-sans text-xs text-emerald-900 whitespace-pre-line leading-relaxed pl-5">
                {lesson.mitigationRecipe}
              </pre>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
