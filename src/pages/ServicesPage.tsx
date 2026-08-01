import { servicesData } from '../cms/data'
import styles from './ServicesPage.module.css'
import { Seo } from '../shared/ui/Seo'

export default function ServicesPage() {
  return (
    <>
      <Seo title="Services" description="Discover artist development and label services from Kray Music." />
      <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Services</p>
        <h1>Support for every stage</h1>
      </div>
      <div className={styles.list}>
        {servicesData.map((service, index) => (
          <article key={service.id} className={`${styles.card} ${index % 2 === 1 ? styles.reverse : ''}`}>
            <img src={service.image} alt={service.title} className={styles.image} />
            <div className={styles.content}>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <a href="#footer" className={styles.link}>Contact</a>
            </div>
          </article>
        ))}
      </div>
    </section>
    </>
  )
}
