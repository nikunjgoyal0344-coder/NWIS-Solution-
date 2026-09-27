import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Compass, 
  AlertTriangle, 
  GitCompare, 
  GitBranch,
  Scan,
  BookOpen,
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  HardDrive
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'directory' 
  | 'map' 
  | 'correlation'
  | 'warnings' 
  | 'compare' 
  | 'documents'
  | 'knowledge'
  | 'crew' 
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  warningCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  warningCount,
  collapsed,
  onToggleCollapse,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'directory' as NavTab, label: 'Site Directory', icon: FolderKanban },
    { id: 'map' as NavTab, label: '3D Subsurface Map', icon: Compass },
    { id: 'correlation' as NavTab, label: 'Stratigraphic & Logs', icon: GitBranch },
    { 
      id: 'warnings' as NavTab, 
      label: 'Warning Data Center', 
      icon: AlertTriangle,
      badge: warningCount > 0 ? warningCount : undefined,
      badgeColor: 'bg-risk-high text-white'
    },
    { id: 'compare' as NavTab, label: 'Compare View', icon: GitCompare },
    { id: 'documents' as NavTab, label: 'Document OCR & NLP', icon: Scan },
    { id: 'knowledge' as NavTab, label: 'Lessons Learned', icon: BookOpen },
    { id: 'crew' as NavTab, label: 'Crew Contacts', icon: Users },
    { id: 'settings' as NavTab, label: 'Compliance & Settings', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-200 z-20 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Items */}
      <div className="py-4">
        <div className="px-3 mb-2 flex items-center justify-between">
          {!collapsed && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Operations
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-auto"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-mild text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                
                {!collapsed && item.badge && (
                  <span className={`ml-auto px-1.5 py-0.2 text-[10px] font-bold rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge && (
                  <span className="w-2 h-2 rounded-full bg-risk-high absolute top-2 right-2" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer: Rig Air-Gapped Mode Status */}
      <div className="p-3 border-t border-slate-200">
        <div className={`p-2 bg-slate-50 border border-slate-200 rounded-mild text-slate-600 ${collapsed ? 'text-center' : ''}`}>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-primary shrink-0" />
            {!collapsed && (
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-700">Prototype Demo Mode</p>
                <p className="text-[10px] text-slate-500">Synthetic Simulation Data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
