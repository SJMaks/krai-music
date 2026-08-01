import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'
import { Seo } from '../shared/ui/Seo'

export default function NotFoundPage() {
  return (
    <>
      <Seo title="Страница не найдена" description="Запрашиваемая страница не найдена на Kray Music." />
      <section className={styles.page}>
      <p className={styles.eyebrow}>404</p>
      <h1>Страница не найдена</h1>
      <p>Но вы можете найти вдохновение на радио КрайMusic!</p>
      <Link to="/radio" className={styles.link}>Поймать волну</Link>
    </section>
    </>
  )
}
