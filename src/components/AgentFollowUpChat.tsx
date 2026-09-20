import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { askForecastAgent } from '../lib/nexosClient'
import type { AgentReplySource, ChatTurn } from '../lib/nexosStyleAgent'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  source?: AgentReplySource
  knowledgeUsed?: string[]
  fallbackReason?: string
}

interface Props {
  /** Context string sent with the question (run results + data summary). */
  runContext: string
  placeholder?: string
}

function sourceLabel(source: AgentReplySource | undefined): string {
  if (source === 'nexos') return 'nexos.ai'
  if (source === 'stand-in') return 'Live LLM + knowledge base'
  if (source === 'mock') return 'Offline knowledge base'
  return 'Forecast agent'
}

export function AgentFollowUpChat({
  runContext,
  placeholder = 'Ask about yogurt volatility, waste risk, signals…',
}: Props) {
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'I’ve analysed this run. Ask me anything about the forecast, external signals, risks, or what to do next — I’ll reply in this chat.',
      source: 'stand-in',
    },
  ])
  const threadRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = threadRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, loading])

  async function sendMessage(text: string) {
    const question = text.trim()
    if (!question || loading) return

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: question,
    }

    const historyForApi: ChatTurn[] = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }))

    setMessages((prev) => [...prev, userMsg])
    setDraft('')
    setLoading(true)

    const result = await askForecastAgent(question, runContext, historyForApi)

    setMessages((prev) => [
      ...prev,
      {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: result.content,
        source: result.source,
        knowledgeUsed: result.knowledgeUsed,
        fallbackReason: result.fallbackReason,
      },
    ])
    setLoading(false)
    inputRef.current?.focus()
  }

  const suggestions = [
    'Why is yogurt high volatility?',
    'Which signal drove the spike?',
    'How do I cut waste risk?',
  ]

  return (
    <div className="cb-chat">
      <div className="cb-chat-head">
        <Sparkles size={18} aria-hidden />
        <div>
          <p className="cb-info-label">Chat with the forecast agent</p>
          <p className="cb-muted cb-ask-hint">
            Multi-turn Q&amp;A on this run — same pattern as a nexos agent follow-up.
          </p>
        </div>
      </div>

      <div className="cb-chat-thread" ref={threadRef} role="log" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`cb-chat-bubble cb-chat-${m.role}`}>
            <span className="cb-chat-who">{m.role === 'user' ? 'You' : sourceLabel(m.source)}</span>
            <div className="cb-chat-text">{m.content}</div>
            {m.fallbackReason && (
              <p className="cb-feedback warn cb-llm-fallback">{m.fallbackReason}</p>
            )}
            {m.knowledgeUsed && m.knowledgeUsed.length > 0 && m.role === 'assistant' && (
              <p className="cb-kb-used">Knowledge: {m.knowledgeUsed.join(' · ')}</p>
            )}
          </div>
        ))}
        {loading && (
          <div className="cb-chat-bubble cb-chat-assistant cb-chat-typing">
            <span className="cb-chat-who">Agent</span>
            <div className="cb-chat-text">
              <span className="cb-typing-dot" />
              <span className="cb-typing-dot" />
              <span className="cb-typing-dot" />
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="cb-chat-suggestions">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="cb-chat-chip"
              disabled={loading}
              onClick={() => void sendMessage(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="cb-chat-composer"
        onSubmit={(e) => {
          e.preventDefault()
          void sendMessage(draft)
        }}
      >
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          rows={2}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void sendMessage(draft)
            }
          }}
        />
        <button
          type="submit"
          className="btn btn-primary cb-chat-send"
          disabled={loading || !draft.trim()}
          aria-label="Send message"
        >
          <Send size={16} />
          {loading ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
