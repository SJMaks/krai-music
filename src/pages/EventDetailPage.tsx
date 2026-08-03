import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { eventsData } from '../cms/data'
import styles from './EventDetailPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { FiCalendar, FiMapPin, FiArrowLeft } from 'react-icons/fi'

export default function EventDetailPage() {
  const { slug } = useParams()

  const event = useMemo(() => eventsData.find((entry) => entry.id === slug || entry.title.toLowerCase() === slug?.toLowerCase()), [slug])

  if (!event) {
    return (
      <section className={styles.page}>
        <Seo title="Мероприятие не найдено" description="Запрашиваемое мероприятие не найдено." />
        <p>Мероприятие не найдено.</p>
      </section>
    )
  }

  return (
    <>
      <Seo title={event.title} description={`${event.title} — мероприятие Kray Music.`} />
      <section className={styles.page}>
        <Link to="/events" className={styles.backLink}>
          <FiArrowLeft />
          <span>К мероприятиям</span>
        </Link>
        <article className={styles.card}>
          <img src={event.image} alt={event.title} className={styles.image} />
          <div className={styles.content}>
            <p className={styles.eyebrow}>Мероприятие</p>
            <h1>{event.title}</h1>
            <p className={styles.description}>{event.description}</p>
            <div className={styles.item}>
              <FiCalendar />
              <span>{event.date}</span>
            </div>
            <div className={styles.item}>
              <FiMapPin />
              <span>{event.location}</span>
            </div>
            {event.externalLinks.length > 0 && (
              <div className={styles.links}>
                {event.externalLinks.map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </article>
      </section>
    </>
  )
}
