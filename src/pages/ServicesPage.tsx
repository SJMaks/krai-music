import { motion, useReducedMotion } from 'framer-motion'
import { servicesData } from '../cms/data'
import styles from './ServicesPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { Media } from '../shared/ui/Media'
import { scrollToFooterBottom } from '../shared/lib/footerScroll'
import { ExpandableText } from '../shared/ui/ExpandableText'
import { FiArrowRight } from 'react-icons/fi'

export default function ServicesPage() {
  const reduceMotion = useReducedMotion()
  return (
    <>
      <Seo title="Услуги" description="Изучайте услуги по развитию артистов и работе с лейблом Kray Music." />
      <section className={styles.page}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <p className={styles.eyebrow}>Услуги</p>
        <h1>Поддержка на каждом этапе</h1>
        <p className={styles.subtitle}>Помогаем артистам расти: от записи трека до продвижения и выступлений.</p>
      </motion.div>
      <div className={styles.list}>
        {servicesData.map((service, index) => (
          <motion.article
            key={service.id}
            className={`${styles.card} ${index % 2 === 1 ? styles.reverse : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, delay: reduceMotion ? 0 : (index % 2) * 0.08, ease: 'easeOut' }}
          >
            <Media src={service.image} alt={service.title} className={styles.image} />
            <div className={styles.content}>
              <h2>{service.title}</h2>
              <ExpandableText text={service.description} lines={5} />
              <a
                href="#footer"
                className={styles.link}
                onClick={(event) => {
                  event.preventDefault()
                  scrollToFooterBottom()
                }}
              >
                Связаться <FiArrowRight />
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
    </>
  )
}
