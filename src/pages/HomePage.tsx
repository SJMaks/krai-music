import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useAudioStore } from '../store/audioStore'
import { homepageContentData, artistsData, tracksData, eventsData } from '../cms/data'
import styles from './HomePage.module.css'
import { Link } from 'react-router-dom'
import { Seo } from '../shared/ui/Seo'
import { FiCalendar, FiMapPin } from 'react-icons/fi'
import { getMediaUrl } from '../shared/lib/media'

export default function HomePage() {
  const playTrack = useAudioStore((state) => state.playTrack)
  const queue = useAudioStore((state) => state.queue)

  const { heroTitle, heroSubtitle, featuredArtists, featuredTracks, featuredEvents } = homepageContentData

  const displayArtists = featuredArtists.length > 0 ? featuredArtists : artistsData.slice(0, 3)
  const displayTracks = featuredTracks.length > 0 ? featuredTracks : tracksData.slice(0, 3)
  const displayEvents = featuredEvents.length > 0 ? featuredEvents : eventsData.slice(0, 3)

  return (
    <>
      <Seo title="Главная" description="Kray Music — музыкальный лейбл, который помогает открывать новых артистов и слушать свежие релизы." />
      <section className={styles.page}>
        <section className={styles.hero}>
          <h1 className={styles.title}>{heroTitle}</h1>
          <p className={styles.subtitle}>
            «
            <span style={{ color: '#c71d1b' }}>Край</span>
            <span style={{ color: '#ffffff' }}>Music</span>
            »{heroSubtitle}
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
            {displayArtists.map((artist) => (
              <SwiperSlide key={artist.id} className={styles.swiperSlide}>
                <motion.article initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.card}>
                  <Link to={`/artists/${artist.id}`}><img src={getMediaUrl(artist.verticalImage)} alt={artist.nickname} className={styles.image} /></Link>
                  <h3>{artist.nickname}</h3>
                  <p>{artist.biography}</p>
                  <Link to={`/artists/${artist.id}`}>Открыть профиль</Link>
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
            {displayTracks.map((track) => (
              <SwiperSlide key={track.id} className={styles.swiperSlide}>
                <motion.article initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.card}>
                  <img src={getMediaUrl(track.cover)} alt={track.title} className={styles.image} />
                  <h3>{track.title}</h3>
                  <p>{track.authors.map(a => a.nickname).join(', ')}</p>
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
            {displayEvents.map((event) => (
              <SwiperSlide key={event.id} className={styles.swiperSlide}>
                <motion.article initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={styles.card}>
                  <img src={getMediaUrl(event.image)} alt={event.title} className={styles.image} />
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
