
import React, { useState, useEffect, useRef } from 'react';
import { Brief, Fragment, Tone, GameState, ReactionResponse, PhoneTheme } from '../types';
import { LEVEL_FRAGMENTS, TONE_COLORS } from '../constants';
import { getAIReaction } from '../services/geminiService';
import { playSelectSound, playSendSound, playTransitionSound } from '../services/audioService';

interface WorkstationProps {
  brief: Brief;
  gameState: GameState;
  onFinish: (result: ReactionResponse) => void;
  onAdRequest: () => void;
  theme: PhoneTheme;
}

const Workstation: React.FC<WorkstationProps> = ({ brief, gameState, onFinish, onAdRequest, theme }) => {
  const [step, setStep] = useState<'brief' | 'drafting' | 'typing'>('brief');
  
  // Selection States
  const [selectedOpener, setSelectedOpener] = useState<Fragment | null>(null);
  const [selectedMeat, setSelectedMeat] = useState<Fragment | null>(null);
  const [selectedCloser, setSelectedCloser] = useState<Fragment | null>(null);

  // Custom Text States
  const [customOpener, setCustomOpener] = useState('');
  const [customMeat, setCustomMeat] = useState('');
  const [customCloser, setCustomCloser] = useState('');

  // The Master Draft State
  const [messageDraft, setMessageDraft] = useState('');
  const [isManualEdit, setIsManualEdit] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [sendingToAll, setSendingToAll] = useState(false);

  const fragments = LEVEL_FRAGMENTS[brief.id] || { openers: [], meat: [], closers: [] };

  // Sync draft when fragments or custom text are selected/changed
  useEffect(() => {
    if (!isManualEdit) {
      const openerText = customOpener || selectedOpener?.text || '';
      const meatText = customMeat || selectedMeat?.text || '';
      const closerText = customCloser || selectedCloser?.text || '';
      const combined = [openerText, meatText, closerText].filter(Boolean).join(' ');
      setMessageDraft(combined);
    }
  }, [selectedOpener, selectedMeat, selectedCloser, customOpener, customMeat, customCloser, isManualEdit]);

  const isMessageComplete = messageDraft.trim().length > 5;

  const handleSend = async (isReplyAll: boolean = false) => {
    if (!isMessageComplete) return;
    setIsSending(true);
    setSendingToAll(isReplyAll);
    setStep('typing');
    playSendSound();
    
    if ('vibrate' in navigator) {
      if (isReplyAll) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      } else {
        navigator.vibrate(30);
      }
    }

    const reaction = await getAIReaction(brief, messageDraft, isReplyAll);
    
    setTimeout(() => {
      setIsSending(false);
      onFinish(reaction);
    }, 3500);
  };

  const handleManualTyping = (val: string) => {
    setMessageDraft(val);
    setIsManualEdit(true);
  };

  const selectFragment = (type: 'opener' | 'meat' | 'closer', fragment: Fragment) => {
    setIsManualEdit(false);
    playSelectSound();
    if (type === 'opener') {
      setSelectedOpener(fragment);
      setCustomOpener('');
    } else if (type === 'meat') {
      setSelectedMeat(fragment);
      setCustomMeat('');
    } else if (type === 'closer') {
      setSelectedCloser(fragment);
      setCustomCloser('');
    }
  };

  const handleCustomFragmentChange = (type: 'opener' | 'meat' | 'closer', val: string) => {
    setIsManualEdit(false);
    if (type === 'opener') {
      setCustomOpener(val);
      setSelectedOpener(null);
    } else if (type === 'meat') {
      setCustomMeat(val);
      setSelectedMeat(null);
    } else if (type === 'closer') {
      setCustomCloser(val);
      setSelectedCloser(null);
    }
  };

  const startDrafting = () => {
    setStep('drafting');
    playTransitionSound();
  };

  const isSoftLaunch = brief.eventTag === 'SOFT LAUNCH SCANDAL';

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden transition-colors duration-500">
      <style>{`
        @keyframes neon-glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 35px var(--theme-primary), 0 0 50px var(--theme-primary);
            transform: scale(1.1);
          }
          50% { 
            box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px var(--theme-primary), 0 0 20px var(--theme-primary);
            transform: scale(1.02);
          }
        }
        .ready-to-send {
          animation: neon-glow-pulse 1.2s infinite ease-in-out;
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-fast {
          animation: progress 2.5s ease-in-out infinite;
        }
        .message-textarea {
          background: transparent;
          border: none;
          resize: none;
          width: 100%;
          height: 100%;
          font-family: inherit;
          color: inherit;
          outline: none;
          font-weight: 800;
        }
        .message-textarea::placeholder {
          color: rgba(0, 0, 0, 0.4);
          font-style: italic;
        }
        
        @keyframes typing-bounce-dynamic {
          0%, 100% { 
            transform: translateY(0) scale(1); 
            opacity: 0.3;
            background-color: var(--theme-primary);
          }
          40% { 
            transform: translateY(-12px) scale(1.3); 
            opacity: 1;
            background-color: var(--theme-secondary);
            box-shadow: 0 0 15px var(--theme-secondary);
          }
          60% {
             transform: translateY(-8px) scale(1.1);
             background-color: var(--theme-accent);
          }
        }
        
        @keyframes bubble-breath {
          0%, 100% { border-color: var(--theme-muted-color); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
          50% { border-color: var(--theme-primary); box-shadow: 0 0 30px var(--theme-primary-faded, rgba(255,255,255,0.1)); }
        }

        .typing-dot {
          animation: typing-bounce-dynamic 1.5s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: var(--theme-primary);
        }
        .typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .typing-dot:nth-child(3) { animation-delay: 0.3s; }
        
        .typing-bubble {
          position: relative;
          background: var(--theme-panel-color);
          border: 2px solid var(--theme-muted-color);
          border-radius: 3rem;
          padding: 2.5rem 3rem;
          display: flex;
          gap: 14px;
          animation: bubble-breath 3s infinite ease-in-out;
          backdrop-filter: blur(12px);
        }
        .typing-bubble::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: -14px;
          width: 28px;
          height: 28px;
          background: var(--theme-panel-color);
          border-left: 2px solid var(--theme-muted-color);
          border-bottom: 2px solid var(--theme-muted-color);
          clip-path: polygon(100% 0, 0% 100%, 100% 100%);
        }

        .event-tag-softlaunch {
          background: #2563eb;
          color: #000000;
          border: 2px solid #dc2626;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
        }

        .custom-input {
          background: rgba(0,0,0,0.05);
          border: 1px dashed var(--theme-muted-color);
          border-radius: 1rem;
          padding: 0.75rem 1rem;
          font-size: 11px;
          font-weight: 700;
          width: 100%;
          transition: all 0.3s;
          outline: none;
        }
        .custom-input:focus {
          border-style: solid;
          border-color: var(--theme-primary);
          background: rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Header Info */}
      <div className="px-6 py-3 flex justify-between items-center backdrop-blur-xl border-b z-20"
           style={{ backgroundColor: `var(--theme-panel-color)`, borderColor: `var(--theme-muted-color)` }}>
        <div className="flex flex-col gap-1">
           <div className="flex items-center gap-1.5">
              <i className="fas fa-battery-half text-[10px]" style={{ color: `var(--theme-primary)` }}></i>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Energy</span>
           </div>
           <div className="w-20 h-1.5 bg-black/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 bg-theme-primary`} 
                style={{ width: `${gameState.energy}%` }}
              ></div>
           </div>
        </div>
        <div className="flex flex-col items-end gap-1">
           <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Drama</span>
              <i className="fas fa-fire text-[10px] animate-pulse" style={{ color: `var(--theme-secondary)` }}></i>
           </div>
           <div className="w-20 h-1.5 bg-black/10 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 bg-theme-secondary`} 
                style={{ width: `${gameState.dramaLevel}%` }}
              ></div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {step === 'brief' && (
          <div className="flex-1 flex flex-col justify-center p-6 gap-6 animate-in fade-in zoom-in-95 duration-500">
            {brief.eventTag && (
              <div className={`text-[10px] font-black py-1.5 px-6 self-center rounded-full mb-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] uppercase tracking-[0.3em] ${isSoftLaunch ? 'event-tag-softlaunch' : 'bg-theme-primary text-white'}`}>
                {brief.eventTag}
              </div>
            )}
            
            <div className="text-center">
              <div className="w-28 h-28 rounded-[2.5rem] mx-auto mb-4 border-2 p-1.5 relative shadow-2xl"
                   style={{ borderColor: `var(--theme-muted-color)`, backgroundColor: `var(--theme-panel-color)` }}>
                  <img src={brief.client.avatar} alt={brief.client.name} className="w-full h-full rounded-[2rem] object-cover" />
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 flex items-center justify-center shadow-lg bg-theme-accent`}
                       style={{ borderColor: `var(--theme-bg-color)` }}>
                    <i className="fas fa-check text-white text-xs"></i>
                  </div>
              </div>
              <h3 className="text-3xl font-black italic tracking-tighter uppercase" style={{ color: isSoftLaunch ? '#000000' : 'inherit' }}>{brief.client.name}</h3>
              <p className="text-[11px] font-extrabold opacity-60 uppercase tracking-widest" style={{ color: isSoftLaunch ? '#dc2626' : 'inherit' }}>{brief.client.followerCount.toLocaleString()} Followers</p>
            </div>

            <div className="p-7 rounded-[2.5rem] border backdrop-blur-md shadow-2xl"
                 style={{ backgroundColor: `var(--theme-panel-color)`, borderColor: isSoftLaunch ? '#2563eb' : `var(--theme-muted-color)` }}>
              <p className="text-base font-extrabold leading-relaxed italic" style={{ color: isSoftLaunch ? '#000000' : 'inherit' }}>"{brief.scenario}"</p>
            </div>

            <button 
              onClick={startDrafting}
              className="mt-4 w-full py-5 rounded-[2rem] bg-theme-primary text-white font-black text-xl shadow-xl active:scale-95 transition-all shimmer-effect border border-white/10"
              style={{ backgroundColor: isSoftLaunch ? '#2563eb' : 'var(--theme-primary)', color: isSoftLaunch ? '#ffffff' : 'white' }}
            >
              DRAFT RESPONSE
            </button>
          </div>
        )}

        {step === 'drafting' && (
          <div className="flex-1 flex flex-col p-4 gap-4 animate-in slide-in-from-bottom duration-500 overflow-hidden">
            {/* Master Draft Area */}
            <div className={`bg-black/5 rounded-[3rem] p-4 border flex flex-col gap-3 relative overflow-hidden ${isSoftLaunch ? 'border-blue-600/30' : 'border-current/5'}`}
                 style={{ borderColor: isSoftLaunch ? '#2563eb44' : `var(--theme-muted-color)` }}>
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60" style={{ color: isSoftLaunch ? '#000000' : 'inherit' }}>To: {brief.recipient}</span>
                <span className="text-[9px] font-black text-emerald-500 animate-pulse flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> ENCRYPTED
                </span>
              </div>
              
              <div className={`min-h-[140px] p-6 rounded-[2rem] transition-all duration-500 relative flex items-start ${isMessageComplete ? (isSoftLaunch ? 'bg-blue-600 text-white shadow-2xl' : 'bg-theme-primary text-white shadow-2xl') : 'bg-current/5 opacity-60'}`}>
                <textarea 
                  value={messageDraft}
                  onChange={(e) => handleManualTyping(e.target.value)}
                  placeholder="Draft your masterpiece here..."
                  className="message-textarea text-sm font-black leading-tight pr-12 italic"
                  style={{ color: isMessageComplete ? 'white' : (isSoftLaunch ? '#000000' : 'inherit') }}
                />
                
                <button 
                  disabled={!isMessageComplete}
                  onClick={() => handleSend(false)}
                  className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${isMessageComplete ? 'bg-white text-theme-primary ready-to-send shadow-xl rotate-0 active:scale-90 active:rotate-12' : 'bg-black/20 text-white/20 scale-90 -rotate-45 opacity-40'}`}
                  style={{ color: isMessageComplete ? `var(--theme-primary)` : 'white' }}
                >
                  <i className="fas fa-paper-plane text-lg"></i>
                </button>
              </div>
            </div>

            {/* Segmented Controls */}
            <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
              
              {/* Opener */}
              <section className="space-y-3">
                <div className="flex justify-between items-center px-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60" style={{ color: isSoftLaunch ? '#2563eb' : 'inherit' }}>The Opener</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {fragments.openers.map(f => (
                    <button 
                      key={f.id}
                      onClick={() => selectFragment('opener', f)}
                      className={`px-4 py-3 rounded-2xl border-2 text-xs font-extrabold transition-all ${selectedOpener?.id === f.id ? (isSoftLaunch ? 'border-blue-600 bg-blue-600/10 text-blue-800' : 'border-theme-primary bg-theme-primary/10') : 'border-black/5 bg-black/5 opacity-70'}`}
                    >
                      {f.text}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    value={customOpener}
                    onChange={(e) => handleCustomFragmentChange('opener', e.target.value)}
                    onFocus={playSelectSound}
                    placeholder="Type a custom opener..."
                    className="custom-input pl-10"
                  />
                  <i className="fas fa-pen-fancy absolute left-4 top-1/2 -translate-y-1/2 text-[10px] opacity-40"></i>
                </div>
              </section>

              {/* Meat */}
              <section className="space-y-3">
                <div className="flex justify-between items-center px-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60" style={{ color: isSoftLaunch ? '#2563eb' : 'inherit' }}>The Pivot</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {fragments.meat.map(f => (
                    <button 
                      key={f.id}
                      onClick={() => selectFragment('meat', f)}
                      className={`px-4 py-3 rounded-2xl border-2 text-xs font-extrabold transition-all ${selectedMeat?.id === f.id ? (isSoftLaunch ? 'border-blue-600 bg-blue-600/10 text-blue-800' : 'border-theme-primary bg-theme-primary/10') : 'border-black/5 bg-black/5 opacity-70'}`}
                    >
                      {f.text}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    value={customMeat}
                    onChange={(e) => handleCustomFragmentChange('meat', e.target.value)}
                    onFocus={playSelectSound}
                    placeholder="Type a custom pivot..."
                    className="custom-input pl-10"
                  />
                  <i className="fas fa-pen-fancy absolute left-4 top-1/2 -translate-y-1/2 text-[10px] opacity-40"></i>
                </div>
              </section>

              {/* Closer */}
              <section className="space-y-3">
                <div className="flex justify-between items-center px-2">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60" style={{ color: isSoftLaunch ? '#2563eb' : 'inherit' }}>The Closer</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {fragments.closers.map(f => (
                    <button 
                      key={f.id}
                      onClick={() => selectFragment('closer', f)}
                      className={`px-4 py-3 rounded-2xl border-2 text-xs font-extrabold transition-all ${selectedCloser?.id === f.id ? (isSoftLaunch ? 'border-blue-600 bg-blue-600/10 text-blue-800' : 'border-theme-primary bg-theme-primary/10') : 'border-black/5 bg-black/5 opacity-70'}`}
                    >
                      {f.text}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input 
                    type="text"
                    value={customCloser}
                    onChange={(e) => handleCustomFragmentChange('closer', e.target.value)}
                    onFocus={playSelectSound}
                    placeholder="Type a custom closer..."
                    className="custom-input pl-10"
                  />
                  <i className="fas fa-pen-fancy absolute left-4 top-1/2 -translate-y-1/2 text-[10px] opacity-40"></i>
                </div>
              </section>
            </div>

            <div className="pt-2">
               <button 
                 disabled={!isMessageComplete}
                 onClick={() => handleSend(true)}
                 className={`w-full py-4 rounded-[2rem] font-black text-[10px] tracking-[0.3em] transition-all border-2 flex items-center justify-center gap-3 scanline-effect ${isMessageComplete ? 'bg-rose-600/10 border-rose-500/30 text-rose-500 hover:bg-rose-600 hover:text-white active:scale-95' : 'opacity-10 grayscale border-transparent cursor-not-allowed'}`}
               >
                 <i className="fas fa-radiation text-sm"></i> EMERGENCY: REPLY ALL <i className="fas fa-radiation text-sm"></i>
               </button>
            </div>
          </div>
        )}

        {step === 'typing' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-12 animate-in fade-in duration-1000">
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden select-none">
                <div className="text-[8px] leading-[1] font-mono whitespace-pre">
                  {Array.from({length: 40}).map((_, i) => (
                    <div key={i}>01101100 01101111 01110110 01100101 00100000 01100100 01110010 01100001 01101101 01100001</div>
                  ))}
                </div>
             </div>

             <div className="flex flex-col items-center gap-12 z-10">
                <div className="typing-bubble">
                   <div className="typing-dot"></div>
                   <div className="typing-dot"></div>
                   <div className="typing-dot"></div>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="flex flex-col gap-1 items-center">
                    <span className="text-[11px] font-black uppercase tracking-[0.6em] opacity-60" style={{ color: isSoftLaunch ? '#000000' : 'inherit' }}>Directing To</span>
                    <span className="text-2xl font-black italic tracking-tighter uppercase text-theme-primary" style={{ color: isSoftLaunch ? '#2563eb' : 'var(--theme-primary)' }}>
                      {brief.recipient}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase animate-pulse" style={{ color: isSoftLaunch ? '#dc2626' : 'inherit' }}>
                    {sendingToAll ? 'INFILTRATING THREADS...' : 'FABRICATING TEXTS...'}
                  </h3>
                </div>
             </div>
             
             <div className="w-full space-y-5 mt-8 px-10 z-10">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-40" style={{ color: isSoftLaunch ? '#000000' : 'inherit' }}>Nexus Core</span>
                    <span className="text-[11px] font-black text-emerald-500 tracking-widest flex items-center gap-2">
                       <i className="fas fa-circle text-[8px] animate-pulse"></i> TRANSMITTING
                    </span>
                  </div>
                  <span className="text-[10px] font-black opacity-60 uppercase tracking-widest italic" style={{ color: isSoftLaunch ? '#000000' : 'inherit' }}>AES-256 ACTIVE</span>
                </div>
                <div className="h-3 bg-black/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
                   <div className="h-full bg-theme-primary animate-progress-fast shadow-[0_0_20px_var(--theme-primary)]" style={{ backgroundColor: isSoftLaunch ? '#2563eb' : 'var(--theme-primary)' }}></div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workstation;
