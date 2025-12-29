
import React, { useId } from 'react';
import { PhoneTheme } from '../types';

interface PhoneFrameProps {
  children: React.ReactNode;
  battery: number;
  theme: PhoneTheme;
  className?: string;
  scale?: number;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, battery, theme, className = "", scale = 1 }) => {
  const componentId = useId().replace(/:/g, "");
  const scopeClass = `phone-scope-${componentId}`;

  return (
    <div 
      className={`relative mx-auto w-full max-w-[380px] h-[800px] rounded-[60px] border-[12px] shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${scopeClass} ${className}`}
      style={{ 
        borderColor: `var(--theme-border-color)`, 
        backgroundColor: `var(--theme-bg-color)`,
        transform: `scale(${scale})`,
        transformOrigin: 'top center'
      }}
    >
      
      {/* Dynamic CSS Variables scoped to this specific component instance */}
      <style>{`
        .${scopeClass} {
          --theme-primary: ${theme.colors.primary};
          --theme-secondary: ${theme.colors.secondary};
          --theme-accent: ${theme.colors.accent};
          --theme-bg-color: ${theme.id === 'nexus' || theme.id === 'cyberpunk' || theme.id === 'stealth' ? '#020617' : theme.id === 'y2k' ? '#fff1f2' : '#020617'};
          --theme-panel-color: ${theme.id === 'nexus' || theme.id === 'cyberpunk' || theme.id === 'stealth' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
          --theme-border-color: ${theme.id === 'nexus' || theme.id === 'stealth' ? '#0f172a' : theme.id === 'y2k' ? '#fecdd3' : theme.id === 'cyberpunk' ? '#eab308' : '#0f172a'};
          --theme-text-color: ${theme.id === 'nexus' || theme.id === 'cyberpunk' || theme.id === 'stealth' ? '#ffffff' : '#831843'};
          --theme-muted-color: ${theme.id === 'nexus' || theme.id === 'cyberpunk' || theme.id === 'stealth' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(131, 24, 67, 0.5)'};
        }

        /* Ensure standard tailwind colors still work but prioritize theme vars for our custom UI */
        .${scopeClass} .text-theme-primary { color: var(--theme-primary); }
        .${scopeClass} .bg-theme-primary { background-color: var(--theme-primary); }
      `}</style>

      {/* Notch */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 rounded-b-3xl z-50 flex items-center justify-center transition-colors duration-500`}
           style={{ backgroundColor: `var(--theme-border-color)` }}>
        <div className="w-12 h-1 bg-white/10 rounded-full"></div>
      </div>

      {/* Status Bar */}
      <div className="px-10 py-4 flex justify-between items-center text-[10px] font-bold z-40 bg-transparent"
           style={{ color: `var(--theme-text-color)` }}>
        <span>9:41</span>
        <div className="flex gap-2 items-center">
          <i className="fas fa-signal"></i>
          <i className="fas fa-wifi"></i>
          <div className="flex items-center gap-1 border rounded px-1 py-0.5" style={{ borderColor: `var(--theme-muted-color)` }}>
             <span>{battery}%</span>
             <div className="w-3 h-1.5 bg-current rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col transition-colors duration-500"
           style={{ backgroundColor: `var(--theme-bg-color)`, color: `var(--theme-text-color)` }}>
        {children}
      </div>

      {/* Home Indicator */}
      <div className="h-10 flex items-center justify-center" style={{ backgroundColor: `var(--theme-bg-color)` }}>
        <div className="w-32 h-1 rounded-full" style={{ backgroundColor: `var(--theme-muted-color)` }}></div>
      </div>
    </div>
  );
};

export default PhoneFrame;
