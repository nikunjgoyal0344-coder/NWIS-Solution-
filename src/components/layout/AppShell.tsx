import React, { useState } from 'react';
import { TopBar } from './TopBar';
import { Sidebar, NavTab } from './Sidebar';

interface AppShellProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeWarningCount: number;
  onOpenSearch: () => void;
  currentUser?: {
    name: string;
    role: string;
    email?: string;
    avatarInitials?: string;
  };
  onSignOut?: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onSelectTab,
  activeWarningCount,
  onOpenSearch,
  currentUser,
  onSignOut,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-slate-800">
      {/* Top Application Bar */}
      <TopBar
        activeWarningCount={activeWarningCount}
        onOpenSearch={onOpenSearch}
        onOpenWarnings={() => onSelectTab('warnings')}
        currentUser={currentUser}
        onSignOut={onSignOut}
      />

      {/* Main Workspace: Sidebar + Body */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={onSelectTab}
          warningCount={activeWarningCount}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
