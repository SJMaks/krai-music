import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { artistsData } from '../cms/data'
import styles from './ArtistsPage.module.css'
import { Seo } from '../shared/ui/Seo'

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
      <Seo title="Artists" description="Browse the Kray Music roster and discover featured artists." />
      <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Artists</p>
          <h1>Selected voices</h1>
        </div>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
          placeholder="Search artists"
          className={styles.input}
          aria-label="Search artists"
        />
      </div>
      <div className={styles.grid}>
        {pageArtists.map((artist) => (
          <article key={artist.id} className={styles.card}>
            <img src={artist.avatar} alt={artist.nickname} className={styles.image} />
            <h2>{artist.nickname}</h2>
            <p>{artist.biography}</p>
            <Link to={`/artists/${artist.slug}`}>View profile</Link>
          </article>
        ))}
      </div>
      <div className={styles.pagination}>
        <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </section>
    </>
  )
}
