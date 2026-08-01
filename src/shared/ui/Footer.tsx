import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { FaVk } from "react-icons/fa"
import styles from './Footer.module.css'
import { useContent } from '../../hooks/useContent'
import logo from '../../assets/logo.png'
import { NavLink } from 'react-router-dom'

export function Footer() {
  const { contact, footer, links } = useContent()

  return (
    <footer id="footer" className={styles.footer}>
      <img src={logo} className={styles.logo} />
      <div className={styles.container}>
        <div className={styles.section}>
          <h2 className={styles.head}>Разделы сайта</h2>
          <nav className={styles.nav} aria-label="Primary navigation">
            {links.filter(item => item.to !== '/contacts').map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={styles.link}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className={styles.section}>
          <h2 className={styles.head}>Информация</h2>
          <nav className={styles.nav} aria-label="Primary navigation">
            <NavLink
              key='/privacy_policy'
              to='/privacy_policy'
              className={styles.link}
            >
              Политика конфиденциальности
            </NavLink>
            <NavLink
              key='/use_rules'
              to='/use_rules'
              className={styles.link}
            >
              Условия использования
            </NavLink>
          </nav>
        </div>
        <div className={styles.section}>
          <h2 className={styles.head}>Контакты</h2>
          <div className={styles.details}>
            <a href={`mailto:${contact?.email ?? ''}`} className={styles.item}>
              <FiMail />
              <span>{contact?.email ?? 'vovabreshko@mail.ru'}</span>
            </a>
            <a href={`tel:${contact?.phone ?? '+79620751111'}`} className={styles.item}>
              <FiPhone />
              <span>{contact?.phone ?? '+79620751111'}</span>
            </a>
            <div className={styles.item}>
              <FiMapPin />
              <span>{contact?.address ?? 'Красноярск, ул. Курчатова, 11А'}</span>
            </div>
            {contact.socials.map((social) => (
              <a href={social.url} className={styles.item}>
                <FaVk />
                <span>{social?.label ?? 'Группа ВК'}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <p className={styles.copy}>
        {footer?.copyrightText ?? 'All rights reserved.'}
      </p>
      <p className={styles.designed}>
        Designed by &nbsp; <p style={{ fontWeight: 'bold', fontStyle: 'italic' }}>MAZE</p>
      </p>
    </footer>
  )
}
