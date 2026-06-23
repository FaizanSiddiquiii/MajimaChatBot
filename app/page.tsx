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
    <div className={`flex flex-col h-screen bg-black text-zinc-100 p-4 relative overflow-hidden selection:bg-pink-600 selection:text-white ${spaceGrotesk.className}`}>
      
      {/* Custom Keyframe and CSS Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes neon-flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            text-shadow: 0 0 4px #ec4899, 0 0 10px #ec4899, 0 0 20px #db2777;
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
            transform: translateX(-40px) rotate(-2deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(-0.5deg);
          }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(40px) rotate(2deg);
          }
          to {
            opacity: 1;
            transform: translateX(0) rotate(0.5deg);
          }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .neon-pink {
          animation: neon-flicker 2.5s infinite alternate;
        }
        .neon-gold {
          animation: neon-flicker-gold 3s infinite alternate;
        }
        .slide-left {
          animation: slide-in-left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .slide-right {
          animation: slide-in-right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .custom-scanline {
          animation: scanline 8s linear infinite;
        }
        /* Custom styled scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #db2777;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #fbbf24;
        }
      `}} />

      {/* Ambient Neon Haze / Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-900/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-amber-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-red-950/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:30px_30px] opacity-70 pointer-events-none"></div>

      {/* Scanline CRT overlay effect */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.45)_50%,rgba(0,0,0,0.45))] bg-[length:100%_4px] opacity-25"></div>
      
      {/* Moving horizontal scanning line */}
      <div className="pointer-events-none absolute inset-x-0 h-1 z-50 bg-pink-500/10 custom-scanline opacity-30"></div>

      {/* Header */}
      <div className="border-b-2 border-red-700/60 pb-4 mb-4 flex justify-between items-end z-10 bg-black/40 backdrop-blur-md">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] text-pink-500 border border-pink-500/50 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest animate-pulse">
              Tojo Clan
            </span>
            <span className="text-[10px] text-amber-500 border border-amber-500/50 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest">
              Majima Family
            </span>
          </div>
          
          <h1 className={`text-4xl sm:text-5xl font-normal tracking-wide uppercase flex items-center gap-3 mt-1.5 ${bebas.className}`}>
            <span className="text-pink-500 neon-pink">Goro Majima</span>
            <span className="text-amber-400 neon-gold">Terminal</span>
          </h1>

          <div className="text-xs text-zinc-400 mt-1.5 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-mono tracking-wider text-zinc-300 text-[11px] sm:text-xs">
              STATUS: PATROLLING KAMUROCHO (SEARCHING FOR KIRYU-CHAN...)
            </span>
          </div>
        </div>

        <div className="text-right hidden md:block">
          <p className={`text-3xl text-red-600 font-normal leading-none tracking-widest ${bebas.className}`}>
            嶋野の狂犬
          </p>
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-1">
            The Mad Dog of Shimano
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-5 mb-4 p-4 border border-zinc-800/80 rounded bg-zinc-950/40 backdrop-blur-sm shadow-inner custom-scrollbar">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-6 max-w-md mx-auto my-auto">
            {/* Stylized Neon Hannya Symbol or Mask Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-600 to-amber-500 rounded-full blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
              <div className="relative w-28 h-28 bg-zinc-950 border-2 border-red-500/50 rounded-full flex items-center justify-center text-5xl shadow-[0_0_25px_rgba(239,68,68,0.35)]">
                👹
              </div>
              {/* Decorative Kanji overlays */}
              <span className="absolute -top-2 -left-6 text-2xl font-bold text-pink-500/30 select-none">真</span>
              <span className="absolute -bottom-2 -right-6 text-2xl font-bold text-amber-500/30 select-none">島</span>
            </div>
            
            <div className="space-y-2">
              <h3 className={`text-2xl font-normal text-amber-400 uppercase tracking-widest ${bebas.className}`}>
                Oi, Kiryu-chan!
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-mono">
                The streets of Kamurocho are crawlin' with punks, but Majima is lookin' for a real fight. Say somethin' to wake the Mad Dog!
              </p>
            </div>
            
            <div className="flex gap-2 flex-wrap justify-center pt-2">
              {['Kiryu-chan!', 'Fight me!', 'Who are you?', 'Where is the cabaret?'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                  }}
                  className="text-xs px-3 py-1.5 bg-zinc-900/60 hover:bg-red-950/40 border border-zinc-800 hover:border-red-700/60 text-zinc-400 hover:text-pink-400 rounded transition-all duration-200 cursor-pointer"
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
              /* User Bubble (Kiryu Suit Theme: Dark Charcoal/Grey with Maroon Accent) */
              <div className="slide-right ml-auto max-w-[85%] sm:max-w-[75%] bg-zinc-800/90 border-r-4 border-red-600 rounded-l-lg rounded-tr-lg p-3.5 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-700/50 relative">
                <div className="flex items-center justify-between gap-6 mb-1.5">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono font-bold">
                    Saku_NyaNya
                  </span>
                  <span className="text-xs text-red-500">👤</span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-100 font-sans font-medium">
                  {msg.parts[0]}
                </p>
              </div>
            ) : (
              /* Majima Bubble (Snakeskin Gold/Yellow, Chaotic Tilt & Offset) */
              <div className="slide-left mr-auto max-w-[85%] sm:max-w-[75%] bg-neutral-950 border-2 border-amber-400 rounded-r-lg rounded-bl-lg p-4 shadow-[0_0_20px_rgba(245,158,11,0.15)] relative transform -rotate-[0.5deg]">
                {/* Asymmetric Label */}
                <div className="absolute -top-3 -left-2 bg-amber-400 text-black text-[9px] font-bold px-2 py-0.5 rounded shadow-md uppercase tracking-wider font-mono">
                  Mad Dog
                </div>
                
                <div className="flex items-center justify-between gap-6 mb-2 mt-1">
                  <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono font-bold">
                    Majima Goro (真島 吾朗)
                  </span>
                  <span className="text-xs text-amber-400">🐕</span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-200 font-mono">
                  {msg.parts[0]}
                </p>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="slide-left mr-auto max-w-[80%] bg-neutral-950 border-2 border-dashed border-red-500/50 rounded-r-xl rounded-bl-xl p-3.5 shadow-[0_0_15px_rgba(220,38,38,0.15)] flex items-center gap-3 transform -rotate-[0.5deg] relative">
            <div className="absolute -top-3 -left-2 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md uppercase tracking-wider font-mono">
              Chuckle
            </div>
            <div className="flex space-x-1.5">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className={`text-xs text-red-500 uppercase tracking-widest animate-pulse font-bold ${bebas.className}`}>
              MAJIMA IS UNSHEATHING HIS DAGGER... 🔪
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="relative flex gap-3 p-2 bg-black/80 border-t-2 border-red-800/40 z-10 backdrop-blur-md rounded-t-lg">
        {/* Eye patch design decoration */}
        <div className="hidden sm:flex items-center justify-center w-12 bg-neutral-900 border border-zinc-800 rounded-lg text-lg text-zinc-500 select-none shadow-inner">
          👁️
        </div>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Spit it out, Kiryu-chan!..."
          className="flex-1 bg-zinc-900/90 border-2 border-zinc-800 focus:border-pink-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-zinc-100 placeholder-zinc-600 transition-all duration-300 shadow-inner text-sm font-mono tracking-wide"
          disabled={loading}
        />
        
        <button 
          onClick={handleSend} 
          disabled={loading}
          className={`bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white px-8 py-3 rounded-lg font-normal tracking-widest transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:scale-100 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] flex items-center gap-2 uppercase text-2xl cursor-pointer ${bebas.className}`}
        >
          <span>OI!</span>
          <span className="text-lg">👊</span>
        </button>
      </div>
    </div>
  );
}