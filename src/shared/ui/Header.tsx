import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import styles from './Header.module.css'
import logo from '../../assets/logo.png'
import { useContent } from '../../hooks/useContent'

export function Header() {
  const [open, setOpen] = useState(false)
  const { links } = useContent()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleContactsClick = () => {
    setOpen(false)
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" aria-label="Kray Music home">
          <img className={styles.logo} src={logo}/>
        </NavLink>
        <button
          type="button"
          className={styles.burger}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
        <nav className={`${styles.nav} ${open ? styles.open : ''}`} aria-label="Primary navigation">
          {links.filter(link => link.to !== '/').map((link) => (
            link.to === '/contacts' ? (
              <button
                key={link.to}
                type="button"
                className={styles.linkButton}
                onClick={handleContactsClick}
                style={{textAlign: 'left', padding: 0}}
              >
                {link.label}
              </button>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }: { isActive: boolean }) => `${styles.link} ${isActive ? styles.active : ''}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            )
          ))}
        </nav>
      </div>
    </header>
  )
}
