import { 
  Well, 
  Formation, 
  DrillingIncident, 
  AIWarning, 
  TelemetryPoint, 
  CrewMember, 
  WellDocument,
  QuickStats 
} from '../types';

export const FORMATIONS: Formation[] = [
  {
    id: 'f-1',
    name: 'Alluvium & Dhekiajuli',
    topDepth: 0,
    bottomDepth: 650,
    lithology: 'Unconsolidated Sands, Clay, Gravel',
    color: '#E2E8F0',
    description: 'Surface unconsolidated gravels and fresh water sand layers. Hole washout prone.',
    typicalHazards: ['Hole Washout', 'Surface Water Influx']
  },
  {
    id: 'f-2',
    name: 'Girujan Clay Formation',
    topDepth: 650,
    bottomDepth: 1850,
    lithology: 'Variegated Clays, Siltstones, Minor Sandstone',
    color: '#CBD5E1',
    description: 'Thick plastic clay sequence. Prone to bit balling and tight hole conditions on tripping.',
    typicalHazards: ['Bit Balling', 'Swelling Clays', 'Tight Hole']
  },
  {
    id: 'f-3',
    name: 'Tipam Sandstone Formation',
    topDepth: 1850,
    bottomDepth: 2600,
    lithology: 'Medium to Coarse Sandstone, Ferruginous Shale',
    color: '#FDE68A',
    description: 'Major regional hydrocarbon reservoir. Highly permeable sand intervals.',
    typicalHazards: ['Differential Sticking', 'Seepage Mud Loss']
  },
  {
    id: 'f-4',
    name: 'Barail Coal-Shale Sequence',
    topDepth: 2600,
    bottomDepth: 3150,
    lithology: 'Interbedded Coal Seams, Carbonaceous Shale, Sandstone',
    color: '#94A3B8',
    description: 'Geomechanically complex zone. Highly fractured coal seams prone to severe lost circulation, wellbore instability, and gas kicks.',
    typicalHazards: ['Severe Mud Loss', 'Sloughing Coal', 'Gas Kick', 'Stuck Pipe']
  },
  {
    id: 'f-5',
    name: 'Kopili Formation',
    topDepth: 3150,
    bottomDepth: 3550,
    lithology: 'Dark Grey Micro-fractured Shale, Calcareous Marl',
    color: '#64748B',
    description: 'Brittle, reactive overpressured shale section. High pore-pressure gradient requiring strict mud weight control.',
    typicalHazards: ['Overpressure Zone', 'Shale Sloughing', 'Torque Spikes']
  },
  {
    id: 'f-6',
    name: 'Sylhet Limestone / Basal Sand',
    topDepth: 3550,
    bottomDepth: 4000,
    lithology: 'Fossiliferous Limestone, Basal Sandstone',
    color: '#475569',
    description: 'Deep carbonate target with vugular porosity and localized hydrogen sulfide (H2S) traces.',
    typicalHazards: ['Total Mud Loss in Vugs', 'H2S Gas Warning']
  }
];

