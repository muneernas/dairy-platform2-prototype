import { NavLink, Outlet } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import './Layout.css'

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark" aria-hidden>
            <GraduationCap size={18} />
          </span>
          <div>
            <p className="brand-kicker">Dairy SME programme</p>
            <p className="brand-title">Capacity Building Platform</p>
          </div>
        </NavLink>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/pathways" className="nav-link">
            Learning modules
          </NavLink>
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
