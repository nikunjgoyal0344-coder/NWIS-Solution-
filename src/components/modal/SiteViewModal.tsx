import React, { useState } from 'react';
import { Well, DrillingIncident, WellDocument } from '../../types';
import { 
  DRILLING_INCIDENTS, 
  CREW_MEMBERS, 
  WELL_DOCUMENTS, 
  FORMATIONS,
  generateDepthTelemetry 
} from '../../data/mockData';
import { TimelineBar } from './TimelineBar';
import { 
  X, 
  Layers, 
  Compass, 
  Clock, 
  AlertTriangle, 
  Gauge, 
  Sparkles, 
  Users, 
  FileText, 
  GitCompare, 
  MapPin, 
  Download,
  ShieldCheck,
  Phone,
  Mail
} from 'lucide-react';

interface SiteViewModalProps {
  well: Well;
  onClose: () => void;
  onCompareWithActive: (well: Well) => void;
  onLocateOnMap: (well: Well) => void;
}

type ModalTab = 'overview' | 'trajectory' | 'timeline' | 'events' | 'parameters' | 'aiRisk' | 'crew' | 'documents';

export const SiteViewModal: React.FC<SiteViewModalProps> = ({
  well,
  onClose,
  onCompareWithActive,
  onLocateOnMap,
}) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');

  const incidents = DRILLING_INCIDENTS.filter(inc => inc.wellId === well.id);
  const documents = WELL_DOCUMENTS.filter(doc => doc.wellId === well.id);
  const crew = CREW_MEMBERS.filter(c => c.wellsWorked.includes(well.name) || c.wellsWorked.includes(well.id));
  const telemetry = generateDepthTelemetry(well.type === 'present', well.id);

  const isPresent = well.type === 'present';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Modal Container */}
      <div className="bg-white w-full max-w-5xl rounded-mild border border-slate-200 shadow-modal flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-primary text-white flex items-center justify-center font-bold text-sm">
              OIL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800">{well.name}</h2>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  isPresent ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'
                }`}>
                  {isPresent ? 'Active eRTMAC Stream' : 'Historical Offset Well'}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  well.riskLevel === 'low'
                    ? 'bg-emerald-50 text-emerald-700'
                    : well.riskLevel === 'medium'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {well.riskLevel.toUpperCase()} RISK
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{well.field} ({well.block}) • Rig: {well.rigName}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs (8-Tabs) */}
        <div className="flex border-b border-slate-200 bg-white px-6 overflow-x-auto text-xs font-medium">
          {[
            { id: 'overview' as ModalTab, label: 'Overview', icon: Layers },
            { id: 'trajectory' as ModalTab, label: '3D Trajectory', icon: Compass },
            { id: 'timeline' as ModalTab, label: 'Timeline', icon: Clock },
            { id: 'events' as ModalTab, label: `Events & NPT (${incidents.length})`, icon: AlertTriangle },
            { id: 'parameters' as ModalTab, label: 'Parameters & Logs', icon: Gauge },
            { id: 'aiRisk' as ModalTab, label: 'AI Risk Profile', icon: Sparkles },
            { id: 'crew' as ModalTab, label: `Crew (${crew.length})`, icon: Users },
            { id: 'documents' as ModalTab, label: `Dossiers (${documents.length})`, icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-mild border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Operational Status</span>
                  <p className="text-sm font-bold text-slate-800 capitalize mt-1">{well.status}</p>
                  <p className="text-xs text-slate-500 mt-1">Spud: {well.spudDate}</p>
                  {well.completionDate && <p className="text-xs text-slate-500">TD Date: {well.completionDate}</p>}
                </div>
                <div className="bg-white p-4 rounded-mild border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Depths</span>
                  <p className="text-sm font-bold text-slate-800 font-mono mt-1">
                    {well.currentDepth.toLocaleString()} m {isPresent ? '(Current)' : '(Total Depth)'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Planned Target TD: {well.totalDepth.toLocaleString()} m</p>
                </div>
                <div className="bg-white p-4 rounded-mild border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Target Formation</span>
                  <p className="text-sm font-bold text-slate-800 mt-1">{well.targetFormation}</p>
                  <p className="text-xs text-slate-500 mt-1">Operator: {well.operator}</p>
                </div>
              </div>

              {/* Casing & Cementing Programme Table */}
              <div className="bg-white p-4 rounded-mild border border-slate-200">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
                  Casing &amp; Cementing Programme
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Casing Type</th>
                        <th className="py-2 px-3">Size</th>
                        <th className="py-2 px-3">Shoe Depth (m)</th>
                        <th className="py-2 px-3">Top of Cement (m)</th>
                        <th className="py-2 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {well.casingProgram.map((c, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-medium text-slate-700">{c.casingType}</td>
                          <td className="py-2 px-3 font-mono">{c.size}</td>
                          <td className="py-2 px-3 font-mono font-medium">{c.shoeDepth} m</td>
                          <td className="py-2 px-3 font-mono">{c.cementTop} m</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              c.status === 'Set' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 3D TRAJECTORY */}
          {activeTab === 'trajectory' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-6 rounded-mild flex flex-col items-center justify-center relative min-h-[220px]">
                <Compass className="w-12 h-12 text-blue-400 opacity-60 mb-2" />
                <h4 className="text-sm font-semibold">Directional Survey Profile ({well.name})</h4>
                <p className="text-xs text-slate-400 mt-1 text-center max-w-md">
                  Surface Coordinates: Lat {well.coordinates.lat}°, Lng {well.coordinates.lng}° | Max Dogleg: 2.4°/30m
                </p>
                <div className="flex gap-4 mt-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Planned Path
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Current Bit (2,835m)
                  </span>
                </div>
              </div>

              {/* Trajectory Table */}
              <div className="bg-white p-4 rounded-mild border border-slate-200">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider mb-2">
                  Survey Station Stations (MD / TVD / Displacement)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">MD (m)</th>
                        <th className="py-2 px-3">TVD (m)</th>
                        <th className="py-2 px-3">Northing DX (m)</th>
                        <th className="py-2 px-3">Easting DY (m)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {well.trajectoryPoints.map((pt, i) => (
                        <tr key={i}>
                          <td className="py-1.5 px-3 font-medium text-slate-800">{pt.md}</td>
                          <td className="py-1.5 px-3 text-slate-600">{pt.tvd}</td>
                          <td className="py-1.5 px-3 text-slate-600">{pt.dx}</td>
                          <td className="py-1.5 px-3 text-slate-600">{pt.dy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE NAVIGATOR */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <TimelineBar well={well} />
              <div className="bg-white p-4 rounded-mild border border-slate-200 text-xs text-slate-600">
                <h4 className="font-semibold text-slate-800 mb-1">Timeline Insights:</h4>
                <p>
                  Interactive chronological progression links all structural casing points and recorded events. 
                  Select any milestone above to inspect associated Daily Drilling Report (DDR) summaries.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: EVENTS & INCIDENTS */}
          {activeTab === 'events' && (
            <div className="space-y-3">
              {incidents.length === 0 ? (
                <div className="bg-white p-8 rounded-mild border border-slate-200 text-center">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">Clean Drilling History</p>
                  <p className="text-xs text-slate-500 mt-1">No major non-productive time (NPT) incidents recorded for this well.</p>
                </div>
              ) : (
                incidents.map((inc) => (
                  <div key={inc.id} className="bg-white p-4 rounded-mild border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800">
                          {inc.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-800">{inc.title}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        Depth: {inc.depth} m
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{inc.description}</p>

                    <div className="bg-slate-50 p-2.5 rounded border border-slate-100 text-xs space-y-1">
                      <div>
                        <strong className="text-slate-700">Root Cause:</strong> {inc.rootCause}
                      </div>
                      <div>
                        <strong className="text-emerald-700">Mitigation Action:</strong> {inc.mitigationAction}
                      </div>
                      <div className="flex gap-4 text-slate-500 pt-1 border-t border-slate-200/60 mt-1">
                        <span>Duration NPT: <strong>{inc.durationHours} hrs</strong></span>
                        <span>Estimated Cost: <strong>₹{inc.nptCostLakhsINR} Lakhs</strong></span>
                        <span>Date: {inc.date}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 5: PARAMETERS & LOGS */}
          {activeTab === 'parameters' && (
            <div className="bg-white p-4 rounded-mild border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Multi-Track Drilling Telemetry vs. Depth
                </h4>
                <span className="text-xs text-slate-500">WITSML / LAS 2.0 Normalized</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Depth (m)</th>
                      <th className="py-2 px-3">ROP (m/hr)</th>
                      <th className="py-2 px-3">WOB (klbs)</th>
                      <th className="py-2 px-3">Torque (kN.m)</th>
                      <th className="py-2 px-3">Mud Wt (SG)</th>
                      <th className="py-2 px-3">SPP (psi)</th>
                      <th className="py-2 px-3">ECD (SG)</th>
                      <th className="py-2 px-3">Gas (units)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {telemetry.slice(0, 10).map((pt, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-1.5 px-3 font-semibold text-slate-800">{pt.depth}</td>
                        <td className="py-1.5 px-3 text-blue-600">{pt.rop}</td>
                        <td className="py-1.5 px-3 text-slate-600">{pt.wob}</td>
                        <td className="py-1.5 px-3 text-slate-600">{pt.torque}</td>
                        <td className="py-1.5 px-3 text-emerald-600">{pt.mudWeightIn}</td>
                        <td className="py-1.5 px-3 text-slate-600">{pt.spp}</td>
                        <td className="py-1.5 px-3 text-slate-600">{pt.ecd}</td>
                        <td className="py-1.5 px-3 text-amber-600">{pt.gasUnits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: AI RISK PROFILE */}
          {activeTab === 'aiRisk' && (
            <div className="bg-white p-5 rounded-mild border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>AI Lithological &amp; Operational Vulnerability Synthesis</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The geological section drilled in <strong>{well.name}</strong> is characterized by rapid facies changes in the Barail Coal-Shale sequence (2,600m – 3,150m). Offset correlation confirms high fracture permeability and sensitive overpressures requiring dynamic ECD suppression.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-red-50 border border-red-200 rounded text-xs">
                  <h5 className="font-bold text-red-800 mb-1">Key Drilling Hazards Identified</h5>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    <li>Severe lost circulation in fractured Barail coal seams</li>
                    <li>Differential sticking risk in porous Tipam sand intervals</li>
                    <li>Tight hole and pack-off during wiper trips in Kopili shale</li>
                  </ul>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs">
                  <h5 className="font-bold text-emerald-800 mb-1">Proven Engineering Mitigations</h5>
                  <ul className="list-disc list-inside space-y-1 text-emerald-700">
                    <li>Pre-treat mud with 25 ppb fibrous LCM pill prior to seam entry</li>
                    <li>Maintain KCl concentration &gt; 6.5% for shale hydration control</li>
                    <li>Limit connection surge speeds to keep ECD &lt; 1.20 SG</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CREW CONTACTS */}
          {activeTab === 'crew' && (
            <div className="space-y-3">
              {crew.length === 0 ? (
                <div className="bg-white p-6 rounded-mild border border-slate-200 text-center text-xs text-slate-500">
                  No specific personnel record mapped. Refer to Global Crew Directory.
                </div>
              ) : (
                crew.map((member) => (
                  <div key={member.id} className="bg-white p-4 rounded-mild border border-slate-200 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-primary font-bold flex items-center justify-center text-xs">
                        {member.avatarInitials}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800">{member.name}</h4>
                        <p className="text-xs text-slate-500">{member.role} • {member.experienceYears} yrs exp.</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{member.notableAchievement}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${member.phone}`}
                        className="p-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title={`Call ${member.phone}`}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        title={`Email ${member.email}`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 8: DOCUMENTS & DOSSIERS */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="bg-white p-6 rounded-mild border border-slate-200 text-center text-xs text-slate-500">
                  No scanned reports indexed for this offset well.
                </div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id} className="bg-white p-4 rounded-mild border border-slate-200 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded bg-blue-50 text-primary">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-800">{doc.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.pageCount} pages</span>
                          <span>•</span>
                          <span>{doc.fileSizeBytes}</span>
                          <span>•</span>
                          <span>Date: {doc.date}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Merkle SHA-256: {doc.merkleHash.substring(0, 16)}...</span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Opening encrypted dossier: ${doc.title}`)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Modal Persistent Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onLocateOnMap(well);
                onClose();
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              <span>Locate on 3D Map</span>
            </button>

            {!isPresent && (
              <button
                onClick={() => {
                  onCompareWithActive(well);
                  onClose();
                }}
                className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded shadow-xs transition-colors flex items-center gap-1.5"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare with Active Well</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