export const WELLS: Well[] = [
  // PRESENT / ACTIVE WELL (Live eRTMAC Stream)
  {
    id: 'oil-nhk-act-01',
    name: 'OIL-NHK-ACT-01',
    field: 'Nahorkatiya',
    block: 'Block-3 Central Fold',
    status: 'drilling',
    type: 'present',
    currentDepth: 2835, // Actively in Barail Coal-Shale, 10m before hazard zone
    totalDepth: 3650,
    spudDate: '2026-08-12',
    coordinates: {
      lat: 27.2845,
      lng: 95.3421,
      surfaceX: 0,
      surfaceY: 0
    },
    distanceFromActiveKm: 0,
    riskLevel: 'high',
    operator: 'Oil India Limited (OIL)',
    rigName: 'OIL Rig F-3000 HP Drillmaster',
    targetFormation: 'Barail / Kopili Sands',
    casingProgram: [
      { size: '20"', shoeDepth: 120, casingType: 'Conductor', cementTop: 0, status: 'Set' },
      { size: '13-3/8"', shoeDepth: 850, casingType: 'Surface', cementTop: 0, status: 'Set' },
      { size: '9-5/8"', shoeDepth: 2580, casingType: 'Intermediate', cementTop: 600, status: 'Set' },
      { size: '7"', shoeDepth: 3650, casingType: 'Production', cementTop: 2400, status: 'Planned' }
    ],
    eventsCount: {
      mudLoss: 1,
      kick: 0,
      stuckPipe: 0,
      torqueSpike: 1,
      cementing: 0
    },
    sparklineData: [5, 12, 18, 45, 85, 30, 20],
    trajectoryPoints: [
      { md: 0, tvd: 0, dx: 0, dy: 0 },
      { md: 800, tvd: 798, dx: 2, dy: 4 },
      { md: 1600, tvd: 1590, dx: 12, dy: 24 },
      { md: 2400, tvd: 2375, dx: 38, dy: 72 },
      { md: 2835, tvd: 2802, dx: 65, dy: 110 },
      { md: 3650, tvd: 3590, dx: 110, dy: 190 }
    ]
  },

  // PREVIOUS / HISTORICAL OFFSET WELLS
  {
    id: 'nhk-124',
    name: 'Well NHK-124',
    field: 'Nahorkatiya',
    block: 'Block-3 East Flank',
    status: 'completed',
    type: 'previous',
    currentDepth: 3550,
    totalDepth: 3550,
    spudDate: '2023-04-10',
    completionDate: '2023-07-22',
    coordinates: {
      lat: 27.2910,
      lng: 95.3620,
      surfaceX: 2100,
      surfaceY: 1850
    },
    distanceFromActiveKm: 2.8,
    riskLevel: 'high',
    operator: 'Oil India Limited (OIL)',
    rigName: 'OIL Rig E-2000',
    targetFormation: 'Barail / Kopili Sandstone',
    casingProgram: [
      { size: '20"', shoeDepth: 115, casingType: 'Conductor', cementTop: 0, status: 'Set' },
      { size: '13-3/8"', shoeDepth: 840, casingType: 'Surface', cementTop: 0, status: 'Set' },
      { size: '9-5/8"', shoeDepth: 2595, casingType: 'Intermediate', cementTop: 550, status: 'Set' },
      { size: '7"', shoeDepth: 3550, casingType: 'Production', cementTop: 2350, status: 'Set' }
    ],
    eventsCount: {
      mudLoss: 3,
      kick: 1,
      stuckPipe: 1,
      torqueSpike: 2,
      cementing: 0
    },
    sparklineData: [10, 15, 25, 90, 60, 40, 10],
    trajectoryPoints: [
      { md: 0, tvd: 0, dx: 2100, dy: 1850 },
      { md: 900, tvd: 895, dx: 2110, dy: 1860 },
      { md: 1800, tvd: 1785, dx: 2135, dy: 1890 },
      { md: 2600, tvd: 2570, dx: 2180, dy: 1940 },
      { md: 2845, tvd: 2810, dx: 2210, dy: 1980 },
      { md: 3550, tvd: 3505, dx: 2260, dy: 2040 }
    ]
  },
  {
    id: 'nhk-109',
    name: 'Well NHK-109',
    field: 'Nahorkatiya',
    block: 'Block-3 South Block',
    status: 'completed',
    type: 'previous',
    currentDepth: 3680,
    totalDepth: 3680,
    spudDate: '2022-09-05',
    completionDate: '2022-12-18',
    coordinates: {
      lat: 27.2715,
      lng: 95.3280,
      surfaceX: -1400,
      surfaceY: -1600
    },
    distanceFromActiveKm: 2.1,
    riskLevel: 'high',
    operator: 'Oil India Limited (OIL)',
    rigName: 'OIL Rig F-1400',
    targetFormation: 'Kopili Shale / Sand',
    casingProgram: [
      { size: '20"', shoeDepth: 125, casingType: 'Conductor', cementTop: 0, status: 'Set' },
      { size: '13-3/8"', shoeDepth: 860, casingType: 'Surface', cementTop: 0, status: 'Set' },
      { size: '9-5/8"', shoeDepth: 2565, casingType: 'Intermediate', cementTop: 620, status: 'Set' },
      { size: '7"', shoeDepth: 3680, casingType: 'Production', cementTop: 2380, status: 'Set' }
    ],
    eventsCount: {
      mudLoss: 2,
      kick: 2,
      stuckPipe: 0,
      torqueSpike: 3,
      cementing: 1
    },
    sparklineData: [8, 10, 30, 85, 75, 50, 15],
    trajectoryPoints: [
      { md: 0, tvd: 0, dx: -1400, dy: -1600 },
      { md: 1000, tvd: 995, dx: -1390, dy: -1590 },
      { md: 2000, tvd: 1980, dx: -1360, dy: -1560 },
      { md: 2852, tvd: 2820, dx: -1320, dy: -1510 },
      { md: 3680, tvd: 3625, dx: -1280, dy: -1450 }
    ]
  },
  {
    id: 'mor-18',
    name: 'Well MOR-18',
    field: 'Moran',
    block: 'Moran Deep Anticlinal Zone',
    status: 'completed',
    type: 'previous',
    currentDepth: 3820,
    totalDepth: 3820,
    spudDate: '2021-11-14',
    completionDate: '2022-03-02',
    coordinates: {
      lat: 27.2150,
      lng: 95.0250,
      surfaceX: -8500,
      surfaceY: -6200
    },
    distanceFromActiveKm: 10.5,
    riskLevel: 'medium',
    operator: 'Oil India Limited (OIL)',
    rigName: 'OIL Rig F-3000',
    targetFormation: 'Disang Deep Sediments',
    casingProgram: [
      { size: '20"', shoeDepth: 130, casingType: 'Conductor', cementTop: 0, status: 'Set' },
      { size: '13-3/8"', shoeDepth: 900, casingType: 'Surface', cementTop: 0, status: 'Set' },
      { size: '9-5/8"', shoeDepth: 2650, casingType: 'Intermediate', cementTop: 700, status: 'Set' },
      { size: '7"', shoeDepth: 3820, casingType: 'Production', cementTop: 2500, status: 'Set' }
    ],
    eventsCount: {
      mudLoss: 1,
      kick: 0,
      stuckPipe: 2,
      torqueSpike: 4,
      cementing: 0
    },
    sparklineData: [5, 8, 20, 40, 70, 65, 20],
    trajectoryPoints: [
      { md: 0, tvd: 0, dx: -8500, dy: -6200 },
      { md: 1500, tvd: 1490, dx: -8480, dy: -6180 },
      { md: 2800, tvd: 2760, dx: -8430, dy: -6120 },
      { md: 3820, tvd: 3750, dx: -8380, dy: -6050 }
    ]
  },
  {
    id: 'dul-07',
    name: 'Well DUL-07',
    field: 'Duliajan',
    block: 'Duliajan HQ South',
    status: 'completed',
    type: 'previous',
    currentDepth: 3410,
    totalDepth: 3410,
    spudDate: '2024-01-15',
    completionDate: '2024-04-10',
    coordinates: {
      lat: 27.3200,
      lng: 95.3100,
      surfaceX: 3800,
      surfaceY: -3200
    },
    distanceFromActiveKm: 5.2,
    riskLevel: 'medium',
    operator: 'Oil India Limited (OIL)',
    rigName: 'OIL Rig E-1400',
    targetFormation: 'Barail Oligocene Sands',
    casingProgram: [
      { size: '20"', shoeDepth: 110, casingType: 'Conductor', cementTop: 0, status: 'Set' },
      { size: '13-3/8"', shoeDepth: 820, casingType: 'Surface', cementTop: 0, status: 'Set' },
      { size: '9-5/8"', shoeDepth: 2520, casingType: 'Intermediate', cementTop: 500, status: 'Set' },
      { size: '7"', shoeDepth: 3410, casingType: 'Production', cementTop: 2300, status: 'Set' }
    ],
    eventsCount: {
      mudLoss: 2,
      kick: 0,
      stuckPipe: 0,
      torqueSpike: 1,
      cementing: 2
    },
    sparklineData: [4, 12, 35, 55, 30, 20, 10],
    trajectoryPoints: [
      { md: 0, tvd: 0, dx: 3800, dy: -3200 },
      { md: 1200, tvd: 1195, dx: 3810, dy: -3190 },
      { md: 2450, tvd: 2420, dx: 3840, dy: -3160 },
      { md: 3410, tvd: 3370, dx: 3880, dy: -3110 }
    ]
  },
  {
    id: 'kum-03',
    name: 'Well KUM-03',
    field: 'Kumchai',
    block: 'Thrust Belt Structural High',
    status: 'suspended',
    type: 'previous',
    currentDepth: 4120,
    totalDepth: 4120,
    spudDate: '2020-02-18',
    completionDate: '2020-08-25',
    coordinates: {
      lat: 27.3850,
      lng: 95.4200,
      surfaceX: 9500,
      surfaceY: 8200
    },
    distanceFromActiveKm: 12.6,
    riskLevel: 'critical',
    operator: 'Oil India Limited (OIL)',
    rigName: 'OIL Rig F-3000',
    targetFormation: 'Disang Overpressured Shale',
    casingProgram: [
      { size: '20"', shoeDepth: 140, casingType: 'Conductor', cementTop: 0, status: 'Set' },
      { size: '13-3/8"', shoeDepth: 950, casingType: 'Surface', cementTop: 0, status: 'Set' },
      { size: '9-5/8"', shoeDepth: 2780, casingType: 'Intermediate', cementTop: 800, status: 'Set' },
      { size: '7"', shoeDepth: 4120, casingType: 'Production', cementTop: 2600, status: 'Set' }
    ],
    eventsCount: {
      mudLoss: 4,
      kick: 3,
      stuckPipe: 2,
      torqueSpike: 6,
      cementing: 1
    },
    sparklineData: [15, 20, 45, 75, 95, 85, 90],
    trajectoryPoints: [
      { md: 0, tvd: 0, dx: 9500, dy: 8200 },
      { md: 1500, tvd: 1485, dx: 9540, dy: 8240 },
      { md: 2900, tvd: 2850, dx: 9610, dy: 8310 },
      { md: 4120, tvd: 4040, dx: 9700, dy: 8400 }
    ]
  },
  {
    id: 'nhk-088',
    name: 'Well NHK-088',
    field: 'Nahorkatiya',
    block: 'Block-3 Central Crest',
    status: 'completed',
    type: 'previous',
    currentDepth: 3320,
    totalDepth: 3320,
    spudDate: '2022-01-10',
    completionDate: '2022-03-30',
    coordinates: {
      lat: 27.2800,
      lng: 95.3510,
      surfaceX: 850,
      surfaceY: -450
    },
    distanceFromActiveKm: 1.1,
    riskLevel: 'low',
    operator: 'Oil India Limited (OIL)',
    rigName: 'OIL Rig E-2000',
    targetFormation: 'Barail Main Sand',
    casingProgram: [
      { size: '20"', shoeDepth: 110, casingType: 'Conductor', cementTop: 0, status: 'Set' },
      { size: '13-3/8"', shoeDepth: 830, casingType: 'Surface', cementTop: 0, status: 'Set' },
      { size: '9-5/8"', shoeDepth: 2540, casingType: 'Intermediate', cementTop: 520, status: 'Set' },
      { size: '7"', shoeDepth: 3320, casingType: 'Production', cementTop: 2310, status: 'Set' }
    ],
    eventsCount: {
      mudLoss: 0,
      kick: 0,
      stuckPipe: 0,
      torqueSpike: 1,
      cementing: 0
    },
    sparklineData: [5, 8, 12, 18, 15, 10, 8],
    trajectoryPoints: [
      { md: 0, tvd: 0, dx: 850, dy: -450 },
      { md: 1000, tvd: 995, dx: 855, dy: -445 },
      { md: 2200, tvd: 2185, dx: 870, dy: -430 },
      { md: 3320, tvd: 3290, dx: 890, dy: -410 }
    ]
  }
];

