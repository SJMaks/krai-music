import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { artistsData, tracksData } from '../cms/data'
import { useAudioStore } from '../store/audioStore'
import styles from './RadioPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { Link } from 'react-router-dom'
import { getMediaUrl } from '../shared/lib/media'
import logo from '../assets/logo.png'
import { FiPlay, FiPause, FiShuffle, FiRadio } from 'react-icons/fi'
import type { Track } from '../types/content'

function formatDate(dateString?: string): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
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

export default function RadioPage() {
  const [filter, setFilter] = useState('Все')
  const reduceMotion = useReducedMotion()

  const playTrack = useAudioStore((state) => state.playTrack)
  const currentTrack = useAudioStore((state) => state.currentTrack)
  const isPlaying = useAudioStore((state) => state.isPlaying)
  const togglePlay = useAudioStore((state) => state.togglePlay)

  const artistFilters = useMemo(() => ['Все', ...artistsData.map((artist) => artist.nickname)], [])

  const filteredTracks = useMemo(() => {
    if (filter === 'Все') return tracksData
    return tracksData.filter((track) =>
      track.authors.some((author) => author.nickname === filter)
    )
  }, [filter])

  const isCurrent = (track: Track) => currentTrack?.id === track.id
  const firstTrack = filteredTracks[0]
  const playingSomething = isPlaying && currentTrack != null
  // Трек из текущей подборки уже выбран в плеере (играет или на паузе)
  const activeInList = currentTrack != null && filteredTracks.some(isCurrent)

  const handlePlay = (track: Track) => {
    playTrack(track, filteredTracks)
  }

  const handlePlayPause = (track: Track) => {
    if (isCurrent(track)) {
      togglePlay()
    } else {
      handlePlay(track)
    }
  }

  const handleShuffle = () => {
    const shuffled = [...filteredTracks].sort(() => Math.random() - 0.5)
    if (shuffled.length > 0) {
      playTrack(shuffled[0], shuffled)
    }
  }

  return (
    <>
      <Seo title="Радио" description="Слушайте отобранную подборку Kray Music: релизы лейбла, фильтры по артистам и плейлисты на любой вкус." />
      <section className={styles.page}>
        {/* ===== Крупный баннер — визитная карточка радио ===== */}
        <motion.section
          className={styles.billboard}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className={styles.billboardRing} aria-hidden="true" />
          <span className={styles.billboardRingSecond} aria-hidden="true" />

          <div className={styles.billboardContent}>
            <p className={styles.billboardKicker}>
              <FiRadio />
              Радио лейбла
            </p>
            <h1 className={styles.billboardTitle}>
              Поймай свою <span>волну</span>
            </h1>
            <p className={styles.billboardText}>
              Все релизы Край Music — в одном плейлисте. Фильтруйте подборку по артистам,
              запускайте её одним касанием или включите вперемешку.
            </p>
            <div className={styles.billboardActions}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => (activeInList ? togglePlay() : firstTrack && handlePlay(firstTrack))}
                disabled={!firstTrack}
              >
                {activeInList && playingSomething ? <FiPause size={16} /> : <FiPlay size={16} />}
                {activeInList ? (playingSomething ? 'Пауза' : 'Слушать') : 'Слушать всё'}
              </button>
              <button type="button" className={styles.ghostBtn} onClick={handleShuffle} disabled={filteredTracks.length === 0}>
                <FiShuffle size={15} />
                Слушать вперемешку
              </button>
            </div>
          </div>

          <div className={styles.billboardArt} aria-hidden="true">
            <span className={styles.vinylRing} />
            <div className={styles.vinyl}>
              <span className={styles.vinylLabel}>
                <img src={logo} alt="" className={styles.vinylLogo} />
              </span>
            </div>
            <span className={styles.signalDot} />
            <div className={`${styles.eqBig} ${playingSomething ? styles.eqBigActive : ''}`}>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </motion.section>

        {/* ===== Фильтры по артистам ===== */}
        <div className={styles.filters} role="group" aria-label="Фильтр по артистам">
          {artistFilters.map((entry) => (
            <button
              key={entry}
              type="button"
              className={entry === filter ? styles.active : ''}
              onClick={() => setFilter(entry)}
            >
              {entry}
            </button>
          ))}
        </div>

        {/* ===== Коллекция релизов — сетка обложек ===== */}
        <section className={styles.section}>
          <header className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>{filter === 'Все' ? 'Коллекция' : filter}</p>
              <h2 className={styles.sectionTitle}>Релизы лейбла</h2>
            </div>
            {filter !== 'Все' && (
              <button type="button" className={styles.resetBtn} onClick={() => setFilter('Все')}>
                Сбросить фильтр
              </button>
            )}
          </header>

          {filteredTracks.length > 0 ? (
            <div className={styles.shelf}>
              {filteredTracks.map((track, index) => {
                const active = isCurrent(track)
                return (
                  <motion.article
                    key={track.id}
                    className={styles.albumCard}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.45, delay: reduceMotion ? 0 : (index % 4) * 0.05, ease: 'easeOut' }}
                  >
                    <div className={styles.albumCoverWrap}>
                      <img src={getMediaUrl(track.cover)} alt={track.title} className={styles.albumCover} loading="lazy" />
                      {active && isPlaying && (
                        <span className={styles.albumEq}>
                          <Equalizer />
                        </span>
                      )}
                      <button
                        type="button"
                        className={`${styles.albumPlay} ${active ? styles.albumPlayPinned : ''}`}
                        onClick={() => handlePlayPause(track)}
                        aria-label={active && isPlaying ? `Пауза: ${track.title}` : `Слушать: ${track.title}`}
                      >
                        {active && isPlaying ? <FiPause size={16} /> : <FiPlay size={16} />}
                      </button>
                    </div>
                    <h3 className={styles.albumTitle}>{track.title}</h3>
                    <div className={styles.albumAuthors}>
                      {track.authors.map((author, authorIndex) => (
                        <span key={author.id}>
                          <Link to={`/artists/${author.id}`} className={styles.albumAuthorLink}>
                            {author.nickname}
                          </Link>
                          {authorIndex < track.authors.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                    <p className={styles.albumMeta}>
                      {track.releaseType} · {formatDate(track.releaseDate)}
                    </p>
                  </motion.article>
                )
              })}
            </div>
          ) : (
            <p className={styles.empty}>В этой подборке пока нет треков.</p>
          )}
        </section>

        {/* ===== Список треков ===== */}
        <section className={styles.section}>
          <header className={styles.sectionHead}>
            <div>
              <p className={styles.eyebrow}>Свежее</p>
              <h2 className={styles.sectionTitle}>Все треки</h2>
            </div>
          </header>

          {filteredTracks.length > 0 ? (
            <div className={styles.trackList}>
              {filteredTracks.map((track, index) => {
                const active = isCurrent(track)
                return (
                  <div
                    key={track.id}
                    className={`${styles.trackRow} ${active ? styles.trackRowActive : ''}`}
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
                        <div className={styles.trackAuthors}>
                          {track.authors.map((author, authorIndex) => (
                            <span key={author.id}>
                              <Link
                                to={`/artists/${author.id}`}
                                className={styles.trackAuthorLink}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {author.nickname}
                              </Link>
                              {authorIndex < track.authors.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className={styles.trackDate}>{formatDate(track.releaseDate)}</span>
                    <span className={styles.trackType}>{track.releaseType}</span>
                    <span className={styles.trackAction}>
                      {active && isPlaying ? <FiPause size={15} /> : <FiPlay size={15} />}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className={styles.empty}>В этой подборке пока нет треков.</p>
          )}
        </section>
      </section>
    </>
  )
}