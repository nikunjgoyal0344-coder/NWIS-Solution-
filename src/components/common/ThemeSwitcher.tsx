import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      aria-label="Toggle Theme"
      className={`relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-mild text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 select-none ${
        isDark
          ? 'bg-[#1E293B] hover:bg-[#334155] text-[#F1F5F9] border border-[#334155] shadow-xs'
          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-xs'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-[#3B82F6] transition-transform duration-200 rotate-0" />
        ) : (
          <Sun className="w-4 h-4 text-amber-300 transition-transform duration-200 rotate-0" />
        )}
      </div>

      {showLabel && (
        <span className="text-[11px] font-medium tracking-wide">
          {isDark ? 'Dark Theme' : 'Light Mode'}
        </span>
      )}
    </button>
  );
};
