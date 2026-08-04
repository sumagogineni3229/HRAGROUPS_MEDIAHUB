"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  sender: { name: string | null; role: string };
}

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  taskId: string;
  onSendMessage: (formData: FormData) => Promise<void>;
}

export function MessageThread({
  messages,
  currentUserId,
  taskId,
  onSendMessage,
}: MessageThreadProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // 5 seconds polling fallback to refresh server-side messages
    const timer = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(timer);
  }, [router]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    const fd = new FormData();
    fd.append("taskId", taskId);
    fd.append("content", text.trim());

    startTransition(async () => {
      await onSendMessage(fd);
      setText("");
    });
  }

  return (
    <div className="flex flex-col" style={{ minHeight: "320px" }}>
      {/* Message list */}
      <div
        className="flex-1 overflow-y-auto flex flex-col gap-4 mb-4"
        style={{ maxHeight: "400px", paddingRight: "4px" }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center flex-1 py-12 text-muted font-inter text-sm">
            No messages yet. Start the conversation.
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: isOwn ? "#3E4FEA" : "#64748b" }}
                >
                  {(msg.sender.name || "U")[0].toUpperCase()}
                </div>
                {/* Bubble */}
                <div
                  className={`rounded-xl px-4 py-3 text-sm font-inter max-w-[75%] ${
                    isOwn
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-app text-dark rounded-tl-none"
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                  <p
                    suppressHydrationWarning
                    className={`text-xs mt-1.5 ${
                      isOwn ? "text-blue-200" : "text-muted"
                    }`}
                  >
                    {msg.sender.name || "User"} ·{" "}
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <form onSubmit={handleSend} className="flex gap-3 pt-4 border-t border-border">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="input flex-1"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="btn btn-primary flex items-center gap-2 font-space font-semibold"
          style={{ padding: "10px 18px", borderRadius: "8px" }}
        >
          <PaperAirplaneIcon className="w-4 h-4" />
          Send
        </button>
      </form>
    </div>
  );
}
