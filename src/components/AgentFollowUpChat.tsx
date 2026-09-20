import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { askForecastAgent } from '../lib/nexosClient'
import type { AgentReplySource, ChatTurn } from '../lib/nexosStyleAgent'
import { useI18n } from '../i18n/I18nProvider'

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

export function AgentFollowUpChat({ runContext, placeholder }: Props) {
  const { t, locale } = useI18n()
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const threadRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function sourceLabel(source: AgentReplySource | undefined): string {
    if (source === 'nexos') return t('chat.sourceNexos')
    if (source === 'stand-in') return t('chat.sourceLive')
    if (source === 'mock') return t('chat.sourceOffline')
    return t('chat.sourceDefault')
  }

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: t('chat.welcome'),
        source: 'stand-in',
      },
    ])
    setDraft('')
  }, [locale, t])

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

    const result = await askForecastAgent(question, runContext, historyForApi, locale)

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

  const suggestions = [t('chat.suggest1'), t('chat.suggest2'), t('chat.suggest3')]
  const inputPlaceholder = placeholder ?? t('chat.placeholder')

  return (
    <div className="cb-chat">
      <div className="cb-chat-head">
        <Sparkles size={18} aria-hidden />
        <div>
          <p className="cb-info-label">{t('chat.head')}</p>
          <p className="cb-muted cb-ask-hint">{t('chat.hint')}</p>
        </div>
      </div>

      <div className="cb-chat-thread" ref={threadRef} role="log" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`cb-chat-bubble cb-chat-${m.role}`}>
            <span className="cb-chat-who">
              {m.role === 'user' ? t('chat.you') : sourceLabel(m.source)}
            </span>
            <div className="cb-chat-text">{m.content}</div>
            {m.fallbackReason && (
              <p className="cb-feedback warn cb-llm-fallback">{m.fallbackReason}</p>
            )}
            {m.knowledgeUsed && m.knowledgeUsed.length > 0 && m.role === 'assistant' && (
              <p className="cb-kb-used">
                {t('chat.knowledge', { items: m.knowledgeUsed.join(' · ') })}
              </p>
            )}
          </div>
        ))}
        {loading && (
          <div className="cb-chat-bubble cb-chat-assistant cb-chat-typing">
            <span className="cb-chat-who">{t('chat.agent')}</span>
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
          placeholder={inputPlaceholder}
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
          aria-label={t('chat.sendAria')}
        >
          <Send size={16} className="dir-aware-icon" />
          {loading ? '…' : t('chat.send')}
        </button>
      </form>
    </div>
  )
}
