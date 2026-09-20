import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Bot, FileSpreadsheet, Lock, Sparkles } from 'lucide-react'
import { AGENT_CATALOG } from '../data/agents'
import './Catalog.css'

type Filter = 'all' | 'available' | 'upcoming'

export function AgentCatalog() {
  const [filter, setFilter] = useState<Filter>('all')

  const agents = AGENT_CATALOG.filter((agent) => {
    if (filter === 'available') return agent.status === 'pilot'
    if (filter === 'upcoming') return agent.status === 'planned'
    return true
  })

  return (
    <div className="catalog">
      <header className="catalog-hero catalog-hero-agent">
        <p className="catalog-eyebrow">AI agents</p>
        <h1>Run an agent on your company data</h1>
        <p className="catalog-lede">
          Upload a CSV export, get structured recommendations, and chat about the results. No
          lesson required — learning modules stay available if you want the teaching path first.
        </p>
        <div className="agent-strip" aria-hidden>
          <span>
            <FileSpreadsheet size={15} /> CSV in
          </span>
          <span className="agent-strip-sep">→</span>
          <span>
            <Bot size={15} /> Specialist agent
          </span>
          <span className="agent-strip-sep">→</span>
          <span>
            <Sparkles size={15} /> Insights + chat
          </span>
        </div>
      </header>

      <div className="catalog-toolbar" role="tablist" aria-label="Agent filters">
        {(
          [
            ['all', 'All agents'],
            ['available', 'Available now'],
            ['upcoming', 'Coming soon'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            className={`catalog-tab${filter === id ? ' is-active' : ''}`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {agents.length === 0 ? (
        <div className="catalog-empty">
          <Bot size={22} />
          <h2>No agents in this filter</h2>
          <p>Try “All agents” to see the full set.</p>
        </div>
      ) : (
        <ul className="catalog-grid catalog-grid-agents">
          {agents.map((agent, i) => {
            const available = agent.status === 'pilot'
            const body = (
              <>
                <div className="catalog-card-top">
                  <span className="catalog-meta">Agent {agent.number}</span>
                  <span className={`catalog-badge ${available ? 'live' : 'soon'}`}>
                    {available ? 'Ready to run' : 'After consultation'}
                  </span>
                </div>
                <div className="agent-card-icon" aria-hidden>
                  <Bot size={18} />
                </div>
                <h2>{agent.name}</h2>
                <p>{agent.purpose}</p>
                <div className="catalog-card-foot">
                  <span className="catalog-time">CSV upload · structured output</span>
                  {available ? (
                    <span className="catalog-cta">
                      Open agent <ArrowRight size={16} />
                    </span>
                  ) : (
                    <span className="catalog-locked">
                      <Lock size={14} /> Prioritise in consultation
                    </span>
                  )}
                </div>
              </>
            )

            return (
              <motion.li
                key={agent.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.35 }}
              >
                {available ? (
                  <Link to={`/agents/${agent.id}`} className="catalog-card is-live is-agent">
                    {body}
                  </Link>
                ) : (
                  <div className="catalog-card is-locked is-agent">{body}</div>
                )}
              </motion.li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
