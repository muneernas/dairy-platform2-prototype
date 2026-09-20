import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Bot, GraduationCap, Home, Languages, Menu, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import type { Locale } from '../i18n/translations'
import './Layout.css'

export function Layout() {
  const { t, locale, setLocale, locales, dir } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const NAV = [
    { to: '/', label: t('nav.home'), end: true, icon: Home },
    { to: '/pathways', label: t('nav.learning'), end: false, icon: GraduationCap },
    { to: '/agents', label: t('nav.agents'), end: false, icon: Bot },
  ] as const

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
    <div className="app-shell" data-dir={dir}>
      <div className="app-atmosphere" aria-hidden />
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">
            <span className="brand-mark" aria-hidden>
              <span className="brand-mark-dot" />
              <GraduationCap size={18} strokeWidth={2.25} />
            </span>
            <div className="brand-copy">
              <p className="brand-kicker">{t('brand.kicker')}</p>
              <p className="brand-title">{t('brand.title')}</p>
            </div>
          </NavLink>

          <nav className="nav desktop-nav" aria-label={t('nav.primary')}>
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <item.icon size={15} strokeWidth={2.25} aria-hidden />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar-actions">
            <label className="lang-switch" title={t('lang.label')}>
              <Languages size={15} aria-hidden />
              <span className="visually-hidden">{t('lang.label')}</span>
              <select
                value={locale}
                aria-label={t('lang.label')}
                onChange={(e) => setLocale(e.target.value as Locale)}
              >
                {locales.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.native}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="mobile-nav"
              className="mobile-nav"
              aria-label={t('nav.mobile')}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
            >
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `mobile-nav-link${isActive ? ' active' : ''}`}
                >
                  <item.icon size={18} aria-hidden />
                  {item.label}
                </NavLink>
              ))}
              <label className="lang-switch lang-switch-mobile">
                <Languages size={15} aria-hidden />
                <select
                  value={locale}
                  aria-label={t('lang.label')}
                  onChange={(e) => setLocale(e.target.value as Locale)}
                >
                  {locales.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.native}
                    </option>
                  ))}
                </select>
              </label>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div>
            <p className="footer-brand">{t('brand.kicker')}</p>
            <p className="footer-note">{t('footer.note')}</p>
          </div>
          <div className="footer-links">
            <NavLink to="/pathways">{t('nav.learning')}</NavLink>
            <NavLink to="/agents">{t('nav.agents')}</NavLink>
          </div>
        </div>
      </footer>
    </div>
  )
}
