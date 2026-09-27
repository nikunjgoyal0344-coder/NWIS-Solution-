# Nearby Wells Intelligence System (NWIS)

> **Expected Outcome / Solution Mandate:**  
> **Develop an AI/ML-enabled Nearby Wells Intelligence System (NWIS) that acts as a standalone decision-support platform alongside eRTMAC that has institutional memory.**

---

## 1. Executive Overview

During drilling operations in geologically complex fields such as the **Upper Assam Basin (Nahorkatiya & Duliajan fields)**, drilling crews and real-time monitoring engineers frequently encounter high-risk downhole hazards:
- **Severe Lost Circulation** (especially in depleted/fractured Barail Coal-Shale sequences)
- **Gas Kicks & Wellbore Influxes** (pore-pressure transitions into Kopili Shale)
- **Differential & Mechanical Pipe Sticking** (Tipam Sandstone and sloughing clays)
- **Severe Torque Spikes & Vibration**

While modern telemetry centers (such as OIL's **eRTMAC** — real-time monitoring and control center) stream high-frequency surface and MWD/LWD telemetry, telemetry alone lacks **contextual institutional memory**. Decades of hard-won drilling knowledge, offset Well Completion Reports (WCR), Daily Drilling Reports (DDR), remedial mud recipes, and veteran crew contact records often remain trapped in static, unindexed PDFs or legacy archives.

**NWIS** bridges this critical gap as an **independent, standalone decision-support platform** operating alongside eRTMAC. It ingests historical and active well datasets, geomechanically correlates offset wells, and acts as an AI-powered look-ahead early warning engine.

---

## 2. Core Pillars of the Solution

```
+---------------------------------------------------------------------------------------------------+
|                                  ACTIVE DRILLING (eRTMAC Stream)                                 |
|                                     Well: OIL-NHK-ACT-01 (Bit: 2,835m)                            |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                         NWIS: STANDALONE DECISION-SUPPORT PLATFORM                               |
|                                                                                                   |
|  1. Institutional Memory Engine                 2. AI Look-Ahead Proactive Warnings              |
|     - OCR & NLP ingestion of WCR/DDR PDFs          - Safe Mud Window & Loss Prediction           |
|     - Merkle SHA-256 Document Provenance           - Bit Depth Simulator (Look-Ahead 50m)        |
|     - Veteran Crew Directory & Lessons Learned     - Direct mitigation recipes (LCM, pills)      |
|                                                                                                   |
|  3. 3D Subsurface Digital Twin (WebGL)          4. Multi-Well Stratigraphic Correlation           |
|     - True 3D Wellbores & Strata Horizons          - Depth-aligned cross-section columns         |
|     - Interactive Depth Slicer (0 - 3,650m)        - Auto-integrates uploaded scanned sites      |
|     - Offset proximity pins & hazard cones         - Real-time lithology & petrophysical logs    |
+---------------------------------------------------------------------------------------------------+
```

### Pillar I: Institutional Memory & Scanned Document Intelligence
- **Automated Ingestion**: Ingests scanned historical dossiers (PDF, TIFF, LAS, Images) with multi-threaded deskew and OCR extraction.
- **Entity Extraction**: Automatically structures lithology tops, casing shoes, pre-loss mud weights, LCM pill recipes, and NPT costs.
- **Instant Digital Twin Projection**: Once ingested, historical sites immediately project into the 3D Subsurface Map and Multi-Well Correlation cross-section.

### Pillar II: Standalone Decision-Support Alongside eRTMAC
- Operates independently or in tandem with live eRTMAC WITSML/OPC-UA telemetry streams.
- Provides **proactive look-ahead hazard warnings** 10m to 50m prior to penetrating known offset loss horizons.
- Evaluates operational parameters (ECD, Mud Weight, ROP, SPP) against historical offset safe margins.

### Pillar III: 3D Subsurface & Correlation Digital Twin
- Interactive Three.js WebGL subsurface engine visualizing ground terrain, formation horizons, trajectory tubes, and depth ruler pillars.
- Interactive depth navigator slider from surface ($0\text{m}$) to Target Depth ($3,650\text{m}$).
- Multi-well cross-section display correlating active wells with nearby offset wells.

---

## 3. Technology Stack

- **Frontend & Rendering**: React 18, TypeScript, Vite 6, Tailwind CSS, Three.js (WebGL).
- **Design System**: Industrial Light Enterprise Theme (`#1E3A5F` Deep Professional Blue, `#F8FAFC` Soft Off-White canvas, Pure White cards, Slate typography).
- **Typography**: IBM Plex Sans.
- **Compliance & Security**: OISD-STD-189, IEC 62443 SL-4, MoPNG DLP Masking, SHA-256 Merkle Provenance.

---

## 4. Getting Started

### Prerequisites
- Node.js 18+ / npm

### Installation & Execution
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173/` in your browser.

### Production Build
```bash
npm run build
```
Builds cleanly with 0 TypeScript or bundling errors.

---

*Note: Developed as a high-fidelity prototype and demo system using synthetic simulation data representing typical Upper Assam Basin lithology.*
