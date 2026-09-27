import React, { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { NavTab } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { SiteDirectoryView } from './components/directory/SiteDirectoryView';
import { SubsurfaceMapView } from './components/map/SubsurfaceMapView';
import { MultiWellCorrelationView } from './components/correlation/MultiWellCorrelationView';
import { WarningDataCenterView } from './components/warnings/WarningDataCenterView';
import { CompareView } from './components/compare/CompareView';
import { DocumentIntelligenceView } from './components/documents/DocumentIntelligenceView';
import { LessonsLearnedView } from './components/knowledge/LessonsLearnedView';
import { CrewDirectoryView } from './components/crew/CrewDirectoryView';
import { ComplianceSettingsView } from './components/settings/ComplianceSettingsView';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { ProactiveAlertPopup } from './components/warnings/ProactiveAlertPopup';
import { SiteViewModal } from './components/modal/SiteViewModal';
import { LandingLoginView, EngineerUser } from './components/auth/LandingLoginView';
import { 
  WELLS, 
  FORMATIONS, 
  DRILLING_INCIDENTS, 
  AI_WARNINGS, 
  QUICK_STATS,
  CREW_MEMBERS,
  WELL_DOCUMENTS
} from './data/mockData';
import { Well, DrillingIncident, WellDocument } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  const [compareOffsetWell, setCompareOffsetWell] = useState<Well | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Authentication State & Engineer Profile
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<EngineerUser>({
    name: 'Pranjal Borah',
    role: 'Senior Toolpusher / Rig Superintendent',
    email: 'p_borah@oilindia.in',
    rigId: 'Rig F-3000 HP Drillmaster (Nahorkatiya)',
    avatarInitials: 'PB'
  });

  // Dynamic state for Wells, Incidents, and Documents (supports scanned document ingestion)
  const [wellsList, setWellsList] = useState<Well[]>(WELLS);
  const [incidentsList, setIncidentsList] = useState<DrillingIncident[]>(DRILLING_INCIDENTS);
  const [documentsList, setDocumentsList] = useState<WellDocument[]>(WELL_DOCUMENTS);
  
  // Proactive popup state (dismissible)
  const [dismissedAlert, setDismissedAlert] = useState(false);

  const activeWell = wellsList.find(w => w.type === 'present') || wellsList[0];
  const criticalWarning = AI_WARNINGS[0];
  const unacknowledgedWarnings = AI_WARNINGS.filter(w => !w.acknowledged).length;

  const handleSelectWell = (well: Well) => {
    setSelectedWell(well);
  };

  const handleCompareWithActive = (well: Well) => {
    setCompareOffsetWell(well);
    setCurrentTab('compare');
  };

  const handleCompareByName = (wellName: string) => {
    const found = wellsList.find(w => wellName.includes(w.name) || w.name.includes(wellName));
    if (found) {
      setCompareOffsetWell(found);
      setCurrentTab('compare');
    }
  };

  const handleLocateOnMap = (well: Well) => {
    setCurrentTab('map');
  };

  // Ingest scanned historical well into 3D Map, Correlation, and Directory
  const handleIngestScannedWell = (newWell: Well, newIncident?: DrillingIncident, newDoc?: WellDocument) => {
    setWellsList(prev => {
      const existingIdx = prev.findIndex(w => w.id === newWell.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newWell;
        return updated;
      }
      return [newWell, ...prev];
    });

    if (newIncident) {
      setIncidentsList(prev => {
        const exists = prev.some(i => i.id === newIncident.id);
        if (exists) return prev;
        return [newIncident, ...prev];
      });
    }

    if (newDoc) {
      setDocumentsList(prev => {
        const exists = prev.some(d => d.id === newDoc.id);
        if (exists) return prev;
        return [newDoc, ...prev];
      });
    }
  };

  // 1. Render Landing & Engineer Sign-In Portal when not authenticated
  if (!isAuthenticated) {
    return (
      <LandingLoginView
        onLogin={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  // 2. Main Authenticated NWIS Operations Shell
  return (
    <AppShell
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      activeWarningCount={unacknowledgedWarnings}
      onOpenSearch={() => setIsSearchOpen(true)}
      currentUser={currentUser}
      onSignOut={() => setIsAuthenticated(false)}
    >
      {/* 1. DASHBOARD */}
      {currentTab === 'dashboard' && (
        <DashboardView
          stats={QUICK_STATS}
          wells={wellsList}
          warnings={AI_WARNINGS}
          onSelectWell={handleSelectWell}
          onCompareWithActive={handleCompareWithActive}
          onNavigateToTab={setCurrentTab}
        />
      )}

      {/* 2. SITE DIRECTORY */}
      {currentTab === 'directory' && (
        <SiteDirectoryView
          wells={wellsList}
          onSelectWell={handleSelectWell}
          onCompareWithActive={handleCompareWithActive}
        />
      )}

      {/* 3. 3D SUBSURFACE MAP */}
      {currentTab === 'map' && (
        <SubsurfaceMapView
          wells={wellsList}
          formations={FORMATIONS}
          incidents={incidentsList}
          onSelectWell={handleSelectWell}
        />
      )}

      {/* 4. MULTI-WELL STRATIGRAPHIC CORRELATION */}
      {currentTab === 'correlation' && (
        <MultiWellCorrelationView
          wells={wellsList}
          activeWell={activeWell}
          incidents={incidentsList}
          onSelectWell={handleSelectWell}
        />
      )}

      {/* 5. WARNING DATA CENTER */}
      {currentTab === 'warnings' && (
        <WarningDataCenterView
          warnings={AI_WARNINGS}
          activeWell={activeWell}
          onCompareWithOffset={handleCompareByName}
          onSelectWell={handleSelectWell}
        />
      )}

      {/* 6. COMPARE VIEW */}
      {currentTab === 'compare' && (
        <CompareView
          wells={wellsList}
          activeWell={activeWell}
          initialOffsetWell={compareOffsetWell}
          onSelectWellDetails={handleSelectWell}
        />
      )}

      {/* 7. DOCUMENT INTELLIGENCE & OCR STUDIO */}
      {currentTab === 'documents' && (
        <DocumentIntelligenceView
          onIngestScannedWell={handleIngestScannedWell}
          onNavigateToTab={setCurrentTab}
        />
      )}

      {/* 8. LESSONS LEARNED & KNOWLEDGE REPOSITORY */}
      {currentTab === 'knowledge' && (
        <LessonsLearnedView
          onSelectWellName={handleCompareByName}
        />
      )}

      {/* 9. CREW CONTACTS */}
      {currentTab === 'crew' && (
        <CrewDirectoryView
          crew={CREW_MEMBERS}
          onSelectWellName={handleCompareByName}
        />
      )}

      {/* 10. COMPLIANCE & SETTINGS */}
      {currentTab === 'settings' && (
        <ComplianceSettingsView />
      )}

      {/* PROACTIVE LOOK-AHEAD POPUP */}
      {!dismissedAlert && criticalWarning && (
        <ProactiveAlertPopup
          warning={criticalWarning}
          onDismiss={() => setDismissedAlert(true)}
          onViewWarningCenter={() => {
            setCurrentTab('warnings');
            setDismissedAlert(true);
          }}
          onCompareWithOffset={(offsetName) => {
            handleCompareByName(offsetName);
            setDismissedAlert(true);
          }}
        />
      )}

      {/* GLOBAL SITE VIEW MODAL */}
      {selectedWell && (
        <SiteViewModal
          well={selectedWell}
          onClose={() => setSelectedWell(null)}
          onCompareWithActive={handleCompareWithActive}
          onLocateOnMap={handleLocateOnMap}
        />
      )}

      {/* GLOBAL OMNI-SEARCH MODAL */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        wells={wellsList}
        formations={FORMATIONS}
        incidents={incidentsList}
        crew={CREW_MEMBERS}
        documents={documentsList}
        onSelectWell={handleSelectWell}
        onNavigateToTab={setCurrentTab}
      />
    </AppShell>
  );
}
