import { Sun, Moon, GraduationCap } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
 
export default function Header({ theme, toggleTheme }) {
  const location = useLocation()
 
  const navLinks = [
    { path: '/',          label: 'Events'    },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/admin',     label: 'Admin'     },
  ]
 
  const styles = {
    header: {
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backdropFilter: 'blur(12px)',
      transition: 'background 0.3s',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontFamily: 'var(--font-head)',
      fontSize: '22px',
      fontWeight: '900',
      letterSpacing: '-0.5px',
      color: 'var(--text)',
      textDecoration: 'none',
    },
    logoIcon: {
      color: 'var(--accent)',
    },
    logoSpan: {
      color: 'var(--accent)',
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    navRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    themeBtn: {
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      color: 'var(--text)',
      width: '36px',
      height: '36px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginLeft: '8px',
    },
  }
 
  return (
    <header style={styles.header}>
      {/* Logo */}
      <Link to="/" style={styles.logo}>
        <GraduationCap size={24} style={styles.logoIcon} />
        Academi<span style={styles.logoSpan}>X</span>
      </Link>
 
      {/* Nav + Theme Toggle */}
      <div style={styles.navRight}>
        <nav style={styles.nav}>
          {navLinks.map(link => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  color: isActive ? 'var(--accent)' : 'var(--muted)',
                  background: isActive ? 'var(--accent-glow)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
 
        {/* Dark / Light Toggle */}
        <button
          onClick={toggleTheme}
          style={styles.themeBtn}
          title="Toggle theme"
        >
          {theme === 'dark'
            ? <Sun size={16} color="var(--accent)" />
            : <Moon size={16} color="var(--accent)" />
          }
        </button>
      </div>
    </header>
  )
}