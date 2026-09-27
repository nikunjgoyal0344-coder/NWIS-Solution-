import React, { useState, useMemo } from 'react';
import { CrewMember } from '../../types';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Briefcase, 
  Award, 
  MapPin, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface CrewDirectoryViewProps {
  crew: CrewMember[];
  onSelectWellName: (wellName: string) => void;
}

export const CrewDirectoryView: React.FC<CrewDirectoryViewProps> = ({
  crew,
  onSelectWellName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // Unique roles
  const roles = useMemo(() => {
    return Array.from(new Set(crew.map(c => c.role)));
  }, [crew]);

  const filteredCrew = useMemo(() => {
    return crew.filter(member => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = member.name.toLowerCase().includes(q);
        const matchWell = member.wellsWorked.some(w => w.toLowerCase().includes(q));
        const matchAchieve = member.notableAchievement.toLowerCase().includes(q);
        if (!matchName && !matchWell && !matchAchieve) return false;
      }
      if (selectedRole !== 'all' && member.role !== selectedRole) return false;
      return true;
    });
  }, [crew, searchQuery, selectedRole]);

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 text-primary rounded">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Crew Contacts &amp; Institutional Human Memory</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Connect directly with experienced engineers and supervisors who previously drilled and managed offset well formations
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-mild border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by personnel name, well name, or operational problem solved..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-mild focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-mild text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Operational Roles</option>
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Crew Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrew.map((member) => (
          <div
            key={member.id}
            className="bg-white p-5 rounded-mild border border-slate-200 shadow-card hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header: Avatar, Name & Role */}
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-200 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                  {member.avatarInitials}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-800">{member.name}</h3>
                  <p className="text-xs font-semibold text-primary">{member.role}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{member.field} • {member.experienceYears} Years Exp.</p>
                </div>
              </div>

              {/* Wells Worked Tags */}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                  Historical Wells Managed:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {member.wellsWorked.map((wellName, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectWellName(wellName)}
                      className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-primary text-slate-700 rounded transition-colors"
                    >
                      {wellName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notable Achievement / Problem Solved */}
              <div className="mt-3 bg-slate-50 p-2.5 rounded border border-slate-100 text-xs">
                <div className="flex items-center gap-1 font-semibold text-slate-700 mb-0.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Institutional Legacy &amp; Crisis Solved:</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {member.notableAchievement}
                </p>
              </div>
            </div>

            {/* Direct 1-Click Communications */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <a
                href={`tel:${member.phone}`}
                className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call {member.phone}</span>
              </a>
              <a
                href={`mailto:${member.email}`}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                title={`Email ${member.email}`}
              >
                <Mail className="w-4 h-4 text-primary" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
