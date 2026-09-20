import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
  Upload,
} from 'lucide-react'
import { LEARNING_MODULES } from '../data/learningModules'
import { AGENT_CATALOG } from '../data/agents'
import { useI18n } from '../i18n/I18nProvider'
import './Welcome.css'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Welcome() {
  const { t } = useI18n()
  const pilotCourse = LEARNING_MODULES.find((m) => m.status === 'pilot')
  const pilotAgent = AGENT_CATALOG.find((a) => a.status === 'pilot')
  const upcomingCourses = LEARNING_MODULES.filter((m) => m.status === 'planned').slice(0, 3)

  const journey = [
    { label: t('home.journey.learn'), detail: t('home.journey.learn.d') },
    { label: t('home.journey.practice'), detail: t('home.journey.practice.d') },
    { label: t('home.journey.apply'), detail: t('home.journey.apply.d') },
    { label: t('home.journey.analyse'), detail: t('home.journey.analyse.d') },
    { label: t('home.journey.improve'), detail: t('home.journey.improve.d') },
  ]

  const workflow = [
    { icon: Upload, label: t('home.workflow.upload') },
    { icon: FileSpreadsheet, label: t('home.workflow.checked') },
    { icon: Sparkles, label: t('home.workflow.runs') },
    { icon: BarChart3, label: t('home.workflow.insights') },
  ]

  const flow = [
    { t: t('home.flow.training'), d: t('home.flow.training.d') },
    { t: t('home.flow.knowledge'), d: t('home.flow.knowledge.d') },
    { t: t('home.flow.data'), d: t('home.flow.data.d') },
    { t: t('home.flow.agent'), d: t('home.flow.agent.d') },
    { t: t('home.flow.decision'), d: t('home.flow.decision.d') },
  ]

  return (
    <div className="home">
      <section className="home-hero">
        <motion.div
          className="home-hero-copy"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.p className="home-eyebrow" variants={fadeUp} custom={0}>
            {t('home.eyebrow')}
          </motion.p>
          <motion.h1 className="home-title" variants={fadeUp} custom={1}>
            {t('home.title1')}
            <span>{t('home.title2')}</span>
          </motion.h1>
          <motion.p className="home-lede" variants={fadeUp} custom={2}>
            {t('home.lede')}
          </motion.p>
          <motion.div className="home-cta-row" variants={fadeUp} custom={3}>
            <Link to="/pathways" className="btn btn-primary btn-lg">
              {t('home.cta.training')}
              <ArrowRight size={18} className="dir-aware-icon" />
            </Link>
            <Link to="/agents" className="btn btn-secondary btn-lg">
              <Bot size={18} />
              {t('home.cta.agent')}
            </Link>
          </motion.div>
          <motion.ul className="home-trust" variants={fadeUp} custom={4}>
            <li>
              <CheckCircle2 size={16} /> {t('home.trust1')}
            </li>
            <li>
              <CheckCircle2 size={16} /> {t('home.trust2')}
            </li>
            <li>
              <CheckCircle2 size={16} /> {t('home.trust3')}
            </li>
          </motion.ul>
        </motion.div>

        <motion.aside
          className="home-hero-visual"
          aria-label={t('home.flow.kicker')}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flow-card">
            <p className="flow-kicker">{t('home.flow.kicker')}</p>
            <ol className="flow-nodes">
              {flow.map((node, i) => (
                <li key={node.t}>
                  <span className="flow-index">{i + 1}</span>
                  <div>
                    <strong>{node.t}</strong>
                    <span>{node.d}</span>
                  </div>
                </li>
              ))}
            </ol>
            <div className="flow-pulse" aria-hidden />
          </div>
        </motion.aside>
      </section>

      <section className="home-journey" aria-label={t('home.journey.title')}>
        <div className="home-section-head">
          <p className="home-eyebrow">{t('home.journey.kicker')}</p>
          <h2>{t('home.journey.title')}</h2>
        </div>
        <ol className="journey-track">
          {journey.map((step, i) => (
            <motion.li
              key={step.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <span className="journey-num">{String(i + 1).padStart(2, '0')}</span>
              <strong>{step.label}</strong>
              <span>{step.detail}</span>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="home-split">
        <motion.div
          className="pathway-card pathway-learn"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="pathway-icon" aria-hidden>
            <BookOpen size={22} />
          </div>
          <p className="home-eyebrow">{t('home.learn.eyebrow')}</p>
          <h2>{t('home.learn.title')}</h2>
          <p>{t('home.learn.body')}</p>
          {pilotCourse && (
            <Link to={`/modules/${pilotCourse.id}`} className="featured-course">
              <div>
                <span className="pill pill-live">{t('home.learn.available')}</span>
                <h3>{pilotCourse.title}</h3>
                <p>{pilotCourse.duration}</p>
              </div>
              <ArrowRight size={18} className="dir-aware-icon" />
            </Link>
          )}
          <Link to="/pathways" className="btn btn-secondary">
            {t('home.learn.browse')}
          </Link>
        </motion.div>

        <motion.div
          className="pathway-card pathway-agent"
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="pathway-icon pathway-icon-agent" aria-hidden>
            <Bot size={22} />
          </div>
          <p className="home-eyebrow">{t('home.agents.eyebrow')}</p>
          <h2>{t('home.agents.title')}</h2>
          <p>{t('home.agents.body')}</p>

          <div className="mini-workflow" aria-hidden>
            {workflow.map((step, i) => (
              <div key={step.label} className="mini-step">
                <span className="mini-icon">
                  <step.icon size={14} />
                </span>
                <span>{step.label}</span>
                {i < workflow.length - 1 && <span className="mini-arrow">→</span>}
              </div>
            ))}
          </div>

          {pilotAgent && (
            <Link to={`/agents/${pilotAgent.id}`} className="btn btn-primary">
              {t('home.agents.open')}
              <ArrowRight size={16} className="dir-aware-icon" />
            </Link>
          )}
        </motion.div>
      </section>

      <section className="home-upcoming">
        <div className="home-section-head row">
          <div>
            <p className="home-eyebrow">{t('home.upcoming.eyebrow')}</p>
            <h2>{t('home.upcoming.title')}</h2>
          </div>
          <Link to="/pathways" className="text-link">
            {t('home.upcoming.view')} <ArrowRight size={16} className="dir-aware-icon" />
          </Link>
        </div>
        <div className="upcoming-grid">
          {upcomingCourses.map((mod, i) => (
            <motion.article
              key={mod.id}
              className="upcoming-card"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <span className="upcoming-num">
                {t('catalog.module')} {mod.number}
              </span>
              <h3>{mod.title}</h3>
              <p>{mod.description}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  )
}
