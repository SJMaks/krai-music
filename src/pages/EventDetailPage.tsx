import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { eventsData } from '../cms/data'
import styles from './EventDetailPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { FiCalendar, FiMapPin, FiArrowLeft } from 'react-icons/fi'
import { getMediaUrl } from '../shared/lib/media'

function formatDate(dateString?: string): string {
  if (!dateString) return 'Дата не указана';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export default function EventDetailPage() {
  const { id } = useParams()

  const event = useMemo(() => eventsData.find((entry) => entry.id === id || entry.title.toLowerCase() === id?.toLowerCase()), [id])

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
          <img src={getMediaUrl(event.image)} alt={event.title} className={styles.image} />
          <div className={styles.content}>
            <p className={styles.eyebrow}>Мероприятие</p>
            <h1>{event.title}</h1>
            <p className={styles.description}>{event.description}</p>
            <div className={styles.item}>
              <FiCalendar />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className={styles.item}>
              <FiMapPin />
              <span>{event.location}</span>
            </div>
            {event.links.length > 0 && (
              <div className={styles.links}>
                {event.links.map((link) => (
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