export const DRILLING_INCIDENTS: DrillingIncident[] = [
  {
    id: 'inc-01',
    wellId: 'nhk-124',
    wellName: 'Well NHK-124',
    depth: 2845,
    formation: 'Barail Coal-Shale Sequence',
    type: 'mud_loss',
    severity: 'high',
    title: 'Severe Lost Circulation in Fractured Barail Coal',
    description: 'Encountered high permeability fractured coal seam. Total loss of drilling fluid returns at rate of 22 bbl/hr. Pit level dropped 35 bbls within 12 minutes.',
    durationHours: 36,
    nptCostLakhsINR: 28.5,
    rootCause: 'Sub-hydrostatic formation pressure in depleted coal section combined with dynamic ECD surging.',
    mitigationAction: 'Pumped 40 bbl high-viscosity pill with 25 ppb coarse Nut-Plug and mica flakes. Reduced pump rate to 350 GPM and adjusted mud weight from 1.21 SG to 1.16 SG.',
    date: '2023-05-18',
    resolved: true
  },
  {
    id: 'inc-02',
    wellId: 'nhk-109',
    wellName: 'Well NHK-109',
    depth: 2852,
    formation: 'Barail Coal-Shale Sequence',
    type: 'kick',
    severity: 'critical',
    title: 'High Pressure Gas Influx (Kick)',
    description: 'Pit gain of 14 bbls observed during connection at 2,852m. Shut-in Drill Pipe Pressure (SIDPP) rose to 380 psi; SICP reached 520 psi.',
    durationHours: 48,
    nptCostLakhsINR: 42.0,
    rootCause: 'Drilling into trapped pocket of coalbed methane gas without adequate overbalance after partial mud loss.',
    mitigationAction: 'Executed Wait and Weight kill method. Circulated out gas bubble with 1.22 SG barite-weighted KCL-PHPA polymer mud. Monitored for secondary influx.',
    date: '2022-10-24',
    resolved: true
  },
  {
    id: 'inc-03',
    wellId: 'mor-18',
    wellName: 'Well MOR-18',
    depth: 3180,
    formation: 'Kopili Formation',
    type: 'stuck_pipe',
    severity: 'high',
    title: 'Mechanically Stuck Pipe in Sloughing Kopili Shale',
    description: 'During wiper trip at 3,180m, drill string experienced 80 klbs overpull and stalled rotation. Annular cuttings pack-off observed.',
    durationHours: 54,
    nptCostLakhsINR: 48.2,
    rootCause: 'Chemical hydration and mechanical shearing of brittle Kopili shale due to insufficient potassium chloride (KCl) inhibition.',
    mitigationAction: 'Spotted 50 bbl lubricating oil-based pipe-freeing pill. Jarred downward with 120 klbs impact. Circulated high-viscosity sweep to clean annular pack-off.',
    date: '2022-01-08',
    resolved: true
  },
  {
    id: 'inc-04',
    wellId: 'dul-07',
    wellName: 'Well DUL-07',
    depth: 2450,
    formation: 'Tipam Sandstone Formation',
    type: 'cementing_issue',
    severity: 'medium',
    title: 'Channeling & Cement Fallback Behind 9-5/8" Casing',
    description: 'CBL-VDL (Cement Bond Log) revealed poor acoustic coupling and micro-annular gas channels between 2,300m and 2,450m.',
    durationHours: 24,
    nptCostLakhsINR: 18.0,
    rootCause: 'Inadequate mud displacement efficiency and lost slurry into high permeability Tipam thief sand.',
    mitigationAction: 'Performed squeeze cementing at 2,410m using thixotropic slurry with microfine silica. Pressure tested successfully to 2,500 psi.',
    date: '2024-02-28',
    resolved: true
  },
  {
    id: 'inc-05',
    wellId: 'kum-03',
    wellName: 'Well KUM-03',
    depth: 2900,
    formation: 'Barail Coal-Shale Sequence',
    type: 'overpressure',
    severity: 'critical',
    title: 'Severe Pore Pressure Gradient Anomaly',
    description: 'Rapid connection gas increase to 1,200 units. ROP doubled suddenly from 4 m/hr to 14 m/hr (drilling break) with background gas spikes.',
    durationHours: 32,
    nptCostLakhsINR: 35.6,
    rootCause: 'Fault-bounded overpressure compartment in thrust belt structural block.',
    mitigationAction: 'Weighted active mud system up from 1.18 SG to 1.34 SG in two stages. Installed continuous degassing unit on mud ditch.',
    date: '2020-04-12',
    resolved: true
  },
  {
    id: 'inc-06',
    wellId: 'oil-nhk-act-01',
    wellName: 'OIL-NHK-ACT-01',
    depth: 2610,
    formation: 'Tipam / Barail Transition',
    type: 'torque_spike',
    severity: 'medium',
    title: 'Erratic Stick-Slip and High Torque',
    description: 'Surface torque fluctuated between 12 kN.m and 28 kN.m while drilling interbedded coal-sand boundary.',
    durationHours: 8,
    nptCostLakhsINR: 6.5,
    rootCause: 'Ledge formation and aggressive bit cutter engagement in variable rock hardness.',
    mitigationAction: 'Reamed interval twice with reduced WOB (8 klbs) and increased rotary speed (110 RPM). Added 2% liquid lubricant to active mud pit.',
    date: '2026-09-24',
    resolved: true
  }
];

