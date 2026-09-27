export type WellStatus = 'drilling' | 'completed' | 'suspended';
export type WellType = 'present' | 'previous';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Formation {
  id: string;
  name: string;
  topDepth: number; // in meters
  bottomDepth: number;
  lithology: string;
  color: string;
  description: string;
  typicalHazards: string[];
}

export interface CasingPoint {
  size: string; // e.g., '20"', '13-3/8"', '9-5/8"', '7"'
  shoeDepth: number; // in meters
  casingType: 'Conductor' | 'Surface' | 'Intermediate' | 'Production' | 'Liner';
  cementTop: number;
  status: 'Set' | 'Planned';
}

export type IncidentType = 
  | 'mud_loss' 
  | 'kick' 
  | 'stuck_pipe' 
  | 'overpressure' 
  | 'torque_spike' 
  | 'cementing_issue';

export interface DrillingIncident {
  id: string;
  wellId: string;
  wellName: string;
  depth: number; // in meters
  formation: string;
  type: IncidentType;
  severity: RiskLevel;
  title: string;
  description: string;
  durationHours: number;
  nptCostLakhsINR: number; // Non-productive time cost
  rootCause: string;
  mitigationAction: string;
  date: string;
  resolved: boolean;
}

export interface AIWarning {
  id: string;
  riskType: string;
  incidentType: IncidentType;
  probability: number; // 0 to 100%
  severity: RiskLevel;
  depthRange: [number, number]; // [minDepth, maxDepth]
  formation: string;
  activeDepthProximity: number; // distance in meters ahead of current bit
  similarIncidents: {
    wellId: string;
    wellName: string;
    depth: number;
    description: string;
    actionTaken: string;
  }[];
  aiExplanation: string;
  suggestedAction: string;
  priority: number; // 1 = highest
  acknowledged: boolean;
  timestamp: string;
}

export interface TelemetryPoint {
  depth: number; // in meters
  rop: number; // m/hr
  wob: number; // tonnes / klbs
  torque: number; // kN.m
  rpm: number; // rpm
  mudWeightIn: number; // SG
  mudWeightOut: number; // SG
  spp: number; // psi
  ecd: number; // SG
  gasUnits: number; // units
  flowIn: number; // gpm
  flowOut: number; // gpm
}

export interface CrewMember {
  id: string;
  name: string;
  role: 'Drilling Superintendent' | 'Company Man' | 'Senior Toolpusher' | 'Chief Mud Engineer' | 'Lead Petrophysicist' | 'Directional Driller';
  phone: string;
  email: string;
  wellsWorked: string[];
  field: string;
  experienceYears: number;
  activePeriod: string;
  notableAchievement: string;
  avatarInitials: string;
}

export interface WellDocument {
  id: string;
  wellId: string;
  title: string;
  type: 'WCR' | 'DDR' | 'MudLog' | 'CementingReport';
  date: string;
  pageCount: number;
  fileSizeBytes: string;
  merkleHash: string; // SHA-256 fingerprint for provenance
}

export interface Well {
  id: string;
  name: string;
  field: string;
  block: string;
  status: WellStatus;
  type: WellType;
  currentDepth: number; // for active wells
  totalDepth: number; // planned or final TD
  spudDate: string;
  completionDate?: string;
  coordinates: {
    lat: number;
    lng: number;
    surfaceX: number; // local grid in meters
    surfaceY: number;
  };
  distanceFromActiveKm?: number; // relative to active well
  riskLevel: RiskLevel;
  operator: string;
  rigName: string;
  targetFormation: string;
  casingProgram: CasingPoint[];
  eventsCount: {
    mudLoss: number;
    kick: number;
    stuckPipe: number;
    torqueSpike: number;
    cementing: number;
  };
  sparklineData: number[]; // relative risk trend across depth intervals
  trajectoryPoints: { md: number; tvd: number; dx: number; dy: number }[];
}

export interface QuickStats {
  activeWells: number;
  criticalAlerts: number;
  wellsWithEvents: number;
  totalHistoricalWells: number;
}
