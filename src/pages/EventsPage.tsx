import { eventsData } from '../cms/data'
import styles from './EventsPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { FiMapPin, FiCalendar } from 'react-icons/fi'

export default function EventsPage() {
  return (
    <>
      <Seo title="Мероприятия" description="Актуальные события и показы лейбла Kray Music." />
      <section className={styles.page}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Мероприятия</p>
          <h1>Уникальные события</h1>
        </div>
        <div className={styles.list}>
          {eventsData.map((event, index) => (
            <article key={event.id} className={`${styles.card} ${index % 2 === 1 ? styles.reverse : ''}`}>
              <img src={event.image} alt={event.title} className={styles.image} />
              <div className={styles.content}>
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <div className={styles.item}>
                  <FiCalendar />
                  <p>{event.date}</p>
                </div>
                <div className={styles.item}>
                  <FiMapPin />
                  <p>{event.location}</p>
                </div>
                <div className={styles.links}>
                  {event.externalLinks.map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
