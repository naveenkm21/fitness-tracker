"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User as UserIcon,
  Maximize2,
  Eraser,
} from "lucide-react"
import { cn } from "@/lib/utils"

const PAGE_SUGGESTIONS: Record<string, string[]> = {
  "/dashboard": [
    "Plan today's workout based on my history",
    "How am I progressing?",
    "What should I work on next?",
  ],
  "/workout": [
    "What's good form for this exercise?",
    "How many sets and reps should I do?",
    "I'm a beginner — recommend a starting set",
  ],
  "/leaderboard": [
    "How do I climb the ranks faster?",
    "What's a realistic XP goal per week?",
  ],
  "/tutorials": [
    "Which tutorial should I watch first?",
    "Recommend a routine for a beginner",
  ],
  default: [
    "Plan a 20-minute workout",
    "Help me improve my form",
    "Suggest exercises for today",
  ],
}

function pageLabel(path: string | null) {
  if (!path) return ""
  if (path.startsWith("/workout")) return "the Workout page"
  if (path.startsWith("/dashboard")) return "the Dashboard"
  if (path.startsWith("/leaderboard")) return "the Leaderboard"
  if (path.startsWith("/tutorials")) return "the Tutorials page"
  return ""
}

export default function CoachWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const pageContext = useMemo(() => pageLabel(pathname), [pathname])

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/coach",
      body: () => ({ pageContext }),
    }),
  })

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() =>
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }),
      )
    }
  }, [messages, open])

  const isStreaming = status === "submitted" || status === "streaming"

  const submit = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return
    sendMessage({ text: trimmed })
    setInput("")
  }

  const suggestions =
    (pathname && PAGE_SUGGESTIONS[pathname]) ||
    Object.entries(PAGE_SUGGESTIONS).find(([k]) => k !== "default" && pathname?.startsWith(k))?.[1] ||
    PAGE_SUGGESTIONS.default

  // Hide on the dedicated /coach page
  if (pathname === "/coach") return null
  // Hide on landing/auth/public pages
  const PROTECTED = ["/dashboard", "/workout", "/leaderboard", "/tutorials"]
  if (!PROTECTED.some((p) => pathname?.startsWith(p))) return null

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className={cn(
              "fixed bottom-6 right-6 z-50 group",
              "h-14 w-14 rounded-full gradient-bg text-white shadow-lg shadow-primary/30",
              "grid place-items-center transition hover:scale-105 active:scale-95",
            )}
            aria-label="Open FitCoach"
          >
            <Sparkles className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-background animate-pulse" />
            <span className="absolute right-full mr-3 whitespace-nowrap rounded-md bg-foreground text-background px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none">
              Ask FitCoach
            </span>
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col gap-0"
        >
          <SheetHeader className="border-b p-4 flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <div className="grid place-items-center h-9 w-9 rounded-lg gradient-bg text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <SheetTitle className="text-base">FitCoach</SheetTitle>
                <p className="text-xs text-muted-foreground">
                  {pageContext ? `Helping you on ${pageContext}` : "Your personal trainer"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMessages([])}
                  title="Clear chat"
                >
                  <Eraser className="h-4 w-4" />
                </Button>
              )}
              <Link href="/coach" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Open full chat">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </SheetHeader>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center text-center space-y-3 py-6">
                <div className="grid place-items-center h-14 w-14 rounded-2xl gradient-bg text-white">
                  <Bot className="h-7 w-7" />
                </div>
                <div>
                  <div className="font-semibold">Hey, I've got your back.</div>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    I know your history and what you're up to. What do you need?
                  </p>
                </div>
              </div>
            ) : (
              messages.map((m) => <Message key={m.id} message={m} />)
            )}

            {isStreaming && messages[messages.length - 1]?.role === "user" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Coach is thinking…
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-2.5 text-xs text-destructive">
                {error.message ?? "Something went wrong."}
              </div>
            )}
          </div>

          <div className="border-t p-3 space-y-2 bg-background/50">
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    disabled={isStreaming}
                    className="rounded-full border px-2.5 py-1 text-[11px] hover:bg-secondary transition disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                submit(input)
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                disabled={isStreaming}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="gradient-bg text-white hover:opacity-90"
              >
                {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function Message({ message }: { message: any }) {
  const isUser = message.role === "user"
  const text = (message.parts ?? [])
    .filter((p: any) => p.type === "text")
    .map((p: any) => p.text)
    .join("")

  return (
    <div className={cn("flex gap-2", isUser && "flex-row-reverse")}>
      <Avatar className="h-7 w-7 shrink-0">
        <AvatarFallback
          className={cn(
            isUser
              ? "bg-secondary"
              : "bg-gradient-to-br from-emerald-500 to-violet-500 text-white",
          )}
        >
          {isUser ? <UserIcon className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "rounded-2xl px-3 py-2 max-w-[85%] text-sm whitespace-pre-wrap leading-relaxed",
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
