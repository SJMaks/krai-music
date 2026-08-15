import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { artistsData } from '../cms/data'
import styles from './ArtistsPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { getMediaUrl } from '../shared/lib/media'
import { FiArrowRight } from 'react-icons/fi'

export default function ArtistsPage() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 4

  const filteredArtists = useMemo(() => {
    const sorted = [...artistsData].sort((left, right) => left.nickname.localeCompare(right.nickname))
    return sorted.filter((artist) => artist.nickname.toLowerCase().includes(query.toLowerCase()))
  }, [query])

  const totalPages = Math.max(1, Math.ceil(filteredArtists.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const pageArtists = filteredArtists.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <>
      <Seo title="Артисты" description="ИзучайтеRoster Kray Music и открывайте новых артистов." />
      <section className={styles.page}>
      <div className={styles.header}>
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
      </div>
      <div className={styles.grid}>
        {pageArtists.map((artist) => (
          <article key={artist.id} className={styles.card}>
            <Link to={`/artists/${artist.id}`}><img src={getMediaUrl(artist.verticalImage)} alt={artist.nickname} className={styles.image} /></Link>
            <h2>{artist.nickname}</h2>
            <p>{artist.biography}</p>
            <Link to={`/artists/${artist.id}`} className={styles.cardLink}>
              Открыть профиль
              <FiArrowRight />
            </Link>
          </article>
        ))}
      </div>
      <div className={styles.pagination}>
        <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>
          Назад
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages}>
          Вперёд
        </button>
      </div>
    </section>
    </>
  )
}
