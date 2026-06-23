'use client';

import { useState, useEffect, useRef } from 'react';
import { chatWithMajima } from './actions';
import { Bebas_Neue, Space_Grotesk } from 'next/font/google';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
});

export interface Message {
  role: 'user' | 'model';
  parts: string[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', parts: [input] };
    const updatedHistory = [...messages, userMessage];
    
    setMessages(updatedHistory);
    setInput('');
    setLoading(true);

    try {
      // Call the server action with the history AND the new input
      const response = await chatWithMajima(messages, input);

      if (response.success && response.text) {
        setMessages([...updatedHistory, { role: 'model', parts: [response.text] }]);
      } else {
        setMessages([...updatedHistory, { role: 'model', parts: [response.text || "Gah! Somethin' went wrong in me brain!"] }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages([
        ...updatedHistory,
        { role: 'model', parts: ["Oi! Connection cut off! Make sure yer API key is valid, ya dummy!"] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-[100dvh] h-[100dvh] bg-neutral-950 text-zinc-100 p-0 sm:p-4 relative overflow-hidden selection:bg-red-600 selection:text-white ${spaceGrotesk.className}`}>
      
      {/* Custom Keyframe and CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: 0 0 4px #f43f5e, 0 0 10px #f43f5e, 0 0 20px #e11d48;
            opacity: 1;
          }
          20%, 24%, 55% {
            text-shadow: none;
            opacity: 0.8;
          }
        }
        @keyframes neon-flicker-gold {
          0%, 18%, 22%, 25%, 53%, 57%, 100% {
            text-shadow: 0 0 4px #fbbf24, 0 0 10px #fbbf24, 0 0 20px #d97706;
            opacity: 1;
          }
          20%, 24%, 55% {
            text-shadow: none;
            opacity: 0.7;
          }
        }
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px) translateY(5px) rotate(-1deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0) rotate(-0.5deg);
          }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px) translateY(5px) rotate(1deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) translateY(0) rotate(0.5deg);
          }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes heat-flash {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .neon-pink {
          animation: neon-flicker 2.5s infinite alternate;
        }
        .neon-gold {
          animation: neon-flicker-gold 3s infinite alternate;
        }
        .slide-left {
          animation: slide-in-left 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .slide-right {
          animation: slide-in-right 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scanline {
          animation: scanline 8s linear infinite;
        }
        .animate-heat-flash {
          animation: heat-flash 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        /* Custom styled scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f59e0b;
        }
      `}} />

      {/* Background radial glow & textures */}
      {/* Subtle deep red/crimson radial gradient in the center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(153,27,27,0.15)_0%,_rgba(9,9,11,1)_75%)] pointer-events-none z-0"></div>

      {/* Grid Overlay with slightly more opacity/grit */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none z-0"></div>

      {/* Ambient Neon Haze / Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-amber-900/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-red-950/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Scanline CRT overlay effect */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.5)_50%,rgba(0,0,0,0.5))] bg-[length:100%_4px] opacity-15"></div>
      
      {/* Moving horizontal scanning line */}
      <div className="pointer-events-none absolute inset-x-0 h-1 z-50 bg-red-500/10 custom-scanline opacity-20"></div>

      {/* Sleek App Container Centered (restricted max width) */}
      <div className="relative flex flex-col w-full h-full max-w-3xl sm:h-[95vh] sm:rounded-2xl border border-zinc-900 bg-neutral-950/85 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.9)] sm:border-zinc-800/80 z-10 overflow-hidden">
        
        {/* Border glow decoration for premium feel */}
        <div className="absolute inset-0 border border-red-500/5 rounded-2xl pointer-events-none z-20 hidden sm:block"></div>

        {/* Header */}
        <div className="border-b border-zinc-800/80 p-4 sm:p-5 flex justify-between items-center z-10 bg-neutral-950/90 backdrop-blur-md shrink-0 relative">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-700/40 to-transparent"></div>
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {/* Embroidered jacket patch style */}
              <span className="text-[9px] text-red-500 font-mono uppercase tracking-widest font-bold px-2 py-0.5 bg-red-950/40 border border-red-800/60 shadow-[0_0_10px_rgba(239,68,68,0.2)] rounded-sm relative overflow-hidden select-none before:absolute before:inset-0 before:border-[1px] before:border-dashed before:border-red-600/30">
                <span className="relative z-10">TOJO CLAN</span>
              </span>
              <span className="text-[9px] text-amber-400 font-mono uppercase tracking-widest font-bold px-2 py-0.5 bg-amber-950/40 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)] rounded-sm relative overflow-hidden select-none before:absolute before:inset-0 before:border-[1px] before:border-dashed before:border-amber-400/30">
                <span className="relative z-10">MAJIMA FAMILY</span>
              </span>
            </div>
            
            <h1 className={`text-2xl sm:text-4xl font-normal tracking-wide uppercase flex items-center gap-x-2 mt-1 ${bebas.className}`}>
              <span className="text-red-500 neon-pink">GORO MAJIMA</span>
              <span className="text-zinc-500 text-lg sm:text-xl font-sans font-light">/</span>
              <span className="text-amber-400 neon-gold">TERMINAL</span>
            </h1>

            <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-mono tracking-wider text-zinc-300 uppercase leading-none">
                STATUS: PATROLLING KAMUROCHO
              </span>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <p className={`text-2xl text-red-600 font-normal leading-none tracking-widest ${bebas.className}`}>
              嶋野の狂犬
            </p>
            <p className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase mt-1 select-none">
              The Mad Dog of Shimano
            </p>
          </div>
        </div>

        {/* Yakuza Fighting Game Style Heat Gauge */}
        <div className="px-4 py-2 bg-neutral-950 border-b border-zinc-900/80 flex items-center gap-3 text-[10px] font-mono tracking-widest text-zinc-400 shrink-0 select-none">
          <span className="text-amber-400 font-bold">HEAT:</span>
          <div className="flex-1 h-3 bg-zinc-955 border border-zinc-800 rounded-sm overflow-hidden flex p-[1px]">
            <div className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-amber-400 rounded-sm animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" style={{ width: '85%' }}></div>
          </div>
          <span className="text-red-500 font-bold animate-pulse">CLIMAX READY</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-5 p-4 sm:p-5 custom-scrollbar bg-neutral-950/20 backdrop-blur-xs select-text">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-6 max-w-md mx-auto my-auto slide-up">
              {/* Stylized Neon Hannya Symbol or Mask Card */}
              <div className="relative group select-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600 via-amber-500 to-pink-600 rounded-full blur-2xl opacity-30 group-hover:opacity-65 transition-opacity duration-500 animate-pulse"></div>
                
                {/* Outer decorative card element with gold/red borders */}
                <div className="relative w-32 h-32 bg-neutral-950 border-2 border-amber-400 rounded-full flex items-center justify-center text-5xl shadow-[0_0_35px_rgba(245,158,11,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:border-red-500">
                  👹
                  {/* Embedded golden patterns */}
                  <div className="absolute inset-2 border border-dashed border-amber-400/40 rounded-full pointer-events-none"></div>
                </div>
                
                {/* Decorative Kanji overlays */}
                <span className="absolute -top-3 -left-8 text-3xl font-extrabold text-red-600/40 select-none tracking-tighter filter drop-shadow-[0_0_8px_rgba(220,38,38,0.3)]">真</span>
                <span className="absolute -bottom-3 -right-8 text-3xl font-extrabold text-amber-500/40 select-none tracking-tighter filter drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]">島</span>
              </div>
              
              <div className="space-y-3">
                <h3 className={`text-3xl font-normal text-amber-400 tracking-wider uppercase ${bebas.className}`}>
                  Oi, Kiryu-chan!
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-mono">
                  The streets of Kamurocho are crawlin' with punks, but Majima is lookin' for a real fight. Say somethin' to wake the Mad Dog!
                </p>
              </div>
              
              <div className="flex gap-2 flex-wrap justify-center pt-2 max-w-sm">
                {['Kiryu-chan!', 'Fight me!', 'Who are you?', 'Where is the cabaret?'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                    }}
                    className="text-[11px] font-mono tracking-wider px-3.5 py-2 bg-neutral-900 hover:bg-red-950/40 border border-zinc-800 hover:border-red-700/60 text-zinc-400 hover:text-amber-400 rounded-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_10px_rgba(239,68,68,0.15)]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className="w-full flex">
              {msg.role === 'user' ? (
                /* User Bubble (Kiryu Suit Theme: Light Grey/Silver with Maroon/Crimson accents) */
                <div className="slide-right ml-auto max-w-[75%] bg-zinc-200 border-l-4 border-red-700 rounded-l-lg rounded-tr-lg p-3 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.6)] border border-zinc-300 relative animate-fade-in-up">
                  <div className="flex items-center justify-between gap-6 mb-1 border-b border-zinc-300/60 pb-1">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono font-bold">
                      KIRYU-CHAN (USER)
                    </span>
                    <span className="text-[10px] text-red-700 font-bold">ドラゴン 🐉</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-red-950 font-sans font-semibold">
                    {msg.parts[0]}
                  </p>
                </div>
              ) : (
                /* Majima Bubble (Snakeskin Gold/Yellow, Chaotic Tilt & Offset) */
                <div className="slide-left mr-auto max-w-[85%] bg-neutral-950 border-2 border-amber-400 rounded-r-2xl rounded-bl-2xl rounded-tl-none p-4 sm:p-5 shadow-[0_0_25px_rgba(245,158,11,0.2)] relative transform -rotate-[0.5deg]">
                  {/* Decorative border elements or python pattern overlay */}
                  <div className="absolute inset-0.5 border border-dashed border-amber-500/20 rounded-r-xl rounded-bl-xl rounded-tl-none pointer-events-none"></div>
                  
                  {/* Asymmetric Label */}
                  <div className="absolute -top-3.5 -left-2 bg-amber-400 text-black text-[9px] font-extrabold px-2.5 py-0.5 rounded-sm shadow-md uppercase tracking-wider font-mono border border-black animate-pulse">
                    Mad Dog
                  </div>
                  
                  <div className="flex items-center justify-between gap-6 mb-2 mt-1 border-b border-zinc-800/80 pb-1">
                    <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono font-bold">
                      Majima Goro (真島 吾朗)
                    </span>
                    <span className="text-xs text-amber-400 filter drop-shadow-[0_0_4px_rgba(245,158,11,0.6)]">🐕</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed text-zinc-100 font-mono tracking-wide">
                    {msg.parts[0]}
                  </p>
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="slide-left mr-auto max-w-[85%] bg-neutral-950 border-2 border-dashed border-red-500/60 rounded-r-2xl rounded-bl-2xl rounded-tl-none p-4 sm:p-5 shadow-[0_0_20px_rgba(220,38,38,0.2)] flex items-center gap-4 transform -rotate-[0.5deg] relative">
              <div className="absolute -top-3.5 -left-2 bg-red-600 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-sm shadow-md uppercase tracking-wider font-mono border border-black">
                Threat
              </div>
              <div className="flex space-x-1.5 shrink-0">
                <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <p className={`text-xs sm:text-sm text-red-500 uppercase tracking-widest animate-pulse font-bold ${bebas.className}`}>
                MAJIMA IS UNSHEATHING HIS DAGGER... 🔪
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form Area */}
        <div className="relative p-4 bg-neutral-950 border-t border-zinc-900 z-10 shrink-0">
          {/* Border glow decoration for the top of the input area */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
          
          <div className="flex gap-2 sm:gap-3 max-w-full items-stretch">
            {/* Eye patch design decoration */}
            <div className="hidden sm:flex items-center justify-center w-14 bg-zinc-950 border border-zinc-800 rounded-lg text-xl text-amber-500/75 select-none shadow-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.05)_0%,_transparent_70%)]"></div>
              <span className="relative z-10 filter drop-shadow-[0_0_3px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform duration-300">🐍</span>
            </div>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Spit it out, Kiryu-chan!..."
              className="flex-1 bg-neutral-900/60 border border-zinc-800 focus:border-amber-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-amber-400/40 text-zinc-100 placeholder-zinc-600 transition-all duration-200 text-sm font-mono tracking-wide shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
              disabled={loading}
            />
            
            <button 
              onClick={handleSend} 
              disabled={loading}
              className={`relative bg-gradient-to-r from-red-700 to-red-600 text-white px-5 sm:px-9 rounded-lg font-bold tracking-widest uppercase text-xl sm:text-2xl cursor-pointer select-none transition-all duration-150 active:scale-90 active:rotate-1 hover:brightness-110 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] disabled:opacity-40 disabled:scale-100 disabled:rotate-0 flex items-center justify-center gap-2 border border-red-500/40 overflow-hidden group ${bebas.className}`}
            >
              {/* Heat Action Flash Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent -translate-x-full group-hover:animate-heat-flash"></div>
              
              <span className="relative z-10">OI!</span>
              <span className="text-lg relative z-10 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:scale-110">👊</span>
            </button>
          </div>
        </div>

        {/* Footer / Credits */}
        <footer className="text-center py-3 text-[10px] font-mono text-zinc-600 z-10 select-none flex items-center justify-center gap-1.5 shrink-0 bg-neutral-950 border-t border-zinc-900/80">
          <span>© {new Date().getFullYear()}</span>
          <span>•</span>
          <span>
            Made by{' '}
            <a
              href="https://x.com/yamazakiiish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-red-400 hover:brightness-125 underline decoration-red-900/30 hover:decoration-red-400 transition-all"
            >
              Yama ch.
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}