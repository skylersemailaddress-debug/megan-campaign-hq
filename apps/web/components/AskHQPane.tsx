"use client";

import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://megancampaginhq-production.up.railway.app";

export default function AskHQPane() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const trimmed = message.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setReply("");

    try {
      const res = await fetch(`${API_BASE}/hq/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReply(data?.error || "Ask HQ request failed.");
      } else {
        setReply(data?.reply || "No reply returned.");
      }
    } catch (err: any) {
      setReply(err?.message || "Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#020817] p-5 text-white">
      <h2 className="mb-3 text-2xl font-semibold">Ask HQ</h2>

      <div className="mb-3 rounded-2xl border border-slate-800 bg-[#06101f] p-3 text-sm text-slate-300 min-h-[220px] whitespace-pre-wrap">
        {reply || "Ask HQ is live. Try: Generate today's campaign brief."}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask HQ anything..."
        className="mb-3 min-h-[120px] w-full rounded-2xl border border-slate-700 bg-[#0f172a] p-3 text-white outline-none"
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        className="rounded-xl border border-slate-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}
