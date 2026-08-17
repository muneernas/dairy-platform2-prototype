import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Bot } from 'lucide-react'
import './Platform2.css'

export function Welcome() {
  return (
    <div className="cb-page cb-welcome">
      <section className="cb-hero">
        <p className="cb-kicker">Platform 2 · Capacity building</p>
        <h1>Learn with modules, or run an agent on your data</h1>
        <p className="cb-lede">
          Use learning modules to build skill step by step. If your company files are already
          ready, open an operational agent, upload a CSV, and run the analysis without the lesson.
        </p>
      </section>

      <div className="cb-path-grid">
        <Link to="/pathways" className="cb-card cb-path-card">
          <span className="cb-step-icon" aria-hidden>
            <BookOpen size={20} />
          </span>
          <h2>Learning modules</h2>
          <p>
            Guided path: objectives, simulated data, exercises, knowledge check, then apply to
            company files.
          </p>
          <span className="cb-module-action">
            Choose a module <ArrowRight size={16} />
          </span>
        </Link>
        <Link to="/agents" className="cb-card cb-path-card">
          <span className="cb-step-icon" aria-hidden>
            <Bot size={20} />
          </span>
          <h2>Use an agent</h2>
          <p>
            No teaching screens. Pick an agent, upload your sales or operations file, and get
            recommendations.
          </p>
          <span className="cb-module-action">
            Choose an agent <ArrowRight size={16} />
          </span>
        </Link>
      </div>
    </div>
  )
}
