import { eventsData } from '../cms/data'
import styles from './EventsPage.module.css'
import { Seo } from '../shared/ui/Seo'

export default function EventsPage() {
  return (
    <>
      <Seo title="Events" description="Upcoming events and label showcases from Kray Music." />
      <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Events</p>
        <h1>Live moments</h1>
      </div>
      <div className={styles.list}>
        {eventsData.map((event, index) => (
          <article key={event.id} className={`${styles.card} ${index % 2 === 1 ? styles.reverse : ''}`}>
            <img src={event.image} alt={event.title} className={styles.image} />
            <div className={styles.content}>
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p>{event.date}</p>
              <p>{event.location}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
    </>
  )
}
