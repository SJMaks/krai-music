import { servicesData } from '../cms/data'
import styles from './ServicesPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { getMediaUrl } from '../shared/lib/media'

export default function ServicesPage() {
  return (
    <>
      <Seo title="Услуги" description="Изучайте услуги по развитию артистов и работе с лейблом Kray Music." />
      <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Услуги</p>
        <h1>Поддержка на каждом этапе</h1>
      </div>
      <div className={styles.list}>
        {servicesData.map((service, index) => (
          <article key={service.id} className={`${styles.card} ${index % 2 === 1 ? styles.reverse : ''}`}>
            <img src={getMediaUrl(service.image)} alt={service.title} className={styles.image} />
            <div className={styles.content}>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <a href="#footer" className={styles.link}>Связаться</a>
            </div>
          </article>
        ))}
      </div>
    </section>
    </>
  )
}
