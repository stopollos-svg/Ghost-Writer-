
import React, { useState, useEffect } from 'react';
import PhoneFrame from './components/PhoneFrame';
import Workstation from './components/Workstation';
import { GameState, ReactionResponse, Brief, ThemeID, PhoneTheme } from './types';
import { LEVELS, THEMES } from './constants';

const MAX_ENERGY = 100;
const ENERGY_RECOVERY_MS = 60000; // 1 energy per minute
const ENERGY_COST_PER_LEVEL = 25;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    money: 1250,
    reputation: 65,
    energy: 100,
    dramaLevel: 0,
    currentLevelIndex: 0,
    unlockedSpicy: false,
    activeEvent: 'SEASONAL',
    currentTheme: 'y2k',
    unlockedThemes: ['y2k'],
  });

  const [screen, setScreen] = useState<'home' | 'game' | 'result' | 'themes'>('home');
  const [lastResult, setLastResult] = useState<ReactionResponse | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ENERGY_RECOVERY_MS / 1000);
  const [previewThemeID, setPreviewThemeID] = useState<ThemeID>(gameState.currentTheme);

  // Time-based Energy Recovery
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.energy < MAX_ENERGY) {
          return { ...prev, energy: Math.min(MAX_ENERGY, prev.energy + 1) };
        }
        return prev;
      });
      setTimeLeft(ENERGY_RECOVERY_MS / 1000);
    }, ENERGY_RECOVERY_MS);

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : ENERGY_RECOVERY_MS / 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timerInterval);
    };
  }, []);

  const currentTheme = THEMES.find(t => t.id === gameState.currentTheme) || THEMES[0];
  const previewTheme = THEMES.find(t => t.id === previewThemeID) || currentTheme;
  const currentLevel = LEVELS[gameState.currentLevelIndex];

  const handleLevelComplete = (result: ReactionResponse) => {
    setLastResult(result);
    setGameState(prev => ({
      ...prev,
      money: prev.money + 500 + (result.isViral ? 1000 : 0),
      reputation: Math.max(0, Math.min(100, prev.reputation + result.reputationImpact)),
      energy: Math.max(0, prev.energy - ENERGY_COST_PER_LEVEL),
      dramaLevel: Math.min(100, prev.dramaLevel + result.dramaImpact),
      unlockedSpicy: false
    }));
    setScreen('result');
  };

  const nextLevel = () => {
    if (gameState.currentLevelIndex < LEVELS.length - 1) {
      setGameState(prev => ({ ...prev, currentLevelIndex: prev.currentLevelIndex + 1 }));
      setScreen('game');
    } else {
      setScreen('home');
    }
  };

  const handleDailyTrend = () => {
    const trends = [
      { name: "AI Boyfriend Scandal", drama: "Viral AI Boyfriend caught texting ex-users." },
      { name: "Quiet Quitting TikTok", drama: "Employee accidentally 'Reply All' to resigning email." },
      { name: "Metaverse Real Estate", drama: "Landlord trying to evict virtual tenant for 'bad vibes'." }
    ];
    const trend = trends[Math.floor(Math.random() * trends.length)];
    alert(`DAILY TREND: ${trend.name}\n\n${trend.drama}\n\nNew levels based on this trend are now live!`);
  };

  const handleRechargeAd = () => {
    setIsCharging(true);
    // Simulate a 3-second "ad"
    setTimeout(() => {
      setGameState(prev => ({ ...prev, energy: Math.min(MAX_ENERGY, prev.energy + 50) }));
      setIsCharging(false);
      alert("Nexus Battery Charged! +50 Energy added.");
    }, 3000);
  };

  const buyTheme = (theme: PhoneTheme) => {
    if (gameState.unlockedThemes.includes(theme.id)) {
      setGameState(prev => ({ ...prev, currentTheme: theme.id }));
      return;
    }
    if (gameState.money >= theme.price) {
      setGameState(prev => ({
        ...prev,
        money: prev.money - theme.price,
        unlockedThemes: [...prev.unlockedThemes, theme.id],
        currentTheme: theme.id
      }));
    } else {
      alert("Insufficient Nexus Credit!");
    }
  };

  // Helper to format the reaction text with highlighted participants
  const renderFormattedReaction = (text: string) => {
    const participants: Record<string, string> = {
      'Follower69': 'text-fuchsia-400',
      'Boyfriend': 'text-cyan-400',
      'Brand Manager': 'text-amber-400',
      'Followers': 'text-emerald-400',
      'The Followers': 'text-emerald-400',
      'Ex': 'text-rose-400',
      'Toxic Ex': 'text-rose-400',
      'Boss': 'text-sky-400',
      'The Boss': 'text-sky-400',
      'Tiffany': 'text-theme-primary',
      'Sarah': 'text-theme-primary',
      'Tim': 'text-theme-primary'
    };

    // Split by lines to handle each speaker
    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
      // Look for "Name: Message" or "[Name]: Message"
      const match = line.match(/^(\[?[\w\s\d]+\]?:)(.*)$/);
      
      if (match) {
        const fullLabel = match[1];
        const content = match[2];
        const cleanName = fullLabel.replace(/[\[\]:]/g, '').trim();
        const colorClass = participants[cleanName] || 'text-theme-primary';

        return (
          <div key={lineIdx} className="mb-4 last:mb-0">
            <span className={`${colorClass} font-black uppercase text-[10px] tracking-[0.2em] block mb-1`}>
              {fullLabel}
            </span>
            <span className="opacity-95 leading-relaxed">{content}</span>
          </div>
        );
      }

      return (
        <div key={lineIdx} className="mb-3 last:mb-0 opacity-95 leading-relaxed italic">
          {line}
        </div>
      );
    });
  };

  const isSoftLaunchLevel = currentLevel?.eventTag === 'SOFT LAUNCH SCANDAL';

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <PhoneFrame battery={gameState.energy} theme={currentTheme}>
        {screen === 'home' && (
          <div className="flex-1 flex flex-col p-8 relative overflow-hidden transition-colors duration-500">
            <div className={`absolute top-[-10%] right-[-10%] w-64 h-64 bg-theme-primary opacity-10 blur-[100px] rounded-full`}></div>
            <div className={`absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-theme-accent opacity-10 blur-[100px] rounded-full`}></div>

            <div className="mt-12 flex flex-col items-center z-10">
              <div className={`w-20 h-20 bg-gradient-to-br from-${currentTheme.colors.primary} to-${currentTheme.colors.secondary} rounded-[2.2rem] border border-white/10 flex items-center justify-center mb-6 shadow-2xl animate-pulse`}>
                 <i className="fas fa-ghost text-4xl text-white"></i>
              </div>
              <h1 className="text-5xl font-black italic tracking-tighter text-center leading-none uppercase">
                GHOSTWRITER<br/><span className={`text-theme-primary`}>NEXUS v2.2</span>
              </h1>
              <div className="mt-4 px-4 py-1.5 bg-black/5 border rounded-full" style={{ borderColor: `var(--theme-muted-color)` }}>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Premium Social Fixer</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4 mt-8 z-10">
               <div className="relative group">
                  <button 
                    disabled={gameState.energy < ENERGY_COST_PER_LEVEL || isCharging}
                    onClick={() => setScreen('game')}
                    className={`w-full py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 border ${gameState.energy < ENERGY_COST_PER_LEVEL ? 'opacity-20 cursor-not-allowed' : `bg-theme-primary text-white border-white/10 shadow-lg hover:opacity-90`}`}
                  >
                    {gameState.energy < ENERGY_COST_PER_LEVEL ? 'LOW POWER' : 'GO ONLINE'} <i className="fas fa-power-off"></i>
                  </button>
                  {gameState.energy < ENERGY_COST_PER_LEVEL && (
                    <p className="absolute -top-6 left-0 right-0 text-center text-[9px] font-black text-rose-500 uppercase tracking-widest animate-pulse">Needs {ENERGY_COST_PER_LEVEL}% to Start</p>
                  )}
               </div>

               {gameState.energy < MAX_ENERGY && (
                 <button 
                   onClick={handleRechargeAd}
                   disabled={isCharging}
                   className={`w-full py-4 bg-emerald-600/10 border border-emerald-500/20 rounded-[2.5rem] text-emerald-500 font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-emerald-600/20 active:scale-95 transition-all ${isCharging ? 'animate-pulse' : ''}`}
                 >
                   <i className={`fas ${isCharging ? 'fa-spinner fa-spin' : 'fa-bolt'}`}></i> {isCharging ? 'Charging...' : 'Watch Ad to Recharge'}
                 </button>
               )}

               <button 
                 onClick={handleDailyTrend}
                 className="w-full py-4 bg-black/5 border rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-80 active:scale-95 transition-all"
                 style={{ borderColor: `var(--theme-muted-color)` }}
               >
                 <i className="fas fa-newspaper text-rose-500"></i> TODAY'S TREND
               </button>

               <button 
                 onClick={() => {
                   setPreviewThemeID(gameState.currentTheme);
                   setScreen('themes');
                 }}
                 className="w-full py-4 bg-black/5 border rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:opacity-80 active:scale-95 transition-all"
                 style={{ borderColor: `var(--theme-muted-color)` }}
               >
                 <i className="fas fa-palette text-cyan-500"></i> PHONE THEMES
               </button>
            </div>

            <div className="mt-auto flex flex-col gap-4 pb-4 z-10">
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 rounded-[2rem] border text-center shadow-xl backdrop-blur-md"
                      style={{ backgroundColor: `var(--theme-panel-color)`, borderColor: `var(--theme-muted-color)` }}>
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-40">Nexus Credit</p>
                    <p className="text-2xl font-black">${gameState.money}</p>
                 </div>
                 <div className="p-5 rounded-[2rem] border text-center shadow-xl backdrop-blur-md"
                      style={{ backgroundColor: `var(--theme-panel-color)`, borderColor: `var(--theme-muted-color)` }}>
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-40">Battery</p>
                    <p className="text-2xl font-black">{gameState.energy}%</p>
                 </div>
               </div>
               {gameState.energy < MAX_ENERGY && (
                 <p className="text-center text-[8px] font-black uppercase tracking-[0.2em] opacity-30">
                   Next Charge In: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                 </p>
               )}
            </div>
          </div>
        )}

        {screen === 'themes' && (
          <div className="flex-1 flex flex-col relative overflow-hidden transition-colors duration-500">
             {/* Preview Area */}
             <div className="h-[280px] w-full relative flex items-center justify-center bg-black/20 overflow-hidden border-b"
                  style={{ borderColor: `var(--theme-muted-color)` }}>
                <div className="absolute top-4 left-6 z-20">
                  <button onClick={() => setScreen('home')} className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-all">
                    <i className="fas fa-arrow-left text-white"></i>
                  </button>
                </div>
                
                <div className="text-center z-10 mb-[-140px]">
                  <div className="scale-[0.35] origin-top transition-all duration-500">
                    <PhoneFrame battery={88} theme={previewTheme}>
                       <Workstation 
                         brief={LEVELS[0]} 
                         gameState={{...gameState, currentTheme: previewThemeID}} 
                         onFinish={() => {}} 
                         onAdRequest={() => {}} 
                         theme={previewTheme} 
                       />
                    </PhoneFrame>
                  </div>
                </div>

                <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] bg-black/40 px-4 py-1 rounded-full backdrop-blur-sm border border-white/5">
                    Live Theme Preview: <span style={{ color: previewTheme.id === 'y2k' ? '#db2777' : previewTheme.colors.primary.split('-')[0] === 'rose' ? '#e11d48' : previewTheme.id === 'cyberpunk' ? '#facc15' : 'white' }}>{previewTheme.name}</span>
                  </span>
                </div>
             </div>

             <div className="flex-1 flex flex-col p-6 overflow-hidden">
               <h2 className="text-xl font-black italic mb-4 uppercase tracking-tighter">Nexus Market</h2>
               <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                  {THEMES.map(t => {
                    const unlocked = gameState.unlockedThemes.includes(t.id);
                    const active = gameState.currentTheme === t.id;
                    const previewing = previewThemeID === t.id;
                    
                    // Specific logic for button styles
                    let btnClass = "";
                    let btnText = "";
                    let btnIcon = null;

                    if (active) {
                      btnClass = `bg-emerald-500 text-white border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]`;
                      btnText = "Active";
                      btnIcon = <i className="fas fa-check-circle mr-1.5"></i>;
                    } else if (unlocked) {
                      btnClass = `bg-${t.colors.primary} text-white hover:opacity-90 shadow-lg`;
                      btnText = "Apply";
                      btnIcon = <i className="fas fa-sync-alt mr-1.5"></i>;
                    } else {
                      const canAfford = gameState.money >= t.price;
                      btnClass = canAfford 
                        ? `bg-${t.colors.primary} text-white shadow-md hover:scale-105 active:scale-95 shimmer-effect` 
                        : `bg-black/10 text-current opacity-40 cursor-not-allowed grayscale`;
                      btnText = `$${t.price}`;
                      btnIcon = <i className="fas fa-lock mr-1.5"></i>;
                    }

                    return (
                      <div 
                        key={t.id} 
                        onClick={() => setPreviewThemeID(t.id)}
                        className={`p-4 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${previewing ? `border-${t.colors.primary} bg-white/5` : 'border-black/5 bg-black/5 hover:bg-black/10'}`}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl bg-${t.colors.primary} shadow-lg border border-white/20 flex items-center justify-center transition-transform ${previewing ? 'scale-110' : ''}`}>
                               <i className={`fas ${active ? 'fa-check' : previewing ? 'fa-eye' : 'fa-mobile-alt'} text-white text-lg`}></i>
                            </div>
                            <div>
                              <p className={`font-black text-sm uppercase tracking-tight ${previewing ? `text-${t.colors.primary}` : ''}`}>{t.name}</p>
                              <p className="text-[9px] opacity-40 uppercase font-black tracking-widest">{unlocked ? 'Owned' : 'Premium Skin'}</p>
                            </div>
                         </div>
                         <button 
                           onClick={(e) => { e.stopPropagation(); buyTheme(t); }}
                           className={`px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all flex items-center border ${btnClass}`}
                         >
                           {btnIcon}
                           {btnText}
                         </button>
                      </div>
                    );
                  })}
               </div>

               <div className="mt-4 pt-4 border-t" style={{ borderColor: `var(--theme-muted-color)` }}>
                  <div className="flex justify-between items-center px-2">
                    <div className="flex flex-col">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Nexus Balance</p>
                      <p className="text-xl font-black">${gameState.money}</p>
                    </div>
                    {previewThemeID !== gameState.currentTheme && (
                      <button 
                        onClick={() => buyTheme(previewTheme)}
                        className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-[0.2em] bg-${previewTheme.colors.primary} text-white shadow-2xl active:scale-95 transition-all shimmer-effect border border-white/10`}
                      >
                        {gameState.unlockedThemes.includes(previewThemeID) ? 'ACTIVATE THEME' : `BUY: ${previewTheme.name.toUpperCase()}`}
                      </button>
                    )}
                  </div>
               </div>
             </div>
          </div>
        )}

        {screen === 'game' && (
          <Workstation 
            brief={currentLevel} 
            gameState={gameState} 
            onFinish={handleLevelComplete} 
            onAdRequest={() => {}} 
            theme={currentTheme}
          />
        )}

        {screen === 'result' && lastResult && (
          <div className="flex-1 flex flex-col p-6 bg-slate-950 animate-in slide-in-from-right duration-500 overflow-y-auto"
               style={{ backgroundColor: `var(--theme-bg-color)`, color: `var(--theme-text-color)` }}>
            <div className="flex justify-between items-center mb-8 border-b pb-4" style={{ borderColor: `var(--theme-muted-color)` }}>
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full animate-ping ${lastResult.outcomeCategory === 'Success' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                 <span className={`text-[10px] font-black uppercase tracking-widest italic ${lastResult.outcomeCategory === 'Success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                   {lastResult.outcomeCategory}
                 </span>
               </div>
               <i className="fas fa-file-contract opacity-20"></i>
            </div>
            
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex justify-start w-full">
                 <div className="p-7 w-full rounded-[2.5rem] rounded-tl-none border shadow-2xl relative backdrop-blur-xl"
                      style={{ backgroundColor: `var(--theme-panel-color)`, borderColor: isSoftLaunchLevel ? '#2563eb' : `var(--theme-muted-color)` }}>
                    <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-4 bg-theme-primary`}
                         style={{ borderColor: `var(--theme-bg-color)`, backgroundColor: isSoftLaunchLevel ? '#2563eb' : 'var(--theme-primary)' }}>
                       <i className="fas fa-comment-dots text-sm text-white"></i>
                    </div>
                    <div className="text-lg font-bold italic" style={{ color: isSoftLaunchLevel ? '#000' : `var(--theme-text-color)` }}>
                      {renderFormattedReaction(lastResult.reactionText)}
                    </div>
                 </div>
              </div>

              <div className="p-8 rounded-[3.5rem] border text-center space-y-6 shadow-2xl relative overflow-hidden mt-2"
                   style={{ backgroundColor: `var(--theme-panel-color)`, borderColor: isSoftLaunchLevel ? '#dc2626' : `var(--theme-muted-color)` }}>
                <div className={`absolute top-0 left-0 w-full h-1.5 ${lastResult.outcomeCategory === 'Success' ? 'bg-emerald-500' : 'bg-rose-500'} opacity-30`}></div>
                
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-2 italic">Performance Rating</h4>
                   <p className="text-4xl font-black italic tracking-tighter uppercase leading-none break-words" style={{ color: isSoftLaunchLevel ? '#000' : 'inherit' }}>{lastResult.ratingTitle}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/10 p-5 rounded-[2.2rem]">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-40">Drama</p>
                    <p className="text-3xl font-black" style={{ color: isSoftLaunchLevel ? '#dc2626' : 'inherit' }}>{lastResult.dramaImpact}</p>
                  </div>
                  <div className="bg-black/10 p-5 rounded-[2.2rem]">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-40">Rep Yield</p>
                    <p className="text-3xl font-black" style={{ color: isSoftLaunchLevel ? (lastResult.reputationImpact > 0 ? '#10b981' : '#ef4444') : 'inherit' }}>{lastResult.reputationImpact > 0 ? '+' : ''}{lastResult.reputationImpact}%</p>
                  </div>
                </div>
                
                {lastResult.isViral && (
                  <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-[2.5rem] text-yellow-600 relative animate-pulse shadow-inner">
                    <i className="fas fa-fire absolute -top-3 -right-3 text-4xl opacity-20 rotate-12"></i>
                    <span className="text-[11px] font-black italic uppercase tracking-widest block mb-2">🔥 VIRAL HEADLINE 🔥</span>
                    <p className="text-sm font-black leading-tight italic">"{lastResult.leakedCommentary}"</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pb-6 space-y-3">
               <button 
                  onClick={() => alert('Clip generated! Share to TikTok to boost engagement.')}
                  className="w-full py-5 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 border border-white/10 hover:bg-white/20 active:scale-95 transition-all"
               >
                 <i className="fab fa-tiktok"></i> SHARE VIRAL RECEIPT
               </button>
               <button 
                 onClick={nextLevel}
                 className={`w-full py-6 rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all hover:opacity-90 bg-theme-primary text-white`}
                 style={{ backgroundColor: isSoftLaunchLevel ? '#2563eb' : 'var(--theme-primary)' }}
               >
                 {gameState.currentLevelIndex < LEVELS.length - 1 ? 'NEXT CLIENT' : 'BACK TO NEXUS'}
               </button>
            </div>
          </div>
        )}
      </PhoneFrame>
    </div>
  );
};

export default App;
