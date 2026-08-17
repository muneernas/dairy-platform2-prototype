import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import { AGENT_CATALOG } from '../data/agents'
import './Platform2.css'

type Filter = 'all' | 'available' | 'upcoming'

export function AgentCatalog() {
  const [filter, setFilter] = useState<Filter>('all')

  const agents = AGENT_CATALOG.filter((agent) => {
    if (filter === 'available') return agent.status === 'pilot'
    if (filter === 'upcoming') return agent.status === 'planned'
    return true
  })

  return (
    <div className="cb-page">
      <header className="cb-page-head">
        <p className="cb-kicker">Operational agents</p>
        <h1>Use an agent on your data</h1>
        <p>
          Skip the lesson if you already have company files. Choose an agent, upload a CSV, and run
          the analysis. Learning modules stay available if you want the teaching path first.
        </p>
      </header>

      <div className="cb-filters" role="tablist" aria-label="Agent filters">
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
            className={`cb-filter ${filter === id ? 'is-active' : ''}`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="cb-module-list">
        {agents.map((agent) => {
          const available = agent.status === 'pilot'
          const item = (
            <>
              <div className="cb-module-list-top">
                <span className="cb-module-num">Agent {agent.number}</span>
                <span className={`cb-badge ${agent.status}`}>
                  {available ? 'Available' : 'After consultation'}
                </span>
              </div>
              <h2>{agent.name}</h2>
              <p>{agent.purpose}</p>
              {available ? (
                <span className="cb-module-action">
                  Open agent <ArrowRight size={16} />
                </span>
              ) : (
                <span className="cb-module-locked">
                  <Lock size={14} /> Awaiting SME prioritisation
                </span>
              )}
            </>
          )

          return (
            <li key={agent.id}>
              {available ? (
                <Link to={`/agents/${agent.id}`} className="cb-module-list-item is-clickable">
                  {item}
                </Link>
              ) : (
                <div className="cb-module-list-item is-locked">{item}</div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
