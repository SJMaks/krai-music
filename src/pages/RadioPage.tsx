import { useMemo, useState } from 'react'
import { artistsData, tracksData } from '../cms/data'
import { useAudioStore } from '../store/audioStore'
import styles from './RadioPage.module.css'
import { Seo } from '../shared/ui/Seo'
import { Link } from 'react-router-dom'
import { getMediaUrl } from '../shared/lib/media'

export default function RadioPage() {
  const [filter, setFilter] = useState('Все')
  const playTrack = useAudioStore((state) => state.playTrack)
  const queue = useAudioStore((state) => state.queue)

  const artistFilters = useMemo(() => ['Все', ...artistsData.map((artist) => artist.nickname)], [])

  const filteredTracks = useMemo(() => {
    if (filter === 'Все') return tracksData
    return tracksData.filter((track) =>
      track.authors.some((author) => author.nickname === filter)
    )
  }, [filter])

  return (
    <>
      <Seo title="Радио" description="Слушайте отобранную подборку Kray Music и фильтры по артистам." />
      <section className={styles.page}>
        <div className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>Радио</p>
            <h1>Подборка для прослушивания</h1>
            <p>Собирайте и фильтруйте свежие релизы из каталога лейбла.</p>
          </div>
          <div className={styles.filters}>
            {artistFilters.map((entry) => (
              <button key={entry} type="button" className={entry === filter ? styles.active : ''} onClick={() => setFilter(entry)}>
                {entry}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.list}>
          {filteredTracks.map((track) => (
            <article key={track.id} className={styles.card}>
              <img src={getMediaUrl(track.cover)} alt={track.title} className={styles.image} />
              <div>
                <h2>{track.title}</h2>
                <div>
                  {track.authors.map((author, index) => (
                    <span key={author.id}>
                      <Link to={`/artists/${author.id}`} className={styles.artistLink}>
                        {author.nickname}
                      </Link>
                      {index < track.authors.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </div>
              <button type="button" className={styles.playButton} onClick={() => playTrack(track, queue)}>
                В очередь и играть
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}