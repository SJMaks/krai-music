import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { artistsData } from '../cms/data'
import styles from './ArtistsPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { Media } from '../shared/ui/Media'
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function ArtistsPage() {
  const reduceMotion = useReducedMotion()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 4
  const listRef = useRef<HTMLDivElement>(null)
  const goToPage = (next: (value: number) => number) => {
    setPage(next)
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const filteredArtists = useMemo(() => {
    const sorted = [...artistsData].sort((left, right) => left.nickname.localeCompare(right.nickname))
    return sorted.filter((artist) => artist.nickname.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  const totalPages = Math.max(1, Math.ceil(filteredArtists.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const pageArtists = filteredArtists.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <>
      <Seo title="Артисты" description="Изучайте артистов Kray Music и открывайте новых исполнителей." />
      <section className={styles.page}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <div>
          <p className={styles.eyebrow}>Артисты</p>
          <h1>Избранные голоса</h1>
          <p className={styles.subtitle}>Изучайте артистов лейбла Край и открывайте новые имена — у каждого свой звук и история.</p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
          placeholder="Поиск артистов"
          className={styles.input}
          aria-label="Поиск артистов"
        />
      </motion.div>
      <div className={styles.grid} ref={listRef}>
        {pageArtists.map((artist, index) => (
          <motion.article
            key={artist.id}
            className={styles.card}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: reduceMotion ? 0 : (index % 3) * 0.06, ease: 'easeOut' }}
          >
            <Link to={`/artists/${artist.id}`}><Media src={artist.verticalImage} alt={artist.nickname} className={styles.image} /></Link>
            <h2>{artist.nickname}</h2>
            <p className={styles.cardText}>{artist.biography}</p>
            <Link to={`/artists/${artist.id}`} className={styles.cardLink}>
              Открыть профиль
              <FiArrowRight />
            </Link>
          </motion.article>
        ))}
      </div>
      <motion.div
        className={styles.pagination}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.12 }}
      >
        <button type="button" onClick={() => goToPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} aria-label="Назад">
          <FiChevronLeft size={18} />
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button type="button" onClick={() => goToPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages} aria-label="Вперёд">
          <FiChevronRight size={18} />
        </button>
      </motion.div>
    </section>
    </>
  )
}
