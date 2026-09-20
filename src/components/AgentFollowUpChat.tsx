import { useState } from 'react'
import { askForecastAgent } from '../lib/nexosClient'

interface Props {
  /** Context string sent with the question (run results + data summary). */
  runContext: string
  placeholder?: string
}

export function AgentFollowUpChat({
  runContext,
  placeholder = 'e.g. Why is yogurt flagged as high volatility?',
}: Props) {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [reply, setReply] = useState<{
    content: string
    source: 'nexos' | 'stand-in' | 'mock'
    knowledgeUsed?: string[]
  } | null>(null)

  async function handleAsk() {
    if (!question.trim()) return
    setLoading(true)
    const result = await askForecastAgent(question, runContext)
    setReply(result)
    setLoading(false)
  }

  return (
    <div className="cb-ask cb-ask-panel">
      <p className="cb-info-label">Ask the agent about this run</p>
      <p className="cb-muted cb-ask-hint">
        Same data and knowledge base as above — like a nexos follow-up on the last agent run.
      </p>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            void handleAsk()
          }
        }}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => void handleAsk()}
        disabled={loading || !question.trim()}
      >
        {loading ? 'Thinking…' : 'Ask agent'}
      </button>
      {reply && (
        <div className="cb-agent-reply">
          <span className="cb-agent-engine">
            {reply.source === 'nexos'
              ? 'nexos.ai'
              : reply.source === 'stand-in'
                ? 'nexos-style stand-in (free LLM + knowledge base)'
                : 'Offline stand-in (knowledge base heuristics)'}
          </span>
          {reply.content}
          {reply.knowledgeUsed && reply.knowledgeUsed.length > 0 && (
            <p className="cb-kb-used">Knowledge used: {reply.knowledgeUsed.join(' · ')}</p>
          )}
        </div>
      )}
    </div>
  )
}