export const AI_WARNINGS: AIWarning[] = [
  {
    id: 'warn-01',
    riskType: 'Imminent Severe Lost Circulation',
    incidentType: 'mud_loss',
    probability: 88,
    severity: 'critical',
    depthRange: [2840, 2865],
    formation: 'Barail Coal-Shale Sequence',
    activeDepthProximity: 5, // Just 5 meters ahead of active bit (2835m)
    similarIncidents: [
      {
        wellId: 'nhk-124',
        wellName: 'Well NHK-124 (2.8 km East)',
        depth: 2845,
        description: 'Lost 22 bbl/hr of drilling fluid. Total 120 bbls lost before cure.',
        actionTaken: 'Pumped 40 bbl LCM pill with Nut-Plug & mica; dropped mud weight to 1.16 SG.'
      },
      {
        wellId: 'nhk-109',
        wellName: 'Well NHK-109 (2.1 km South)',
        depth: 2848,
        description: 'Seepage losses escalated into severe dynamic losses of 16 bbl/hr.',
        actionTaken: 'Pre-treated system with 20 ppb medium calcium carbonate blend.'
      }
    ],
    aiExplanation: 'The active drill bit (currently at 2,835m) is within 5 meters of the regionally fractured Barail Coal Seam #4. Historical correlation shows high micro-fracture permeability with sub-hydrostatic pore pressure (0.98 SG equivalent). Any ECD surge above 1.22 SG will induce severe losses.',
    suggestedAction: '1. Reduce flow rate from 550 GPM to 420 GPM to lower annular ECD below 1.18 SG.\n2. Pre-mix 35 bbls of high-viscosity pill with 30 ppb dual-grade Nut-Plug & fibrous LCM in slug pit.\n3. Limit ROP to 6–8 m/hr and avoid aggressive pipe surging during connections.',
    priority: 1,
    acknowledged: false,
    timestamp: '10 mins ago'
  },
  {
    id: 'warn-02',
    riskType: 'Secondary Gas Influx / Kick Vulnerability',
    incidentType: 'kick',
    probability: 74,
    severity: 'high',
    depthRange: [2850, 2875],
    formation: 'Barail Coal-Shale Sequence',
    activeDepthProximity: 15,
    similarIncidents: [
      {
        wellId: 'nhk-109',
        wellName: 'Well NHK-109 (2.1 km South)',
        depth: 2852,
        description: 'Gas kick after mud loss dropped hydrostatic head. SIDPP 380 psi.',
        actionTaken: 'Executed Wait and Weight method; raised mud weight to 1.22 SG.'
      }
    ],
    aiExplanation: 'Depleted coal matrix contains adsorbed methane gas. If mud losses occur at 2,845m and fluid level in the annulus drops, the hydrostatic pressure will fall below the gas desorption threshold, triggering a secondary gas kick.',
    suggestedAction: '1. Keep trip tank constantly on hole during any loss of returns to monitor fluid level.\n2. Ensure Barite stock (minimum 400 sacks) is ready at hopper for rapid weighting if required.\n3. Test remote BOP choke manifold and confirm degasser operational readiness.',
    priority: 2,
    acknowledged: false,
    timestamp: '25 mins ago'
  },
  {
    id: 'warn-03',
    riskType: 'Shale Sloughing & Mechanical Stuck Pipe Risk',
    incidentType: 'stuck_pipe',
    probability: 62,
    severity: 'medium',
    depthRange: [3150, 3220],
    formation: 'Kopili Formation',
    activeDepthProximity: 315,
    similarIncidents: [
      {
        wellId: 'mor-18',
        wellName: 'Well MOR-18 (10.5 km West)',
        depth: 3180,
        description: 'Pack-off stuck pipe caused by sloughing reactive Kopili shale. 54 hrs NPT.',
        actionTaken: 'Spotted oil-based freeing pill; raised KCl salinity to 7%.'
      }
    ],
    aiExplanation: 'The Kopili shale section contains highly smectitic, reactive clay platelets. Offset well telemetry indicates high overpull during connections when mud inhibition dropped below 5% KCl concentration.',
    suggestedAction: '1. Plan mud conditioning prior to drilling 9-5/8" shoe at 2,580m.\n2. Maintain KCl concentration at 6.5–7.0% wt and PHPA polymer encapsulation at 1.5 ppb.\n3. Conduct short wiper trips every 90m drilled in Kopili.',
    priority: 3,
    acknowledged: false,
    timestamp: '1 hour ago'
  },
  {
    id: 'warn-04',
    riskType: 'Micro-Annular Cement Channeling Risk',
    incidentType: 'cementing_issue',
    probability: 45,
    severity: 'low',
    depthRange: [2400, 2550],
    formation: 'Tipam Sandstone Formation',
    activeDepthProximity: 0, // In upper section
    similarIncidents: [
      {
        wellId: 'dul-07',
        wellName: 'Well DUL-07 (5.2 km North)',
        depth: 2450,
        description: 'Poor CBL bond due to thief sand slurry loss.',
        actionTaken: 'Microfine squeeze cementing required.'
      }
    ],
    aiExplanation: 'Tipam Sandstone intervals show variable permeability with potential for cement slurry invasion and fallback before setting.',
    suggestedAction: '1. Use thixotropic lead slurry with gas-tight fluid loss additive (<30 ml/30min API).\n2. Run centralizers at 1 per joint through Tipam sands.',
    priority: 4,
    acknowledged: true,
    timestamp: '4 hours ago'
  }
];

