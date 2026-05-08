"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import DashboardHeader from "@/components/dashboard-header"
import { Sparkles, Send, Loader2, Bot, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const SUGGESTIONS = [
  "Build me a 20-minute beginner full-body workout",
  "How can I improve my squat depth?",
  "I only have 10 minutes — what should I do?",
  "Why am I sore after push-ups? Is that bad?",
  "Plan my next 7 days based on my history",
]

export default function CoachPage() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/coach" }),
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const isStreaming = status === "submitted" || status === "streaming"

  const submit = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return
    sendMessage({ text: trimmed })
    setInput("")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-3xl flex flex-col h-[calc(100vh-9rem)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid place-items-center h-10 w-10 rounded-xl gradient-bg text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                FitCoach <Badge variant="secondary" className="text-[10px]">AI</Badge>
              </h1>
              <p className="text-sm text-muted-foreground">
                Your personal trainer — knows your stats, plans your workouts.
              </p>
            </div>
          </div>

          <Card className="flex-1 flex flex-col overflow-hidden">
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
                  <div className="grid place-items-center h-16 w-16 rounded-2xl gradient-bg text-white">
                    <Bot className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Hey, I'm your coach.</div>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Ask me anything about training, form, or planning. I've already pulled up your recent activity.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => submit(s)}
                        disabled={isStreaming}
                        className="rounded-full border px-3 py-1.5 text-xs hover:bg-secondary transition disabled:opacity-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => <Message key={m.id} message={m} />)
              )}

              {isStreaming && messages[messages.length - 1]?.role === "user" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Coach is thinking…
                </div>
              )}

              {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
                  {error.message ?? "Something went wrong."}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit(input)
              }}
              className="border-t p-3 flex gap-2 bg-background/50"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your coach…"
                disabled={isStreaming}
                className="flex-1"
              />
              <Button type="submit" disabled={isStreaming || !input.trim()} className="gradient-bg text-white hover:opacity-90">
                {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </Card>

          <p className="text-[10px] text-muted-foreground text-center mt-3">
            FitCoach is AI-generated. For medical concerns, consult a professional.
          </p>
        </div>
      </main>
    </div>
  )
}

function Message({ message }: { message: any }) {
  const isUser = message.role === "user"
  const text = (message.parts ?? [])
    .filter((p: any) => p.type === "text")
    .map((p: any) => p.text)
    .join("")

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <Avatar className={cn("h-8 w-8 shrink-0", isUser ? "" : "")}>
        <AvatarFallback
          className={cn(
            isUser
              ? "bg-secondary"
              : "bg-gradient-to-br from-emerald-500 to-violet-500 text-white",
          )}
        >
          {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "rounded-2xl px-4 py-2.5 max-w-[80%] text-sm whitespace-pre-wrap leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-secondary rounded-tl-sm",
        )}
      >
        {text}
      </div>
    </div>
  )
}
