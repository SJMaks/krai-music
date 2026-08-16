import { useMemo } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { albumsData } from '../cms/data'
import { useAudioStore } from '../store/audioStore'
import styles from './AlbumDetailPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { FiArrowLeft, FiPlay, FiPause, FiDisc } from 'react-icons/fi'
import type { Track } from '../types/content'
import { getMediaUrl } from '../shared/lib/media'

function formatDate(dateString?: string): string {
  if (!dateString) return 'Дата не указана'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

function pluralize(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

function Equalizer() {
  return (
    <span className={styles.eq} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

export default function AlbumDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  const fromArtist = (location.state as { fromArtist?: string } | null)?.fromArtist

  const playTrack = useAudioStore((state) => state.playTrack)
  const currentTrack = useAudioStore((state) => state.currentTrack)
  const isPlaying = useAudioStore((state) => state.isPlaying)
  const togglePlay = useAudioStore((state) => state.togglePlay)

  const album = useMemo(
    () => albumsData.find((entry) => entry.id === id || entry.title.toLowerCase() === id?.toLowerCase()),
    [id],
  )

  if (!album) {
    return (
      <section className={styles.page}>
        <Seo title="Альбом не найден" description="Запрашиваемый альбом не найден." />
        <motion.p className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          Альбом не найден.
        </motion.p>
      </section>
    )
  }

  const tracks = album.tracks ?? []
  const isCurrent = (track: Track) => currentTrack?.id === track.id
  const allActive = currentTrack != null && tracks.some(isCurrent)

  const handlePlayPause = (track: Track) => {
    if (isCurrent(track)) {
      togglePlay()
    } else {
      playTrack(track, tracks)
    }
  }

  const handlePlayAll = () => {
    if (tracks.length === 0) return
    if (allActive && isPlaying) {
      togglePlay()
      return
    }
    const first = tracks.find((track) => !isCurrent(track)) ?? tracks[0]
    playTrack(first, tracks)
  }
return (
    <>
      <Seo title={album.title} description={`${album.title} — альбом Kray Music.`} />
      <section className={styles.page}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <Link to={fromArtist ? `/artists/${fromArtist}` : '/radio'} className={styles.backLink}>
            <FiArrowLeft />
            <span>{fromArtist ? 'К артисту' : 'К радио'}</span>
          </Link>
        </motion.div>

        <motion.header
          className={styles.hero}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
        >
          <div className={styles.coverWrap}>
            <img src={getMediaUrl(album.cover)} alt={album.title} className={styles.cover} />
          </div>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>
              <FiDisc size={15} />
              Альбом
            </p>
            <h1>{album.title}</h1>
            <p className={styles.authors}>
              {album.authors.map((author, index) => (
                <span key={author.id}>
                  <Link to={`/artists/${author.id}`} className={styles.authorLink}>
                    {author.nickname}
                  </Link>
                  {index < album.authors.length - 1 ? ' · ' : ''}
                </span>
              ))}
            </p>
            <p className={styles.meta}>
              {tracks.length} {pluralize(tracks.length, 'трек', 'трека', 'треков')} · {formatDate(album.releaseDate)}
            </p>
            {album.description ? <p className={styles.description}>{album.description}</p> : null}
            <button type="button" className={styles.playAllBtn} onClick={handlePlayAll}>
              {allActive && isPlaying ? <FiPause /> : <FiPlay />}
              {allActive && isPlaying ? 'Пауза' : 'Слушать все'}
            </button>
          </div>
        </motion.header>

        <section className={styles.tracksSection}>
          <header className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>Треки</p>
              <h2>Список треков</h2>
            </div>
          </header>

          {tracks.length > 0 ? (
            <div className={styles.trackList}>
              {tracks.map((track, index) => {
                const active = isCurrent(track)
                return (
                  <motion.div
                    key={track.id}
                    className={`${styles.trackRow} ${active ? styles.trackRowActive : ''}`}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : (index % 8) * 0.04, ease: 'easeOut' }}
                    onClick={() => handlePlayPause(track)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handlePlayPause(track)
                      }
                    }}
                  >
                    <div className={styles.trackIndex}>
                      {active && isPlaying ? <Equalizer /> : <span>{index + 1}</span>}
                    </div>
                    <div className={styles.trackMain}>
                      <img src={getMediaUrl(track.cover)} alt="" className={styles.trackCover} loading="lazy" />
                      <div className={styles.trackText}>
                        <p className={styles.trackTitle}>{track.title}</p>
                        <p className={styles.trackAuthors}>
                          {track.authors.map((author) => author.nickname).join(', ')}
                        </p>
                      </div>
                    </div>
                    <span className={styles.trackDuration}>{formatDate(track.releaseDate)}</span>
                    <span className={styles.trackAction}>
                      {active && isPlaying ? <FiPause size={15} /> : <FiPlay size={15} />}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <p className={styles.empty}>В этом альбоме пока нет треков.</p>
          )}
        </section>
      </section>
    </>
  )
}