import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useContent } from '../hooks/useContent'
import { useAudioStore } from '../store/audioStore'
import { artistsData, eventsData, tracksData } from '../cms/data'
import styles from './HomePage.module.css'
import { Link } from 'react-router-dom'
import { Seo } from '../shared/ui/Seo'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import type { Artist, Event, Track } from '../types/content'

export default function HomePage() {
  const { homepage } = useContent()
  const playTrack = useAudioStore((state) => state.playTrack)
  const queue = useAudioStore((state) => state.queue)

  const featuredArtists = useMemo(() => {
    const configuredIds = homepage.featuredArtistIds.length > 0 ? homepage.featuredArtistIds : artistsData.slice(0, 3).map((artist) => artist.id)
    const ordered = configuredIds
      .map((id) => artistsData.find((artist) => artist.id === id))
      .filter((artist): artist is Artist => Boolean(artist))

    return ordered.length > 0 ? ordered : artistsData.slice(0, 3)
  }, [homepage.featuredArtistIds])

  const featuredTracks = useMemo(() => {
    const configuredIds = homepage.featuredTrackIds.length > 0 ? homepage.featuredTrackIds : tracksData.slice(0, 3).map((track) => track.id)
    const ordered = configuredIds
      .map((id) => tracksData.find((track) => track.id === id))
      .filter((track): track is Track => Boolean(track))

    return ordered.length > 0 ? ordered : tracksData.slice(0, 3)
  }, [homepage.featuredTrackIds])

  const featuredEvents = useMemo(() => {
    const configuredIds = homepage.featuredEventIds.length > 0 ? homepage.featuredEventIds : eventsData.slice(0, 3).map((event) => event.id)
    const ordered = configuredIds
      .map((id) => eventsData.find((event) => event.id === id))
      .filter((event): event is Event => Boolean(event))

    return ordered.length > 0 ? ordered : eventsData.slice(0, 3)
  }, [homepage.featuredEventIds])

  return (
    <>
      <Seo title="Главная" description="Kray Music — музыкальный лейбл, который помогает открывать новых артистов и слушать свежие релизы." />
      <section className={styles.page}>
        <section className={styles.hero}>
          <h1 className={styles.title}>{homepage.heroTitle}</h1>
          <p className={styles.subtitle}>
            «
            <span style={{ color: '#c71d1b' }}>Край</span>
            <span style={{ color: '#ffffff' }}>Music</span>
            »{homepage.heroSubtitle}
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Наши артисты</h2>
            <Link to="/artists">Все артисты</Link>
          </div>
          <Swiper
            className={styles.swiper}
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={16}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          >
            {featuredArtists.map((artist) => (
              <SwiperSlide key={artist.id} className={styles.swiperSlide}>
                <motion.article initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.card}>
                  <Link to={`/artists/${artist.slug}`}><img src={artist.avatar} alt={artist.nickname} className={styles.image} /></Link>
                  <h3>{artist.nickname}</h3>
                  <p>{artist.biography}</p>
                  <Link to={`/artists/${artist.slug}`}>Открыть профиль</Link>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Недавние релизы</h2>
            <Link to="/radio">Все релизы</Link>
          </div>
          <Swiper
            className={styles.swiper}
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={16}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          >
            {featuredTracks.map((track) => (
              <SwiperSlide key={track.id} className={styles.swiperSlide}>
                <motion.article initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.card}>
                  <img src={track.cover} alt={track.title} className={styles.image} />
                  <h3>{track.title}</h3>
                  <p>{track.artist}</p>
                  <button type="button" className={styles.secondaryButton} onClick={() => playTrack(track, queue)}>
                    Слушать
                  </button>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Мероприятия</h2>
            <Link to="/events">Все мероприятия</Link>
          </div>
          <Swiper
            className={styles.swiper}
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            spaceBetween={16}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          >
            {featuredEvents.map((event) => (
              <SwiperSlide key={event.id} className={styles.swiperSlide}>
                <motion.article initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.card}>
                  <img src={event.image} alt={event.title} className={styles.image} />
                  <h3>{event.title}</h3>
                  <div className={styles.item}>
                    <FiCalendar />
                    <p>{event.date}</p>
                  </div>
                  <div className={styles.item}>
                    <FiMapPin />
                    <p>{event.location}</p>
                  </div>
                  <p>{event.description}</p>
                  <Link to={`/events/${event.id}`} className={styles.secondaryButton}>
                    Подробнее
                  </Link>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </section>
    </>
  )
}
