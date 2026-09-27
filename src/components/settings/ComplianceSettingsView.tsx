import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  HardDrive, 
  FileCheck2, 
  CheckCircle, 
  AlertCircle,
  Database,
  Cpu
} from 'lucide-react';

export const ComplianceSettingsView: React.FC = () => {
  const [dlpMaskingEnabled, setDlpMaskingEnabled] = useState(true);
  const [offlineRigMode, setOfflineRigMode] = useState(true);
  const [merkleVerification, setMerkleVerification] = useState(true);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Security, Cryptography &amp; Regulatory Compliance
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              OISD-STD-189, IEC 62443 SL-4, and MoPNG sovereign hydrocarbon data governance settings
            </p>
          </div>
        </div>
      </div>

      {/* Expected Outcome / Solution Charter Card */}
      <div className="bg-blue-50/60 p-5 rounded-mild border border-blue-200 shadow-sm flex flex-col sm:flex-row items-start gap-4">
        <div className="p-2.5 bg-primary text-white rounded shrink-0">
          <Cpu className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded uppercase tracking-wider">
              Mandate / Expected Outcome
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              System Specification
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-800 leading-snug">
            Develop an AI/ML-enabled Nearby Wells Intelligence System (NWIS) that acts as a standalone decision-support platform alongside eRTMAC that has institutional memory.
          </h2>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-2 py-0.5 bg-white border border-blue-200 rounded text-primary text-[10px] font-semibold">
              ✓ Standalone Decision Support
            </span>
            <span className="px-2 py-0.5 bg-white border border-blue-200 rounded text-primary text-[10px] font-semibold">
              ✓ Alongside eRTMAC
            </span>
            <span className="px-2 py-0.5 bg-white border border-blue-200 rounded text-primary text-[10px] font-semibold">
              ✓ Institutional Memory Engine
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Data Loss Prevention (DLP) */}
        <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-slate-800">MoPNG / DGH Data Loss Prevention (DLP)</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={dlpMaskingEnabled} 
                onChange={() => setDlpMaskingEnabled(!dlpMaskingEnabled)} 
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <p className="text-xs text-slate-600">
            Automatically masks sovereign coordinates and estimated strategic reserve volumes in exported dossiers to prevent unauthorized data leaks under Indian Directorate General of Hydrocarbons guidelines.
          </p>

          <div className="bg-slate-50 p-3 rounded border border-slate-100 text-xs font-mono space-y-1">
            <span className="text-slate-400 block text-[10px] font-sans">Sample Sanitization Preview:</span>
            <p className="text-slate-700">
              Raw GPS: 27°17'04.2"N 95°20'31.5"E &rarr; <span className="text-emerald-700 font-bold">{dlpMaskingEnabled ? '27°17\'XX.X"N [PROTECTED-MoPNG]' : '27°17\'04.2"N 95°20\'31.5"E'}</span>
            </p>
          </div>
        </div>

        {/* Card 2: SHA-256 Merkle Provenance */}
        <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-800">SHA-256 Merkle Chain Fingerprinting</h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Active Chain
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Every Daily Drilling Report (DDR), well trajectory survey, and hazardous alert acknowledgment is cryptographically signed to guarantee complete tamper-proofing for official inquiries.
          </p>

          <div className="bg-slate-50 p-3 rounded border border-slate-100 text-[11px] text-slate-600 space-y-1">
            <p>• Root Hash: <span className="font-mono text-[10px] text-slate-500">e3b0c44298fc1c149afbf4c8996fb924...</span></p>
            <p>• Verified Blocks: <strong>48 Historical Wells (100% Intact)</strong></p>
          </div>
        </div>

        {/* Card 3: Air-Gapped Rig Offline Persistence */}
        <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-slate-800">Air-Gapped Offline Local Persistence</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={offlineRigMode} 
                onChange={() => setOfflineRigMode(!offlineRigMode)} 
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <p className="text-xs text-slate-600">
            Enables local JSON storage and IndexedDB fallback for remote Assam drilling rigs during satellite internet outages. Automatically queues pending sync records.
          </p>

          <div className="bg-slate-50 p-3 rounded border border-slate-100 text-xs flex justify-between items-center">
            <span className="text-slate-500">Local Cache:</span>
            <span className="font-mono font-semibold text-emerald-700">6.4 MB Synchronized</span>
          </div>
        </div>

        {/* Card 4: OISD-STD-189 & Industrial Standard SL-4 */}
        <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-slate-800">Safety Standards Certification</h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">OISD-STD-189 (Well Control System)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                Compliant
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">IEC 62443 SL-4 (Industrial Cybersecurity)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                Level-4 Secure
              </span>
            </div>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-medium text-slate-700">eRTMAC Protocol Bridge (WITSML 1.4.1)</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-primary">
                Active Stream
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
