import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Bot, GraduationCap, Home, Menu, X } from 'lucide-react'
import './Layout.css'

const NAV = [
  { to: '/', label: 'Home', end: true, icon: Home },
  { to: '/pathways', label: 'Learning', end: false, icon: GraduationCap },
  { to: '/agents', label: 'Agents', end: false, icon: Bot },
] as const

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">
            <span className="brand-mark" aria-hidden>
              <GraduationCap size={18} strokeWidth={2} />
            </span>
            <div className="brand-copy">
              <p className="brand-kicker">Dairy SME Programme</p>
              <p className="brand-title">Capacity Building</p>
            </div>
          </NavLink>

          <nav className="nav desktop-nav" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-nav"
              className="mobile-nav"
              aria-label="Mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <p className="footer-brand">Dairy SME Programme</p>
          <div className="footer-links">
            <NavLink to="/pathways">Learning</NavLink>
            <NavLink to="/agents">Agents</NavLink>
          </div>
        </div>
      </footer>
    </div>
  )
}
