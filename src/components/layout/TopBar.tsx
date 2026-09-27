import React from 'react';
import { Search, Bell, Radio, User, ChevronDown, LogOut } from 'lucide-react';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

interface TopBarProps {
  activeWarningCount: number;
  onOpenSearch: () => void;
  onOpenWarnings: () => void;
  currentUser?: {
    name: string;
    role: string;
    email?: string;
    avatarInitials?: string;
  };
  onSignOut?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeWarningCount,
  onOpenSearch,
  onOpenWarnings,
  currentUser,
  onSignOut,
}) => {
  return (
    <header className="h-16 bg-primary text-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-md">
      {/* Brand & System Title */}
      <div className="flex items-center gap-3">
        {/* Derrick Icon SVG */}
        <div className="w-9 h-9 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L4 22h16L12 2z" />
            <path d="M8 12h8" />
            <path d="M6 17h12" />
            <path d="M12 2v20" />
          </svg>
        </div>

        <div className="flex items-center gap-2.5">
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            NWIS
          </h1>
          <span className="text-white/40 font-light text-sm">|</span>
          <span className="hidden sm:inline text-xs text-slate-200 font-medium">
            Nearby Wells Intelligence System
          </span>
          <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-blue-900/60 text-blue-200 border border-blue-400/30">
            Standalone Decision-Support alongside eRTMAC
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-900 shadow-xs">
            DEMO PROTOTYPE
          </span>
          <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-white/10 text-slate-200 border border-white/15">
            Synthetic Data
          </span>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-xl mx-8">
        <button
          onClick={onOpenSearch}
          className="w-full h-10 px-3.5 bg-primary-hover/70 hover:bg-primary-hover border border-white/15 rounded-mild flex items-center justify-between text-slate-300 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-300" />
            <span className="text-slate-300">Search all wells, formations, incidents, crew...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-slate-300 bg-white/10 border border-white/20 rounded">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Telemetry, Notification Bell & User */}
      <div className="flex items-center gap-4">
        {/* eRTMAC Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/20 rounded-mild text-xs text-emerald-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>eRTMAC: CONNECTED</span>
        </div>

        {/* Theme Switcher (Light <-> Dark Black) */}
        <ThemeSwitcher />

        {/* Proactive Risk Warnings Bell */}
        <button
          onClick={onOpenWarnings}
          title="Active Risk Warnings"
          className="relative p-2 text-slate-200 hover:text-white hover:bg-white/10 rounded-mild transition-colors focus:outline-none"
        >
          <Bell className="w-5 h-5" />
          {activeWarningCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-risk-high text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-primary">
              {activeWarningCount}
            </span>
          )}
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-white/20" />

        {/* User Identity & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-xs font-bold shadow-xs">
              {currentUser?.avatarInitials || 'PB'}
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-semibold text-white truncate max-w-[130px]">
                {currentUser?.name || 'Pranjal Borah'}
              </div>
              <p className="text-[10px] text-slate-300 truncate max-w-[130px]">
                {currentUser?.role || 'Rig Superintendent'}
              </p>
            </div>
          </div>

          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign out to Engineer Landing Portal"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
