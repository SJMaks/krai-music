import { useContent } from '../hooks/useContent'
import styles from './ContactPage.module.css'
import { Seo } from '../shared/ui/Seo'

export default function ContactPage() {
  const { contact } = useContent()

  return (
    <>
      <Seo title="Contacts" description="Get in touch with Kray Music for collaborations and bookings." />
      <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Contacts</p>
        <h1>Reach the label</h1>
      </div>
      <div className={styles.grid}>
        <article className={styles.card}>
          <h2>Email</h2>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </article>
        <article className={styles.card}>
          <h2>Phone</h2>
          <a href={`tel:${contact.phone}`}>{contact.phone}</a>
        </article>
        <article className={styles.card}>
          <h2>Address</h2>
          <p>{contact.address}</p>
        </article>
      </div>
    </section>
    </>
  )
}
