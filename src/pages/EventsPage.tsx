import { Link } from 'react-router-dom'
import { eventsData } from '../cms/data'
import styles from './EventsPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { FiMapPin, FiCalendar } from 'react-icons/fi'
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
              <img src={getMediaUrl(event.image)} alt={event.title} className={styles.image} />
              <div className={styles.content}>
                <h2>{event.title}</h2>
                <p>{event.description}</p>
                <div className={styles.item}>
                  <FiCalendar />
                  <p>{formatDate(event.date)}</p>
                </div>
                <div className={styles.item}>
                  <FiMapPin />
                  <p>{event.location}</p>
                </div>
                <div className={styles.links}>
                  <Link to={`/events/${event.id}`} className={styles.primaryAction}>
                    Подробнее
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
