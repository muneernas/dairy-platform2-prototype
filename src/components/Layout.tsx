import { NavLink, Outlet } from 'react-router-dom'
import { BookOpen, GraduationCap } from 'lucide-react'
import './Layout.css'

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            <GraduationCap size={18} />
          </span>
          <div>
            <p className="brand-kicker">Dairy sector · SME programme</p>
            <h1 className="brand-title">Platform 2 — Capacity Building</h1>
          </div>
        </div>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end className="nav-link">
            <BookOpen size={16} /> Learning modules
          </NavLink>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        Platform 2 prototype — module-based AI capacity building for dairy SMEs
      </footer>
    </div>
  )
}
