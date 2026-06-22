'use client';

import { useState, useEffect, useRef } from 'react';
import { chatWithMajima } from './actions';

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
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 font-mono p-4 relative overflow-hidden selection:bg-red-600 selection:text-white">
      {/* Scanline CRT overlay effect */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.3))] bg-[length:100%_4px] opacity-20"></div>

      {/* Glow effect at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-red-950/20 blur-3xl pointer-events-none rounded-full"></div>

      {/* Header */}
      <div className="border-b border-red-600 pb-3 mb-4 flex justify-between items-center z-10">
        <div>
          <h1 className="text-2xl font-black tracking-wider text-red-500 uppercase flex items-center gap-2 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]">
            <span className="animate-pulse">●</span> Mad Dog Terminal v1.0
          </h1>
          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            Searching for Kiryu-chan...
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-red-500 font-bold tracking-widest uppercase">Shimano Clan</p>
          <p className="text-[10px] text-zinc-500">Goro Majima Family Boss</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 border border-zinc-800 rounded bg-zinc-900/30 backdrop-blur-sm shadow-inner scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-zinc-900">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3 opacity-60">
            <div className="text-4xl text-red-500 animate-bounce">👹</div>
            <p className="text-zinc-400 text-sm italic max-w-sm">
              The streets of Kamurocho are quiet... Type somethin' to wake the Mad Dog.
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`p-3 rounded-lg max-w-[85%] sm:max-w-[75%] transition-all duration-300 transform translate-y-0 ${
              msg.role === 'user' 
                ? 'bg-zinc-900 border border-zinc-800 ml-auto text-right hover:border-zinc-700' 
                : 'bg-red-950/20 border border-red-900/40 mr-auto hover:bg-red-950/30 hover:border-red-900/60 shadow-[0_0_15px_rgba(153,27,27,0.1)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5 justify-start">
              {msg.role === 'user' ? (
                <div className="flex items-center gap-2 w-full justify-end">
                  <span className="text-[10px] text-zinc-500">YOU</span>
                  <span className="text-xs text-zinc-400">👤</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full justify-start">
                  <span className="text-xs text-red-500">🐉</span>
                  <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">MAJIMA</span>
                </div>
              )}
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed tracking-wide text-zinc-200">
              {msg.parts[0]}
            </p>
          </div>
        ))}
        {loading && (
          <div className="bg-red-950/10 border border-red-900/20 mr-auto p-3 rounded-lg flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping"></div>
            <p className="text-xs text-red-400 italic animate-pulse">Majima is cackling wildly...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="flex gap-2 relative z-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Say somethin' to the Mad Dog..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 text-zinc-100 placeholder-zinc-600 transition-colors shadow-lg hover:border-zinc-700"
          disabled={loading}
        />
        <button 
          onClick={handleSend} 
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 active:scale-95 disabled:opacity-40 disabled:scale-100 text-white px-8 py-3 rounded-lg font-black tracking-widest transition-all duration-200 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] flex items-center gap-1.5 uppercase"
        >
          OI!
        </button>
      </div>
    </div>
  );
}