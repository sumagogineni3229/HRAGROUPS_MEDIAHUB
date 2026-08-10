"use client";

import { useState, useRef, useEffect } from "react";
import { XMarkIcon, PhoneIcon, PaperAirplaneIcon, SparklesIcon } from "@heroicons/react/24/solid";

interface ChatMessage {
  id: number;
  sender: "bot" | "user";
  text: string;
  timestamp?: string;
}

export function FloatingSupportWidget() {
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showPromptBubble, setShowPromptBubble] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "bot",
      text: "👋 Hi! I'm **MediaHub AI**. Ask me anything about our Digital PR services, Publisher monetization, pricing, or campaigns!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, chatOpen]);

  const handleCallClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.innerWidth > 768) {
      e.preventDefault();
      setCallModalOpen(!callModalOpen);
      setChatOpen(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userQuery = inputMessage.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: "user",
      text: userQuery,
      timestamp: nowTime,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userQuery,
          history: chatMessages.slice(-6), // Send last 6 context messages
        }),
      });

      const data = await response.json();
      const botReply = data.reply || "I am here to help you with MediaHub! What would you like to know?";

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "I'm having trouble connecting right now. Feel free to call us directly at **+91 9490056002**!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render basic markdown formatting like **bold** and bullet points
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <span
          key={i}
          className="block"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
  };

  return (
    <>
      {/* ─────────────────────────────────────────────
         FLOATING CALL & CHAT CONTROLS (MediaHub AI Enhanced)
         ───────────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-inter">
        
        {/* 1. Phone Support Modal */}
        {callModalOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-amber-200/60 p-5 w-80 mb-2 animate-in fade-in slide-in-from-bottom-4 text-[#112C3E] overflow-hidden">
            {/* Header bar */}
            <div className="bg-[#F59E0B] -mx-5 -mt-5 px-5 pt-5 pb-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/30 border border-white/40 flex items-center justify-center">
                  <PhoneIcon className="w-4 h-4 text-[#112C3E]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#112C3E] leading-tight">Phone Support</h4>
                  <p className="text-[11px] text-[#112C3E]/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
                    Mon–Fri · 24/7 Available
                  </p>
                </div>
              </div>
              <button onClick={() => setCallModalOpen(false)} className="text-[#112C3E]/60 hover:text-[#112C3E] p-1 transition">
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="text-center space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Speak directly with a <span className="font-semibold text-[#112C3E]">MediaHub campaign strategist</span>
              </p>
              <a
                href="tel:+919490056002"
                className="block text-2xl font-black text-[#F59E0B] hover:text-[#D97706] tracking-wide transition"
              >
                +91 9490056002
              </a>
              <a
                href="tel:+919490056002"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#112C3E] hover:bg-[#1E3A5F] text-white font-bold text-xs rounded-xl transition shadow-md"
              >
                <PhoneIcon className="w-4 h-4" />
                Call Now · +91 9490056002
              </a>
            </div>
          </div>
        )}

        {/* 2. Live MediaHub AI Chat Window */}
        {chatOpen && (
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-80 sm:w-96 h-[480px] flex flex-col mb-2 overflow-hidden animate-in fade-in slide-in-from-bottom-4 text-[#112C3E]">
            {/* Header */}
            <div className="bg-[#F59E0B] text-[#112C3E] p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-[#112C3E] border border-white/40 shadow-inner">
                    <SparklesIcon className="w-5 h-5 text-[#112C3E] animate-pulse" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[#F59E0B]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-sm leading-tight tracking-wide">MediaHub AI</h4>
                    <span className="text-[10px] bg-white/30 border border-white/40 text-[#112C3E] font-semibold px-1.5 py-0.5 rounded-full">Bot</span>
                  </div>
                  <span className="text-[11px] text-[#112C3E]/80 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                    Online • Instant Answers
                  </span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-[#112C3E]/70 hover:text-[#112C3E] p-1 transition">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Message Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F8FAFC]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#3E4FEA] text-white rounded-br-none shadow-sm font-medium"
                        : "bg-white text-[#112C3E] border border-slate-200/70 rounded-bl-none shadow-sm"
                    }`}
                  >
                    {formatText(msg.text)}
                  </div>
                  {msg.timestamp && (
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-white border border-slate-200/70 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-1.5 text-slate-500 text-xs">
                    <SparklesIcon className="w-3.5 h-3.5 text-[#3E4FEA] animate-spin" />
                    <span>MediaHub AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {chatMessages.length <= 2 && !isLoading && (
              <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-600 no-scrollbar">
                <button
                  onClick={() => {
                    setInputMessage("What is MediaHub?");
                  }}
                  className="whitespace-nowrap bg-white border border-slate-200 rounded-full px-2.5 py-1 hover:border-[#3E4FEA] hover:text-[#3E4FEA] transition shadow-2xs"
                >
                  💡 What is MediaHub?
                </button>
                <button
                  onClick={() => {
                    setInputMessage("How do I monetize my website as a publisher?");
                  }}
                  className="whitespace-nowrap bg-white border border-slate-200 rounded-full px-2.5 py-1 hover:border-[#3E4FEA] hover:text-[#3E4FEA] transition shadow-2xs"
                >
                  🌐 For Publishers
                </button>
                <button
                  onClick={() => {
                    setInputMessage("How can advertisers post guest articles?");
                  }}
                  className="whitespace-nowrap bg-white border border-slate-200 rounded-full px-2.5 py-1 hover:border-[#3E4FEA] hover:text-[#3E4FEA] transition shadow-2xs"
                >
                  🚀 For Advertisers
                </button>
              </div>
            )}

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Ask MediaHub AI anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#3E4FEA] text-[#112C3E] disabled:bg-slate-50"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 py-2.5 bg-[#3E4FEA] hover:bg-[#2632A3] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 shrink-0"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 3. Dismissable Popup Text Bubble with Cross Icon */}
        {showPromptBubble && !chatOpen && !callModalOpen && (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl pl-5 pr-3 py-3 shadow-2xl border border-slate-100/90 flex items-start justify-between gap-3 max-w-[270px] mb-1 animate-in fade-in slide-in-from-bottom-3 relative select-none">
            <div
              className="cursor-pointer font-semibold text-[14px] leading-snug text-[#162D3D] pt-0.5 font-inter"
              onClick={() => {
                setChatOpen(true);
                setShowPromptBubble(false);
              }}
            >
              <div className="flex items-center gap-1.5 text-[#3E4FEA] font-bold text-xs mb-0.5">
                <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
                MediaHub AI Support
              </div>
              <div>Ask anything about MediaHub!</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPromptBubble(false);
              }}
              className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition shrink-0 mt-0.5"
              title="Close prompt"
              aria-label="Close prompt"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
            {/* Pointer Tail at bottom right pointing towards buttons */}
            <div className="absolute -bottom-1.5 right-10 w-3 h-3 bg-white border-b border-r border-slate-100 transform rotate-45" />
          </div>
        )}

        {/* 4. Floating Buttons Row - Call Icon & Chat Icon */}
        <div className="flex items-center gap-3">
          {/* Standalone Separate Call Icon Button */}
          <a
            href="tel:+919490056002"
            onClick={handleCallClick}
            className="w-14 h-14 rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-white flex items-center justify-center shadow-xl transition-transform hover:scale-105"
            title="Call +91 9490056002"
            aria-label="Call +91 9490056002"
          >
            <svg width="44" height="44" viewBox="0 0 52 52" fill="none">
              <path d="M26 6C14.9543 6 6 14.9543 6 26C6 30.8298 7.71261 35.2599 10.5739 38.7185L7 46L14.7725 42.6682C18.006 44.778 21.8601 46 26 46C37.0457 46 46 37.0457 46 26C46 14.9543 37.0457 6 26 6Z" fill="#F59E0B"/>
              <path d="M33.01 27.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.23-1.01c-.36-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99h-3.36c-.54 0-1.22.24-1.22.99 0 9.29 7.73 17 17.01 17 .71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" fill="white"/>
            </svg>
          </a>

          {/* Standalone Green Squircle Chat Button */}
          <button
            onClick={() => {
              setChatOpen(!chatOpen);
              setCallModalOpen(false);
            }}
            className="w-14 h-14 rounded-[22px] bg-[#F59E0B] hover:bg-[#D97706] text-white flex items-center justify-center shadow-xl transition-transform hover:scale-105 relative"
            title="MediaHub AI Chat"
            aria-label="MediaHub AI Chat"
          >
            {/* Chat Bubble Icon with Tail */}
            <svg width="30" height="26" viewBox="0 0 34 30" fill="none">
              <rect width="32" height="20" rx="10" fill="white" />
              <path d="M24 18L26.5 25L20 19.5H24Z" fill="white" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#112C3E] text-[9px] font-bold text-white items-center justify-center">AI</span>
            </span>
          </button>
        </div>
      </div>

      {/* 5. Back to Top Button (Fixed Bottom-Left) */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full border border-[#eaf1f6] bg-white flex items-center justify-center text-[#112c3e] shadow-lg hover:bg-slate-100 transition font-bold"
        title="Back to Top"
        aria-label="Back to Top"
      >
        ↑
      </button>
    </>
  );
}