export const CREW_MEMBERS: CrewMember[] = [
  {
    id: 'crew-01',
    name: 'B. K. Gogoi',
    role: 'Company Man',
    phone: '+91 94350 12845',
    email: 'bk_gogoi@oilindia.in',
    wellsWorked: ['Well NHK-124', 'Well NHK-088', 'OIL-NHK-ACT-01'],
    field: 'Nahorkatiya / Duliajan',
    experienceYears: 24,
    activePeriod: '2001 - Present',
    notableAchievement: 'Successfully resolved 22 bbl/hr catastrophic mud loss in NHK-124 using specialized Nut-Plug LCM recipe with zero stuck pipe NPT.',
    avatarInitials: 'BG'
  },
  {
    id: 'crew-02',
    name: 'Dr. Anita Phukan',
    role: 'Lead Petrophysicist',
    phone: '+91 94351 88421',
    email: 'anita_phukan@oilindia.in',
    wellsWorked: ['Well NHK-124', 'Well NHK-109', 'Well KUM-03', 'OIL-NHK-ACT-01'],
    field: 'Assam-Arakan Basin HQ',
    experienceYears: 18,
    activePeriod: '2007 - Present',
    notableAchievement: 'Pioneered Barail coal seam correlation model reducing formation boundary uncertainty from ±45m to ±6m across Nahorkatiya blocks.',
    avatarInitials: 'AP'
  },
  {
    id: 'crew-03',
    name: 'Tsering Dorjee',
    role: 'Drilling Superintendent',
    phone: '+91 98640 44290',
    email: 't_dorjee@oilindia.in',
    wellsWorked: ['Well KUM-03', 'Well MOR-18'],
    field: 'Moran / Kumchai Complex',
    experienceYears: 28,
    activePeriod: '1997 - Present',
    notableAchievement: 'Managed deep high-pressure well control incident in KUM-03, circulating out 1,200 units gas kick safely under OISD-189 protocols.',
    avatarInitials: 'TD'
  },
  {
    id: 'crew-04',
    name: 'Ranjan K. Saikia',
    role: 'Chief Mud Engineer',
    phone: '+91 94352 91830',
    email: 'rk_saikia@oilindia.in',
    wellsWorked: ['Well NHK-109', 'Well DUL-07', 'OIL-NHK-ACT-01'],
    field: 'Nahorkatiya Operations',
    experienceYears: 16,
    activePeriod: '2009 - Present',
    notableAchievement: 'Formulated low-damage KCL-PHPA glycol polymer system preventing shale hydration across 600m of troublesome Kopili formations.',
    avatarInitials: 'RS'
  },
  {
    id: 'crew-05',
    name: 'Manish Sharma',
    role: 'Senior Toolpusher',
    phone: '+91 94355 60719',
    email: 'manish_sharma@oilindia.in',
    wellsWorked: ['Well NHK-124', 'Well MOR-18'],
    field: 'Nahorkatiya',
    experienceYears: 21,
    activePeriod: '2004 - Present',
    notableAchievement: 'Achieved 4,200 operating hours without Lost Time Incident (LTI); expert in BHA vibration mitigation and downhole reaming.',
    avatarInitials: 'MS'
  },
  {
    id: 'crew-06',
    name: 'Debojit Borah',
    role: 'Directional Driller',
    phone: '+91 98642 77150',
    email: 'd_borah@oilindia.in',
    wellsWorked: ['Well DUL-07', 'OIL-NHK-ACT-01'],
    field: 'Duliajan & Nahorkatiya',
    experienceYears: 12,
    activePeriod: '2013 - Present',
    notableAchievement: 'Maintained dogleg severity under 2.5 deg/30m across S-shaped directional profile hitting 15m geological target window.',
    avatarInitials: 'DB'
  }
];

