import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import { LEARNING_MODULES } from '../data/learningModules'
import './Platform2.css'

type Filter = 'all' | 'available' | 'upcoming'

export function ModuleCatalog() {
  const [filter, setFilter] = useState<Filter>('all')

  const modules = LEARNING_MODULES.filter((mod) => {
    if (filter === 'available') return mod.status === 'pilot'
    if (filter === 'upcoming') return mod.status === 'planned'
    return true
  })

  return (
    <div className="cb-page">
      <header className="cb-page-head">
        <p className="cb-kicker">Learning pathways</p>
        <h1>Choose a module</h1>
        <p>
          Eleven topics for digital and green transition in dairy SMEs. Modules will be prioritised
          after the company consultation questionnaire.
        </p>
      </header>

      <div className="cb-filters" role="tablist" aria-label="Module filters">
        {(
          [
            ['all', 'All modules'],
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
        {modules.map((mod) => {
          const available = mod.status === 'pilot'
          const item = (
            <>
              <div className="cb-module-list-top">
                <span className="cb-module-num">Module {mod.number}</span>
                <span className={`cb-badge ${mod.status}`}>
                  {available ? 'Available' : 'After consultation'}
                </span>
              </div>
              <h2>{mod.title}</h2>
              <p>{mod.description}</p>
              <p className="cb-module-time">
                {available
                  ? `${mod.duration} to walk through this demo`
                  : `Full session: ${mod.workshopDuration ?? mod.duration}`}
              </p>
              {available ? (
                <span className="cb-module-action">
                  Start module <ArrowRight size={16} />
                </span>
              ) : (
                <span className="cb-module-locked">
                  <Lock size={14} /> Awaiting SME prioritisation
                </span>
              )}
            </>
          )

          return (
            <li key={mod.id}>
              {available ? (
                <Link to={`/modules/${mod.id}`} className="cb-module-list-item is-clickable">
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
