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
import './Welcome.css'

const JOURNEY = [
  { label: 'Learn', detail: 'Practical modules' },
  { label: 'Practice', detail: 'Realistic dairy data' },
  { label: 'Apply', detail: 'Your company files' },
  { label: 'Analyse', detail: 'AI agent insights' },
  { label: 'Improve', detail: 'Better decisions' },
] as const

const WORKFLOW = [
  { icon: Upload, label: 'Upload CSV' },
  { icon: FileSpreadsheet, label: 'Data checked' },
  { icon: Sparkles, label: 'Agent runs' },
  { icon: BarChart3, label: 'Insights ready' },
] as const

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.42, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Welcome() {
  const pilotCourse = LEARNING_MODULES.find((m) => m.status === 'pilot')
  const pilotAgent = AGENT_CATALOG.find((a) => a.status === 'pilot')
  const upcomingCourses = LEARNING_MODULES.filter((m) => m.status === 'planned').slice(0, 3)

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
            Dairy SME Programme · Capacity building
          </motion.p>
          <motion.h1 className="home-title" variants={fadeUp} custom={1}>
            Build operational skill.
            <span>Make sharper decisions.</span>
          </motion.h1>
          <motion.p className="home-lede" variants={fadeUp} custom={2}>
            A practical platform for dairy companies: learn with guided training, then put AI agents
            to work on your own sales and operations files - without leaving the programme.
          </motion.p>
          <motion.div className="home-cta-row" variants={fadeUp} custom={3}>
            <Link to="/pathways" className="btn btn-primary btn-lg">
              Explore training
              <ArrowRight size={18} />
            </Link>
            <Link to="/agents" className="btn btn-secondary btn-lg">
              <Bot size={18} />
              Run an AI agent
            </Link>
          </motion.div>
          <motion.ul className="home-trust" variants={fadeUp} custom={4}>
            <li>
              <CheckCircle2 size={16} /> Grounded in dairy operations
            </li>
            <li>
              <CheckCircle2 size={16} /> Works with CSV exports
            </li>
            <li>
              <CheckCircle2 size={16} /> Built for non-technical teams
            </li>
          </motion.ul>
        </motion.div>

        <motion.aside
          className="home-hero-visual"
          aria-label="How learning connects to AI insights"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flow-card">
            <p className="flow-kicker">Learning → Insight loop</p>
            <ol className="flow-nodes">
              {[
                { t: 'Training', d: 'Skills & practice data' },
                { t: 'Knowledge', d: 'Dairy context & rules' },
                { t: 'Business data', d: 'Your CSV exports' },
                { t: 'AI agent', d: 'Forecast & explain' },
                { t: 'Decision', d: 'Manager reviews' },
              ].map((node, i) => (
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

      <section className="home-journey" aria-label="Programme journey">
        <div className="home-section-head">
          <p className="home-eyebrow">How it works</p>
          <h2>One journey from skill to decision</h2>
        </div>
        <ol className="journey-track">
          {JOURNEY.map((step, i) => (
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
          <p className="home-eyebrow">Learning</p>
          <h2>Training that mirrors the plant floor</h2>
          <p>
            Self-paced modules with practice tables, exercises, and a knowledge check - then the
            same agent on a company file.
          </p>
          {pilotCourse && (
            <Link to={`/modules/${pilotCourse.id}`} className="featured-course">
              <div>
                <span className="pill pill-live">Available now</span>
                <h3>{pilotCourse.title}</h3>
                <p>{pilotCourse.duration} demo · full course 45–90 min</p>
              </div>
              <ArrowRight size={18} />
            </Link>
          )}
          <Link to="/pathways" className="btn btn-secondary">
            Browse all courses
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
          <p className="home-eyebrow">AI agents</p>
          <h2>Put your business data to work</h2>
          <p>
            Skip the lesson when you already have numbers. Upload a CSV, run a specialist agent, and
            chat about the results.
          </p>

          <div className="mini-workflow" aria-hidden>
            {WORKFLOW.map((step, i) => (
              <div key={step.label} className="mini-step">
                <span className="mini-icon">
                  <step.icon size={14} />
                </span>
                <span>{step.label}</span>
                {i < WORKFLOW.length - 1 && <span className="mini-arrow">→</span>}
              </div>
            ))}
          </div>

          {pilotAgent && (
            <Link to={`/agents/${pilotAgent.id}`} className="btn btn-primary">
              Open {pilotAgent.name.replace(' agent', '')}
              <ArrowRight size={16} />
            </Link>
          )}
        </motion.div>
      </section>

      <section className="home-upcoming">
        <div className="home-section-head row">
          <div>
            <p className="home-eyebrow">Coming through consultation</p>
            <h2>More training on the roadmap</h2>
          </div>
          <Link to="/pathways" className="text-link">
            View catalogue <ArrowRight size={16} />
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
              <span className="upcoming-num">Module {mod.number}</span>
              <h3>{mod.title}</h3>
              <p>{mod.description}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  )
}