export const WELL_DOCUMENTS: WellDocument[] = [
  {
    id: 'doc-01',
    wellId: 'nhk-124',
    title: 'NHK-124 End of Well Report (WCR) – Geological & Drilling Summary',
    type: 'WCR',
    date: '2023-08-10',
    pageCount: 148,
    fileSizeBytes: '14.2 MB',
    merkleHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'doc-02',
    wellId: 'nhk-124',
    title: 'Daily Drilling Report #42 – Lost Circulation Event at 2,845m',
    type: 'DDR',
    date: '2023-05-18',
    pageCount: 6,
    fileSizeBytes: '1.8 MB',
    merkleHash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
  },
  {
    id: 'doc-03',
    wellId: 'nhk-109',
    title: 'NHK-109 Well Completion Dossier & Casing Cementing Verification',
    type: 'WCR',
    date: '2023-01-05',
    pageCount: 182,
    fileSizeBytes: '22.6 MB',
    merkleHash: '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'
  },
  {
    id: 'doc-04',
    wellId: 'nhk-109',
    title: 'Well Control Kill Sheet & Influx Analysis Report (2,852m Gas Kick)',
    type: 'DDR',
    date: '2022-10-25',
    pageCount: 12,
    fileSizeBytes: '3.4 MB',
    merkleHash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35'
  },
  {
    id: 'doc-05',
    wellId: 'mor-18',
    title: 'MOR-18 Daily Drilling Log – Stuck Pipe Freeing Operations',
    type: 'DDR',
    date: '2022-01-09',
    pageCount: 8,
    fileSizeBytes: '2.1 MB',
    merkleHash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce'
  },
  {
    id: 'doc-06',
    wellId: 'dul-07',
    title: 'DUL-07 CBL-VDL Acoustic Cement Bond Evaluation Report',
    type: 'CementingReport',
    date: '2024-03-02',
    pageCount: 24,
    fileSizeBytes: '8.5 MB',
    merkleHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
  }
];

