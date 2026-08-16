import { useMemo, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { artistsData, albumsData, tracksData } from '../cms/data'
import { useAudioStore } from '../store/audioStore'
import styles from './ArtistDetailPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowLeft, FiPlay, FiPause, FiChevronLeft, FiChevronRight, FiDisc } from 'react-icons/fi'
import { FaVk, FaTelegram, FaInstagram, FaXTwitter, FaFacebookF } from 'react-icons/fa6'
import type { IconType } from 'react-icons'
import type { Track, Album } from '../types/content'
import { getMediaUrl } from '../shared/lib/media'

const SOCIAL_META: Record<string, { Icon: IconType; defaultLabel: string }> = {
  vk: { Icon: FaVk, defaultLabel: 'ВК' },
  telegram: { Icon: FaTelegram, defaultLabel: 'Телеграм' },
  instagram: { Icon: FaInstagram, defaultLabel: 'Инстаграм' },
  x: { Icon: FaXTwitter, defaultLabel: 'X' },
  facebook: { Icon: FaFacebookF, defaultLabel: 'Facebook' },
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'Дата не указана'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

// Анимированный эквалайзер — как на страницах радио и альбома
function Equalizer() {
  return (
    <span className={styles.eq} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

export default function ArtistDetailPage() {
  const { id } = useParams()
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)
  const goToPage = (next: (value: number) => number) => {
    setPage(next)
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
  const playTrack = useAudioStore((state) => state.playTrack)
  const currentTrack = useAudioStore((state) => state.currentTrack)
  const isPlaying = useAudioStore((state) => state.isPlaying)
  const togglePlay = useAudioStore((state) => state.togglePlay)
  const reduceMotion = useReducedMotion()

  const artist = useMemo(() => artistsData.find((entry) => entry.id === id), [id])

  const artistTracks = useMemo(() => {
    if (!artist) return []
    return tracksData.filter((track) =>
      track.authors.some((author) => author.id === artist.id)
    )
  }, [artist])

  const artistAlbums = useMemo(() => {
    if (!artist) return [] as Album[]
    return albumsData.filter((album) =>
      album.authors.some((author) => author.id === artist.id)
    )
  }, [artist])

  const featuredTrack = artist?.featuredTrack ?? null
  const featuredActive = featuredTrack != null && currentTrack?.id === featuredTrack.id

  const perPage = 4
  const totalPages = Math.max(1, Math.ceil(artistTracks.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const pageTracks = artistTracks.slice((currentPage - 1) * perPage, currentPage * perPage)

  const isCurrent = (track: Track) => currentTrack?.id === track.id

  const handlePlayPause = (track: Track) => {
    if (isCurrent(track)) {
      togglePlay()
      return
    }
    const nextQueue = artistTracks.length > 0 ? artistTracks : [track]
    playTrack(track, nextQueue)
  }

  if (!artist) {
    return (
      <motion.div
        className={styles.empty}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        Артист не найден.
      </motion.div>
    )
  }

  const socials = artist.socials ?? []
  const videos = artist.videos ?? []

  return (
    <>
      <Seo title={artist.nickname} description={`${artist.nickname} — артист Kray Music.`} />
      <section className={styles.page}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <Link to="/artists" className={styles.backLink}>
            <FiArrowLeft />
            <span>К артистам</span>
          </Link>
        </motion.div>
        <motion.section
          className={styles.hero}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.06 }}
        >
          <img
            src={getMediaUrl(artist.squareImage || artist.verticalImage)}
            alt={artist.nickname}
            className={styles.heroImage}
          />
          <div>
            <p className={styles.eyebrow}>Профиль артиста</p>
            <h1>{artist.nickname}</h1>
            <p>{artist.biography}</p>
            <div className={styles.socials}>
              {socials.map((social, index) => {
                const meta = social.type ? SOCIAL_META[social.type] : undefined
                const Icon = meta?.Icon
                const label = social.label?.trim() || meta?.defaultLabel || 'Ссылка'
                const key = `${label}-${social.url}-${index}`
                return Icon ? (
                  <a
                    key={key}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.socialIcon}
                    title={label}
                    aria-label={label}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                ) : (
                  <a key={key} href={social.url} target="_blank" rel="noreferrer">
                    {social.label}
                  </a>
                )
              })}
            </div>
          </div>
        </motion.section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>Видео</p>
              <h2>Клипы</h2>
            </div>
          </div>
          {videos.length > 0 ? (
            <Swiper
              className={styles.swiper}
              modules={[Navigation, Pagination]}
              slidesPerView={1}
              spaceBetween={16}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            >
              {videos.map((video, videoIndex) => (
                <SwiperSlide key={video.title} className={styles.swiperSlide}>
                  <motion.article
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.45, delay: reduceMotion ? 0 : (videoIndex % 3) * 0.06, ease: 'easeOut' }}
                    className={styles.card}
                  >
                    <a href={video.url} target="_blank" rel="noreferrer">
                      <img src={getMediaUrl(video.cover)} alt={video.title} className={styles.image} />
                    </a>
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                    <a href={video.url} target="_blank" rel="noreferrer">
                      <button type="button" className={styles.secondaryButton}>
                        <FiPlay />
                        Смотреть
                      </button>
                    </a>
                  </motion.article>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className={styles.empty}>У этого артиста пока нет клипов.</p>
          )}
        </section>

        <section className={styles.section}>
          <div className={`${styles.trackLayout} ${featuredTrack ? '' : styles.trackLayoutEmpty}`}>
            {!featuredTrack && (
              <div className={styles.trackHeader}>
                <p className={styles.eyebrow}>Треки</p>
                <h2>Список треков</h2>
              </div>
            )}
            <div className={styles.trackColumn}>
              {featuredTrack && (
                <div className={styles.trackHeader}>
                  <p className={styles.eyebrow}>Треки</p>
                  <h2>Список треков</h2>
                </div>
              )}
              <div className={styles.trackList} ref={listRef}>
                {pageTracks.map((track, index) => {
                  const active = isCurrent(track)
                  return (
                    <motion.div
                      key={track.id}
                      className={`${styles.trackCard} ${active ? styles.trackCardActive : ''}`}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-30px' }}
                      transition={{ duration: 0.45, delay: reduceMotion ? 0 : (index % 4) * 0.05, ease: 'easeOut' }}
                    >
                      <div className={styles.trackCoverWrap}>
                        <img src={getMediaUrl(track.cover)} alt={track.title} className={styles.trackCover} />
                        {active && isPlaying ? (
                          <span className={styles.coverEq} aria-hidden="true">
                            <Equalizer />
                          </span>
                        ) : null}
                      </div>
                      <div>
                        <h3>{track.title}</h3>
                        <p>
                          {track.authors.map((a) => a.nickname).join(', ')}
                        </p>
                      </div>
                      <button
                        type="button"
                        className={`${styles.playButton} ${active ? styles.playButtonActive : ''}`}
                        onClick={() => handlePlayPause(track)}
                        aria-label={active && isPlaying ? 'Пауза' : 'Слушать'}
                      >
                        {active && isPlaying ? <FiPause /> : <FiPlay />}
                      </button>
                    </motion.div>
                  )
                })}
              </div>
              <motion.div
                className={styles.pagination}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <button
                  type="button"
                  onClick={() => goToPage((value) => Math.max(1, value - 1))}
                  disabled={currentPage === 1} aria-label="Назад"
                >
                  <FiChevronLeft size={18} />
                </button>
                <span>{currentPage} / {totalPages}</span>
                <button
                  type="button"
                  onClick={() => goToPage((value) => Math.min(totalPages, value + 1))}
                  disabled={currentPage === totalPages} aria-label="Вперёд"
                >
                  <FiChevronRight size={18} />
                </button>
              </motion.div>
            </div>

            <motion.div
              className={`${styles.featuredTrackCard} ${featuredActive ? styles.featuredTrackCardActive : ''}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className={styles.featuredTrackHeader}>
                <p className={styles.eyebrow}>Новый релиз</p>
              </div>
              {featuredTrack ? (
                <>
                  <button
                    type="button"
                    className={styles.featuredTrackCoverButton}
                    onClick={() => handlePlayPause(featuredTrack)}
                    aria-label={featuredActive && isPlaying ? 'Пауза' : 'Слушать'}
                  >
                    <img
                      src={getMediaUrl(featuredTrack.cover)}
                      alt={featuredTrack.title}
                      className={styles.featuredTrackCover}
                    />
                    {featuredActive && isPlaying ? (
                      <span className={styles.featuredCoverEq} aria-hidden="true">
                        <Equalizer />
                      </span>
                    ) : null}
                  </button>
                  <div className={styles.featuredTrackInfo}>
                    <h3>{featuredTrack.title}</h3>
                    <p>
                      {featuredTrack.authors.map((a) => a.nickname).join(', ')}
                    </p>
                    <p>Дата релиза: {formatDate(featuredTrack.releaseDate)}</p>
                    <p>Тип релиза: {featuredTrack.releaseType}</p>
                    <p>{featuredTrack.description}</p>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => handlePlayPause(featuredTrack)}
                    >
                      {featuredActive && isPlaying ? <FiPause /> : <FiPlay />}
                      {featuredActive && isPlaying ? 'Пауза' : 'Слушать'}
                    </button>
                  </div>
                </>
              ) : (
                <p>Пока нет доступных релизов.</p>
              )}
            </motion.div>
          </div>
        </section>
<section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.eyebrow}>
                <FiDisc size={14} />
                Альбомы
              </p>
              <h2>Альбомы артиста</h2>
            </div>
          </div>
          {artistAlbums.length > 0 ? (
            <div className={styles.albumGrid}>
              {artistAlbums.map((album, index) => (
                <motion.article
                  key={album.id}
                  className={styles.albumCard}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.45, delay: reduceMotion ? 0 : (index % 4) * 0.05, ease: 'easeOut' }}
                >
                  <Link to={`/albums/${album.id}`} state={{ fromArtist: artist.id }} className={styles.albumCoverLink}>
                    <img src={getMediaUrl(album.cover)} alt={album.title} className={styles.albumCover} loading="lazy" />
                  </Link>
                  <div className={styles.albumBody}>
                    <h3>
                      <Link to={`/albums/${album.id}`} state={{ fromArtist: artist.id }} className={styles.albumTitleLink}>
                        {album.title}
                      </Link>
                    </h3>
                    <p className={styles.albumMeta}>
                      {album.tracks.length} {album.tracks.length === 1 ? 'трек' : album.tracks.length < 5 ? 'трека' : 'треков'} ·{' '}
                      {formatDate(album.releaseDate)}
                    </p>
                    <Link to={`/albums/${album.id}`} state={{ fromArtist: artist.id }} className={styles.albumOpenLink}>
                      Открыть альбом
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>У этого артиста пока нет альбомов.</p>
          )}
        </section>
      </section>
    </>
  )
}