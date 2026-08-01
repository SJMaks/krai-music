import { useMemo, useState } from 'react'
import { artistsData, tracksData } from '../cms/data'
import { useAudioStore } from '../store/audioStore'
import styles from './RadioPage.module.css'
import { Seo } from '../shared/ui/Seo'

export default function RadioPage() {
  const [filter, setFilter] = useState('All')
  const playTrack = useAudioStore((state) => state.playTrack)
  const queue = useAudioStore((state) => state.queue)

  const artistFilters = useMemo(() => ['All', ...artistsData.map((artist) => artist.nickname)], [])
  const filteredTracks = useMemo(() => {
    if (filter === 'All') return tracksData
    return tracksData.filter((track) => track.artist === filter)
  }, [filter])

  return (
    <>
      <Seo title="Radio" description="Tune into the curated Kray Music radio queue and artist filters." />
      <section className={styles.page}>
      <div className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Radio</p>
          <h1>Curated listening</h1>
          <p>Queue and filter the latest releases from the label roster.</p>
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
            <img src={track.cover} alt={track.title} className={styles.image} />
            <div>
              <h2>{track.title}</h2>
              <p>{track.artist}</p>
            </div>
            <button type="button" className={styles.playButton} onClick={() => playTrack(track, queue)}>
              Queue & play
            </button>
          </article>
        ))}
      </div>
    </section>
    </>
  )
}
