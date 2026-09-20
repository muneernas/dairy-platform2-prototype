import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Clock3, Lock, Sparkles } from 'lucide-react'
import { LEARNING_MODULES } from '../data/learningModules'
import './Catalog.css'

type Filter = 'all' | 'available' | 'upcoming'

export function ModuleCatalog() {
  const [filter, setFilter] = useState<Filter>('all')

  const modules = LEARNING_MODULES.filter((mod) => {
    if (filter === 'available') return mod.status === 'pilot'
    if (filter === 'upcoming') return mod.status === 'planned'
    return true
  })

  return (
    <div className="catalog">
      <header className="catalog-hero">
        <p className="catalog-eyebrow">Learning</p>
        <h1>Training built for dairy operations</h1>
        <p className="catalog-lede">
          Practical modules for digital and green transition. Start with what is live today, then
          unlock more topics after your company consultation.
        </p>
      </header>

      <div className="catalog-toolbar" role="tablist" aria-label="Course filters">
        {(
          [
            ['all', 'All courses'],
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

      {modules.length === 0 ? (
        <div className="catalog-empty">
          <Sparkles size={22} />
          <h2>No courses in this filter</h2>
          <p>Try “All courses” to see the full catalogue.</p>
        </div>
      ) : (
        <ul className="catalog-grid">
          {modules.map((mod, i) => {
            const available = mod.status === 'pilot'
            const body = (
              <>
                <div className="catalog-card-top">
                  <span className="catalog-meta">Module {mod.number}</span>
                  <span className={`catalog-badge ${available ? 'live' : 'soon'}`}>
                    {available ? 'Available' : 'After consultation'}
                  </span>
                </div>
                <h2>{mod.title}</h2>
                <p>{mod.description}</p>
                <div className="catalog-card-foot">
                  <span className="catalog-time">
                    <Clock3 size={14} />
                    {available
                      ? `${mod.duration} demo`
                      : mod.fullDuration ?? mod.duration}
                  </span>
                  {available ? (
                    <span className="catalog-cta">
                      Start course <ArrowRight size={16} />
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
                key={mod.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.35 }}
              >
                {available ? (
                  <Link to={`/modules/${mod.id}`} className="catalog-card is-live">
                    {body}
                  </Link>
                ) : (
                  <div className="catalog-card is-locked">{body}</div>
                )}
              </motion.li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
