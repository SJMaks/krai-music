import { useContent } from '../hooks/useContent'
import styles from './ContactPage.module.css'
import { Seo } from '../shared/ui/Seo'

export default function ContactPage() {
  const { contact } = useContent()

  return (
    <>
      <Seo title="Контакты" description="Свяжитесь с Kray Music для сотрудничества и бронирования выступлений." />
      <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Контакты</p>
        <h1>Свяжитесь с лейблом</h1>
      </div>
      <div className={styles.grid}>
        <article className={styles.card}>
          <h2>E-mail</h2>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </article>
        <article className={styles.card}>
          <h2>Телефон</h2>
          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
        </article>
        <article className={styles.card}>
          <h2>Адрес</h2>
          <p>{contact.address}</p>
        </article>
      </div>
    </section>
    </>
  )
}
