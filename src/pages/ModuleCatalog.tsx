import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Clock3, Lock, Sparkles } from 'lucide-react'
import { LEARNING_MODULES } from '../data/learningModules'
import { useI18n } from '../i18n/I18nProvider'
import './Catalog.css'

type Filter = 'all' | 'available' | 'upcoming'

export function ModuleCatalog() {
  const { t } = useI18n()
  const [filter, setFilter] = useState<Filter>('all')

  const modules = LEARNING_MODULES.filter((mod) => {
    if (filter === 'available') return mod.status === 'pilot'
    if (filter === 'upcoming') return mod.status === 'planned'
    return true
  })

  return (
    <div className="catalog">
      <header className="catalog-hero">
        <p className="catalog-eyebrow">{t('catalog.learning.eyebrow')}</p>
        <h1>{t('catalog.learning.title')}</h1>
        <p className="catalog-lede">{t('catalog.learning.lede')}</p>
      </header>

      <div className="catalog-toolbar" role="tablist" aria-label={t('catalog.learning.eyebrow')}>
        {(
          [
            ['all', t('catalog.filter.allCourses')],
            ['available', t('catalog.filter.available')],
            ['upcoming', t('catalog.filter.upcoming')],
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
          <h2>{t('catalog.emptyCourses')}</h2>
          <p>{t('catalog.emptyHint')}</p>
        </div>
      ) : (
        <ul className="catalog-grid">
          {modules.map((mod, i) => {
            const available = mod.status === 'pilot'
            const body = (
              <>
                <div className="catalog-card-top">
                  <span className="catalog-meta">
                    {t('catalog.module')} {mod.number}
                  </span>
                  <span className={`catalog-badge ${available ? 'live' : 'soon'}`}>
                    {available ? t('catalog.available') : t('catalog.afterConsultation')}
                  </span>
                </div>
                <h2>{mod.title}</h2>
                <p>{mod.description}</p>
                <div className="catalog-card-foot">
                  <span className="catalog-time">
                    <Clock3 size={14} />
                    {available ? mod.duration : (mod.fullDuration ?? mod.duration)}
                  </span>
                  {available ? (
                    <span className="catalog-cta">
                      {t('catalog.start')} <ArrowRight size={16} className="dir-aware-icon" />
                    </span>
                  ) : (
                    <span className="catalog-locked">
                      <Lock size={14} /> {t('catalog.locked')}
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
