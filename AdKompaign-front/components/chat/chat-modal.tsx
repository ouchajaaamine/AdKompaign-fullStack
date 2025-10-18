"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { sendChatMessage } from "@/lib/api"

export default function ChatModal({ open, onClose, initialCampaignId }: { open: boolean; onClose: () => void; initialCampaignId?: number }) {
  const [messages, setMessages] = useState<{ from: "user" | "bot"; text: string }[]>([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  async function send() {
    if (!text.trim()) return
    const userText = text.trim()
    setMessages((m) => [...m, { from: "user", text: userText }])
    setText("")
    setLoading(true)
    try {
      const res = await sendChatMessage(userText, initialCampaignId)
      const bot = res?.answer || res?.response || "No response"
      setMessages((m) => [...m, { from: "bot", text: bot }])
    } catch (e) {
      setMessages((m) => [...m, { from: "bot", text: "Error contacting chat service." }])
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-lg bg-popover p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium">AI Assistant</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-3 mb-3">
          {messages.length === 0 && <p className="text-sm text-muted-foreground">Ask me about campaigns, revenue, or quick suggestions.</p>}
          {messages.map((m, i) => (
            <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
              <div className={`inline-block rounded-lg p-2 ${m.from === "user" ? "bg-primary/80 text-primary-foreground" : "bg-card text-foreground"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send() }}
            className="flex-1 rounded border px-3 py-2 bg-input text-foreground"
            placeholder="Type your question..."
          />
          <button onClick={send} className="rounded bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50" disabled={loading}>
            {loading ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  )
}
