import React, { useState } from 'react';
import { Well, WellDocument, DrillingIncident } from '../../types';
import { WELL_DOCUMENTS } from '../../data/mockData';
import { 
  FileText, 
  Scan, 
  Sparkles, 
  CheckCircle2, 
  Download, 
  Layers, 
  ShieldCheck, 
  RefreshCw,
  Upload,
  Compass,
  GitBranch,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface ExtractedEntity {
  category: string;
  field: string;
  extractedValue: string;
  confidence: number;
  sourceSnippet: string;
}

interface DocumentIntelligenceViewProps {
  onIngestScannedWell?: (well: Well, incident?: DrillingIncident, doc?: WellDocument) => void;
  onNavigateToTab?: (tab: any) => void;
}

export const DocumentIntelligenceView: React.FC<DocumentIntelligenceViewProps> = ({
  onIngestScannedWell,
  onNavigateToTab,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(WELL_DOCUMENTS[1].id);
  const [activeTab, setActiveTab] = useState<'structured' | 'json' | 'provenance'>('structured');
  const [isExtracting, setIsExtracting] = useState(false);
  const [showOcrBoxes, setShowOcrBoxes] = useState(true);
  const [ingestedSuccess, setIngestedSuccess] = useState<string | null>(null);

  // File upload & OCR progress states
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStepName, setUploadStepName] = useState('');
  const [customUploadedName, setCustomUploadedName] = useState<string | null>(null);

  const selectedDoc = WELL_DOCUMENTS.find(d => d.id === selectedDocId) || WELL_DOCUMENTS[0];

  const extractedEntities: ExtractedEntity[] = [
    {
      category: 'Geomechanics & Incident',
      field: 'Hazard Classification',
      extractedValue: 'Severe Lost Circulation (22 bbl/hr)',
      confidence: 98.4,
      sourceSnippet: '...total loss of returns observed at rate of 22 bbl/hr upon penetrating fractured coal seam at 2,845m...'
    },
    {
      category: 'Stratigraphy',
      field: 'Formation Horizon',
      extractedValue: 'Barail Coal-Shale Sequence',
      confidence: 96.8,
      sourceSnippet: '...drilling through Barail Coal Section #4 between 2,840m and 2,865m...'
    },
    {
      category: 'Operational Parameters',
      field: 'Pre-Loss Mud Weight',
      extractedValue: '1.21 SG (Barite-weighted KCL-PHPA)',
      confidence: 99.1,
      sourceSnippet: '...active mud weight in suction pit recorded at 1.21 SG prior to connection...'
    },
    {
      category: 'Casing Programme',
      field: 'Intermediate Casing Shoe',
      extractedValue: '9-5/8" at 2,595m (Cement Top: 550m)',
      confidence: 97.5,
      sourceSnippet: '...casing integrity verified at 9-5/8 inch shoe depth of 2,595 meters...'
    },
    {
      category: 'Engineering Mitigation',
      field: 'Corrective Action / Pill Recipe',
      extractedValue: '40 bbl LCM pill with 25 ppb coarse Nut-Plug & mica flakes; dropped MW to 1.16 SG',
      confidence: 95.2,
      sourceSnippet: '...spotted 40 bbl high viscosity LCM slug containing 25 ppb dual-grade Nut-Plug. Reduced mud density to 1.16 SG...'
    },
    {
      category: 'Economic Impact',
      field: 'Non-Productive Time (NPT)',
      extractedValue: '36 Hours Lost (Estimated Cost: ₹28.5 Lakhs)',
      confidence: 94.0,
      sourceSnippet: '...total rig downtime due to lost circulation cure operations: 36 hrs...'
    }
  ];

  const handleReExtract = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
    }, 800);
  };

  // Helper to ingest a well object into 3D Map and Correlation Panel
  const processWellIngestion = (siteName: string, docFileName?: string) => {
    const wellId = siteName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newScannedWell: Well = {
      id: wellId,
      name: siteName,
      field: 'Duliajan',
      block: 'Duliajan West Flank',
      status: 'completed',
      type: 'previous',
      currentDepth: 3450,
      totalDepth: 3450,
      spudDate: '2021-06-15',
      completionDate: '2021-09-20',
      coordinates: {
        lat: 27.3100,
        lng: 95.3350,
        surfaceX: 2800,
        surfaceY: 1400
      },
      distanceFromActiveKm: 3.2,
      riskLevel: 'high',
      operator: 'Oil India Limited (OIL)',
      rigName: 'OIL Rig E-1400',
      targetFormation: 'Barail / Kopili Sandstone',
      casingProgram: [
        { size: '20"', shoeDepth: 110, casingType: 'Conductor', cementTop: 0, status: 'Set' },
        { size: '13-3/8"', shoeDepth: 830, casingType: 'Surface', cementTop: 0, status: 'Set' },
        { size: '9-5/8"', shoeDepth: 2580, casingType: 'Intermediate', cementTop: 580, status: 'Set' },
        { size: '7"', shoeDepth: 3450, casingType: 'Production', cementTop: 2320, status: 'Set' }
      ],
      eventsCount: {
        mudLoss: 2,
        kick: 1,
        stuckPipe: 0,
        torqueSpike: 2,
        cementing: 0
      },
      sparklineData: [6, 14, 28, 88, 55, 30, 10],
      trajectoryPoints: [
        { md: 0, tvd: 0, dx: 0, dy: 0 },
        { md: 850, tvd: 845, dx: 10, dy: 10 },
        { md: 1850, tvd: 1835, dx: 35, dy: 35 },
        { md: 2580, tvd: 2550, dx: 70, dy: 75 },
        { md: 2848, tvd: 2810, dx: 95, dy: 105 },
        { md: 3450, tvd: 3390, dx: 130, dy: 145 }
      ],
      isUploaded: true
    } as any;

    const newIncident: DrillingIncident = {
      id: `inc-${wellId}`,
      wellId: wellId,
      wellName: siteName,
      depth: 2848,
      formation: 'Barail Coal-Shale Sequence',
      type: 'mud_loss',
      severity: 'high',
      title: `Scanned Record: 25 bbl/hr Mud Loss at 2,848m (${siteName})`,
      description: 'Extracted from scanned WCR dossier. Total lost circulation in Barail fractured coal seam requiring 45 bbl LCM pill.',
      durationHours: 32,
      nptCostLakhsINR: 24.0,
      rootCause: 'Depleted reservoir pressure in offset structural compartment.',
      mitigationAction: 'Pumped dual-grade Nut-Plug LCM pill and dropped mud weight to 1.17 SG.',
      date: '2021-07-28',
      resolved: true
    };

    const newDoc: WellDocument = {
      id: `doc-${wellId}`,
      wellId: wellId,
      title: docFileName || `${siteName} Scanned WCR Dossier`,
      type: 'WCR',
      date: '2021-09-25',
      pageCount: 18,
      fileSizeBytes: '14.2 MB',
      merkleHash: '8f4c2e1b9a7d3f5e0c8b6a4d2e1f9a7d3f5e0c8b6a4d2e1f9a7d3f5e0c8b6a4d'
    };

    if (onIngestScannedWell) {
      onIngestScannedWell(newScannedWell, newIncident, newDoc);
    }
    setIngestedSuccess(siteName);
    setCustomUploadedName(siteName);
  };

  // Handles real file selection from local device (PDF, TIFF, LAS, Images)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Derive a clean site name from file name
    const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const siteName = `Well ${rawName.toUpperCase()} (Scanned Ingest)`;

    setIsUploadingFile(true);
    setUploadProgress(15);
    setUploadStepName('Reading file raster and initializing multi-threaded OCR engine...');

    setTimeout(() => {
      setUploadProgress(50);
      setUploadStepName('Extracting Barail Coal top (2,600m) & 2,848m mud loss event...');
    }, 700);

    setTimeout(() => {
      setUploadProgress(85);
      setUploadStepName('Geo-referencing surface coordinates (3.2km offset) and 3D trajectory...');
    }, 1400);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStepName('Extraction complete! Auto-projecting into 3D Subsurface & Correlation...');
      processWellIngestion(siteName, file.name);
      setIsUploadingFile(false);
    }, 2000);
  };

  // 1-Click preset ingestion of DUL-22
  const handleIngestNewScannedSite = () => {
    processWellIngestion('Well DUL-22 (Ingested Scanned Site)', 'Well_DUL_22_Scanned_WCR.pdf');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-mild border border-slate-200 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-50 text-primary rounded">
                <Scan className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-slate-800">
                Document Intelligence &amp; Automated OCR Studio
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Extract, structure, and automatically project scanned historical drilling reports into the 3D Subsurface Map and Correlation Panel
            </p>
          </div>

          {/* Document Selector & Actions */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.png,.jpg,.jpeg,.tiff,.tif,.las,.csv"
              className="hidden"
            />

            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-mild font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {WELL_DOCUMENTS.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.title.length > 45 ? `${doc.title.substring(0, 45)}...` : doc.title}
                </option>
              ))}
            </select>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingFile}
              className="h-9 px-3 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              title="Upload any historical well scanned dossier"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Scanned Dossier</span>
            </button>

            <button
              onClick={handleReExtract}
              disabled={isExtracting}
              className="h-9 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isExtracting ? 'animate-spin' : ''}`} />
              <span>{isExtracting ? 'Extracting...' : 'Re-Run NLP'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS INGESTION NOTIFICATION BANNER */}
      {ingestedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-mild shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                Ingested Successfully into Digital Twin Database!
              </h4>
              <p className="text-xs text-emerald-800">
                <strong>{ingestedSuccess}</strong> has been extracted, geo-located, and added to the <strong>3D Subsurface Map</strong> and <strong>Multi-Well Correlation Panel</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateToTab && (
              <>
                <button
                  onClick={() => onNavigateToTab('map')}
                  className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>View in 3D Map</span>
                </button>
                <button
                  onClick={() => onNavigateToTab('correlation')}
                  className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>View Correlation</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Dual-Pane Studio: Left Scanned PDF with OCR layer, Right Structured Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Scanned PDF Document with OCR Bounding Boxes (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-mild border border-slate-200 shadow-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Historical Scanned PDF Dossier
                </h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowOcrBoxes(!showOcrBoxes)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors ${
                    showOcrBoxes ? 'bg-blue-50 text-primary border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  OCR Layers: {showOcrBoxes ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Document Metadata Summary */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 py-2">
              <span>Type: <strong>{selectedDoc.type}</strong></span>
              <span>Pages: <strong>{selectedDoc.pageCount}</strong></span>
              <span>File Size: <strong>{selectedDoc.fileSizeBytes}</strong></span>
            </div>

            {/* Visual Simulated Scanned Document Canvas */}
            <div className="relative bg-slate-100 rounded-mild border border-slate-300 p-4 font-mono text-[11px] text-slate-700 min-h-[360px] shadow-inner select-none overflow-hidden">
              <div className="bg-white p-4 rounded shadow-sm border border-slate-200 space-y-3 relative">
                <div className="border-b border-slate-200 pb-2 text-center">
                  <p className="font-bold text-xs uppercase tracking-tight text-slate-800">OIL INDIA LIMITED • DULIAJAN OPERATIONS</p>
                  <p className="text-[10px] text-slate-500">{selectedDoc.title}</p>
                  <p className="text-[9px] text-slate-400">Date: {selectedDoc.date} | Rig: OIL E-2000</p>
                </div>

                <p className="text-[11px] leading-relaxed">
                  <strong>06:00 - 14:00 HRS:</strong> Drilling 8-1/2" hole from 2,820m to 2,845m with 1.21 SG polymer mud. At 2,845m depth, sudden drop in pit volume observed.
                </p>

                <div className={`p-1 rounded transition-colors ${
                  showOcrBoxes ? 'bg-red-50 border border-red-300 text-red-800 relative' : ''
                }`}>
                  {showOcrBoxes && (
                    <span className="absolute -top-2 right-1 px-1 bg-red-600 text-white text-[8px] font-sans font-bold rounded">
                      OCR: LOSS_EVENT
                    </span>
                  )}
                  <strong>EVENT:</strong> Total loss of returns observed at rate of <strong>22 bbl/hr</strong>. Pit volume decreased 35 bbls in 12 mins.
                </div>

                <div className={`p-1 rounded transition-colors ${
                  showOcrBoxes ? 'bg-amber-50 border border-amber-300 text-amber-800 relative' : ''
                }`}>
                  {showOcrBoxes && (
                    <span className="absolute -top-2 right-1 px-1 bg-amber-600 text-white text-[8px] font-sans font-bold rounded">
                      OCR: FORMATION_TOP
                    </span>
                  )}
                  <strong>FORMATION:</strong> Lithology confirms penetration of fractured <strong>Barail Coal Seam #4</strong>.
                </div>

                <div className={`p-1 rounded transition-colors ${
                  showOcrBoxes ? 'bg-emerald-50 border border-emerald-300 text-emerald-800 relative' : ''
                }`}>
                  {showOcrBoxes && (
                    <span className="absolute -top-2 right-1 px-1 bg-emerald-600 text-white text-[8px] font-sans font-bold rounded">
                      OCR: MITIGATION_ACTION
                    </span>
                  )}
                  <strong>ACTION TAKEN:</strong> Prepared and spotted 40 bbl high viscosity LCM pill with 25 ppb coarse Nut-Plug and mica flakes. Reduced pump rate to 350 GPM and cut mud weight to 1.16 SG.
                </div>

                <p className="text-[10px] text-slate-500">
                  Signed: <em>B. K. Gogoi (Company Man)</em> | Verified by DGH Auditor
                </p>
              </div>
            </div>
          </div>

          {/* Action: Ingest Scanned Site directly into 3D Map and Correlation */}
          <div className="pt-2 space-y-2">
            {/* Animated OCR Scanning Progress Bar */}
            {isUploadingFile && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-mild space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs font-semibold text-primary">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>OCR Ingestion in Progress</span>
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 font-mono italic">
                  {uploadStepName}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingFile}
                className="py-2.5 px-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Scanned File</span>
              </button>

              <button
                onClick={handleIngestNewScannedSite}
                disabled={isUploadingFile}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Quick Ingest Sample Site</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center">
              Extracts 3D coordinates, wellbore trajectory, and incident pins into 3D Subsurface Map &amp; Stratigraphic Correlation.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: AI NLP Extracted Structured Database Records (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-mild border border-slate-200 shadow-card p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  AI &amp; NLP Extracted Knowledge Graph
                </h3>
              </div>

              {/* View Mode Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px]">
                <button
                  onClick={() => setActiveTab('structured')}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                    activeTab === 'structured' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Structured Table
                </button>
                <button
                  onClick={() => setActiveTab('json')}
                  className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                    activeTab === 'json' ? 'bg-white text-primary shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  JSON Schema
                </button>
              </div>
            </div>

            {/* TAB: STRUCTURED TABLE */}
            {activeTab === 'structured' && (
              <div className="space-y-2.5">
                {extractedEntities.map((entity, idx) => (
                  <div key={idx} className="p-3 rounded-mild border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {entity.category} • {entity.field}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {entity.confidence}% Confidence
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800">
                      {entity.extractedValue}
                    </p>

                    <p className="text-[11px] text-slate-500 italic bg-white p-1.5 rounded border border-slate-100">
                      "{entity.sourceSnippet}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB: JSON SCHEMA VIEW */}
            {activeTab === 'json' && (
              <div className="bg-slate-900 text-emerald-400 p-4 rounded-mild font-mono text-xs overflow-x-auto max-h-[440px]">
                <pre>{JSON.stringify(extractedEntities, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              SHA-256 Merkle Provenance: <strong className="font-mono text-[10px]">{selectedDoc.merkleHash.substring(0, 16)}...</strong>
            </span>

            <button
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(extractedEntities, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `${selectedDoc.title.substring(0, 15)}_extracted.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Extracted JSON</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