export const QUICK_STATS: QuickStats = {
  activeWells: 1, // OIL-NHK-ACT-01
  criticalAlerts: 2, // Imminent Mud Loss & Gas Kick Look-Ahead
  wellsWithEvents: 5,
  totalHistoricalWells: 48
};

// Generates synchronized depth telemetry for comparison
export function generateDepthTelemetry(isLive: boolean, wellId: string): TelemetryPoint[] {
  const points: TelemetryPoint[] = [];
  const maxDepth = isLive ? 2835 : 3550;
  
  for (let d = 2600; d <= maxDepth; d += 25) {
    const isLossZone = d >= 2840 && d <= 2865;
    
    points.push({
      depth: d,
      rop: isLossZone ? (isLive ? 6.2 : 4.1) : Number((8.5 + Math.sin(d / 100) * 3).toFixed(1)),
      wob: isLossZone ? 10.5 : Number((14 + Math.cos(d / 80) * 4).toFixed(1)),
      torque: isLossZone ? 24.5 : Number((15 + Math.sin(d / 50) * 5).toFixed(1)),
      rpm: 105,
      mudWeightIn: isLossZone && !isLive ? 1.16 : 1.18,
      mudWeightOut: isLossZone ? 1.14 : 1.18,
      spp: isLossZone ? 2850 : 3100,
      ecd: isLossZone ? 1.21 : 1.23,
      gasUnits: isLossZone ? 280 : 45,
      flowIn: isLossZone ? 450 : 540,
      flowOut: isLossZone ? (isLive ? 410 : 280) : 540
    });
  }
  return points;
}
