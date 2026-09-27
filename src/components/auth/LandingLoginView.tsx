import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Compass, 
  Cpu, 
  Layers, 
  AlertTriangle, 
  Radio, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  HardDrive, 
  Users, 
  ChevronRight,
  Sparkles,
  Key,
  Flame,
  Activity,
  UserCheck
} from 'lucide-react';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

export interface EngineerUser {
  name: string;
  role: string;
  email: string;
  rigId: string;
  avatarInitials: string;
}

interface LandingLoginViewProps {
  onLogin: (user: EngineerUser) => void;
}

const ENGINEER_PRESETS: EngineerUser[] = [
  {
    name: 'Pranjal Borah',
    role: 'Senior Toolpusher / Rig Superintendent',
    email: 'p_borah@oilindia.in',
    rigId: 'Rig F-3000 HP Drillmaster (Nahorkatiya)',
    avatarInitials: 'PB'
  },
  {
    name: 'Dr. Ananya Sarma',
    role: 'Lead Wellsite Geologist',
    email: 'a_sarma@oilindia.in',
    rigId: 'Upper Assam Geological Core Team',
    avatarInitials: 'AS'
  },
  {
    name: 'B. K. Gogoi',
    role: 'Company Man / Drilling Supervisor',
    email: 'bk_gogoi@oilindia.in',
    rigId: 'eRTMAC Central Operations Room',
    avatarInitials: 'BG'
  },
  {
    name: 'Rajeev Duarah',
    role: 'Chief Mud Engineer',
    email: 'r_duarah@oilindia.in',
    rigId: 'Fluids & Geomechanics Laboratory',
    avatarInitials: 'RD'
  }
];

export const LandingLoginView: React.FC<LandingLoginViewProps> = ({ onLogin }) => {
  const [selectedPreset, setSelectedPreset] = useState<EngineerUser>(ENGINEER_PRESETS[0]);
  const [employeeId, setEmployeeId] = useState('OIL-ENG-28491');
  const [password, setPassword] = useState('••••••••••••');
  const [stationMode, setStationMode] = useState<'ertmac' | 'airgap'>('ertmac');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handlePresetSelect = (preset: EngineerUser) => {
    setSelectedPreset(preset);
    setEmployeeId(preset.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      onLogin(selectedPreset);
    }, 600);
  };

  const handleGuestQuickEnter = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      onLogin(ENGINEER_PRESETS[0]);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-800 flex flex-col justify-between">
      {/* 1. TOP ENTERPRISE BANNER */}
      <header className="h-16 bg-primary text-white px-6 md:px-12 flex items-center justify-between shadow-md z-20 border-b border-white/10">
        <div className="flex items-center gap-3">
          {/* Derrick Emblem */}
          <div className="w-9 h-9 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L4 22h16L12 2z" />
              <path d="M8 12h8" />
              <path d="M6 17h12" />
              <path d="M12 2v20" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">NWIS</h1>
              <span className="text-white/40 font-light text-xs">|</span>
              <span className="text-xs text-slate-200 font-medium">Nearby Wells Intelligence System</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900 shadow-xs">
                DEMO PROTOTYPE
              </span>
            </div>
            <p className="text-[10px] text-slate-300 hidden sm:block">
              Oil India Limited (OIL) • Standalone Decision-Support Platform Alongside eRTMAC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/15 rounded text-slate-200 text-[11px]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>eRTMAC Telemetry: Online</span>
          </div>

          <ThemeSwitcher />

          <button
            onClick={handleGuestQuickEnter}
            className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded text-xs transition-colors flex items-center gap-1.5"
            title="Instant 1-Click Access as Lead Engineer"
          >
            <span>Quick Demo Access</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN HERO & SIGN-IN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: Mission Charter, Live Operations Telemetry, Core Pillars (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Mission Statement */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-50 border border-blue-200 text-primary text-xs font-semibold">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                <span>STANDALONE DRILLING DECISION-SUPPORT PLATFORM</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
                AI-Driven Subsurface Memory &amp; Look-Ahead Hazard Prediction
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Operating alongside OIL’s <strong>eRTMAC</strong>, NWIS bridges live telemetry with decades of institutional knowledge—transforming unstructured historical offset reports (WCR/DDR), remedial mud recipes, and veteran crew expertise into proactive drilling intelligence.
              </p>
            </div>

            {/* LIVE ACTIVE RIG STATUS CARD */}
            <div className="bg-white rounded-mild border border-slate-200 shadow-card p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Live Active Telemetry Stream
                  </span>
                </div>
                <span className="text-[11px] font-mono text-primary font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  OIL-NHK-ACT-01
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Current Bit Depth</p>
                  <p className="text-base font-bold text-primary font-mono mt-0.5">2,835 m</p>
                  <p className="text-[10px] text-slate-400">Target TD: 3,650m</p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Formation Horizon</p>
                  <p className="text-xs font-bold text-slate-800 mt-1 truncate">Barail Coal-Shale</p>
                  <p className="text-[10px] text-amber-700 font-medium">Fractured interval</p>
                </div>

                <div className="bg-red-50/70 p-2.5 rounded border border-red-200">
                  <p className="text-[10px] text-red-700 uppercase font-semibold">Look-Ahead Alert</p>
                  <p className="text-xs font-bold text-red-700 mt-1">Severe Loss Hazard</p>
                  <p className="text-[10px] text-red-600 font-mono">10m ahead (2,845m)</p>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-snug">
                  <strong>Offset Institutional Memory:</strong> Well NHK-124 (2.8 km away) encountered 22 bbl/hr total loss at 2,848m requiring 40 bbl Nut-Plug LCM pill and cutting mud density to 1.16 SG.
                </p>
              </div>
            </div>

            {/* 4 CORE PLATFORM PILLARS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-mild border border-slate-200 shadow-xs flex items-start gap-2.5">
                <div className="p-2 bg-blue-50 text-primary rounded shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">3D Subsurface Twin</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">True 3D wellbore trajectories with interactive depth slicer.</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-mild border border-slate-200 shadow-xs flex items-start gap-2.5">
                <div className="p-2 bg-amber-50 text-amber-700 rounded shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Proactive Mud Window</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Calculates safe ECD margins (1.18 - 1.23 SG) before penetration.</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-mild border border-slate-200 shadow-xs flex items-start gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Document OCR &amp; NLP</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Ingests scanned historical WCR reports straight into 3D space.</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-mild border border-slate-200 shadow-xs flex items-start gap-2.5">
                <div className="p-2 bg-slate-100 text-slate-700 rounded shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Crew Memory Network</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Instantly connects rig crews with veteran drillers and engineers.</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Engineer Authentication Station (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="bg-white rounded-mild border border-slate-200 shadow-card p-6 md:p-7 space-y-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-primary rounded">
                      <Lock className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      Engineer Authentication
                    </h3>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>IEC 62443 SL-4</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Oil India Limited Enterprise Single Sign-On (SSO) &amp; Rig Terminal Access
                </p>
              </div>

              {/* 1-CLICK QUICK PRESET SELECTOR */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Select Engineer Profile (1-Click Login):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ENGINEER_PRESETS.map((preset) => {
                    const isSelected = selectedPreset.name === preset.name;
                    return (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handlePresetSelect(preset)}
                        className={`p-2.5 rounded-mild border text-left transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-blue-50/70 border-primary ring-2 ring-primary/20 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {preset.avatarInitials}
                        </div>
                        <div className="overflow-hidden">
                          <p className={`text-xs font-bold truncate ${isSelected ? 'text-primary' : 'text-slate-800'}`}>
                            {preset.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {preset.role}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FORM CREDENTIALS */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>OIL Enterprise ID / Email</span>
                    <span className="text-[10px] text-slate-400 font-normal">Registered Directory</span>
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                    className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Security Passcode / Token</span>
                    <span className="text-[10px] text-slate-400 font-normal">SmartCard / Token PIN</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                    />
                    <Key className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                {/* Operation Rig Mode Toggle */}
                <div className="pt-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Terminal Operational Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStationMode('ertmac')}
                      className={`py-1.5 px-2.5 rounded text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                        stationMode === 'ertmac'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <Radio className="w-3 h-3 text-emerald-400" />
                      <span>eRTMAC Live Feed</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStationMode('airgap')}
                      className={`py-1.5 px-2.5 rounded text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                        stationMode === 'airgap'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <HardDrive className="w-3 h-3" />
                      <span>Air-Gapped Rig Mode</span>
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full h-11 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded shadow-md transition-all flex items-center justify-center gap-2 mt-2 focus:ring-2 focus:ring-primary/40"
                >
                  {isSigningIn ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating Credentials &amp; Syncing eRTMAC...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Sign In as {selectedPreset.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo note */}
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-center">
                <p className="text-[11px] text-slate-500">
                  <strong className="text-slate-700">Prototype Demo Mode:</strong> Any credentials or 1-click preset will immediately open the decision-support workspace.
                </p>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* 3. FOOTER STATS & COMPLIANCE BAR */}
      <footer className="bg-white border-t border-slate-200 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-6">
            <div>
              <span className="font-bold text-slate-800">14</span> Historical Wells Correlated
            </div>
            <div>
              <span className="font-bold text-slate-800">48</span> Scanned WCR/DDR Dossiers
            </div>
            <div>
              <span className="font-bold text-slate-800">100%</span> Sovereign Data In-Memory
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center md:text-right">
            Oil India Limited (OIL) • Compliance: OISD-STD-189 &amp; MoPNG Hydrocarbon Data Guidelines (Synthetic Simulation Data)
          </div>
        </div>
      </footer>
    </div>
  );
};
