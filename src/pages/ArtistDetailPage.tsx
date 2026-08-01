import { useMemo, useState } from 'react'
import ReactPlayer from 'react-player'
import { useParams } from 'react-router-dom'
import { artistsData, tracksData } from '../cms/data'
import { useAudioStore } from '../store/audioStore'
import styles from './ArtistDetailPage.module.css'
import { Seo } from '../shared/ui/Seo'

export default function ArtistDetailPage() {
  const { slug } = useParams()
  const [page, setPage] = useState(1)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const playTrack = useAudioStore((state) => state.playTrack)
  const queue = useAudioStore((state) => state.queue)

  const artist = useMemo(() => artistsData.find((entry) => entry.slug === slug), [slug])
  const artistTracks = useMemo(() => tracksData.filter((track) => track.artistSlug === slug), [slug])
  const perPage = 4
  const totalPages = Math.max(1, Math.ceil(artistTracks.length / perPage))
  const currentPage = Math.min(page, totalPages)
  const pageTracks = artistTracks.slice((currentPage - 1) * perPage, currentPage * perPage)

  if (!artist) {
    return <div className={styles.empty}>Artist not found.</div>
  }

  return (
    <>
      <Seo title={artist.nickname} description={`${artist.nickname} on Kray Music.`} />
      <section className={styles.page}>
      <section className={styles.hero}>
        <img src={artist.featuredImage} alt={artist.nickname} className={styles.heroImage} />
        <div>
          <p className={styles.eyebrow}>Artist profile</p>
          <h1>{artist.nickname}</h1>
          <p>{artist.biography}</p>
          <div className={styles.socials}>
            {artist.socials.map((social) => (
              <a key={social.label} href={social.url} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <h2>Videos</h2>
        <div className={styles.videoGrid}>
          {artist.videos.map((video) => (
            <button key={video.title} type="button" className={styles.videoCard} onClick={() => setActiveVideo(video.url)}>
              <img src={video.thumbnail} alt={video.title} className={styles.videoImage} />
              <span>{video.title}</span>
            </button>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.trackLayout}>
          <div>
            <h2>Tracklist</h2>
            <div className={styles.trackList}>
              {pageTracks.map((track) => (
                <div key={track.id} className={styles.trackCard}>
                  <img src={track.cover} alt={track.title} className={styles.trackCover} />
                  <div>
                    <h3>{track.title}</h3>
                    <p>{track.duration}</p>
                  </div>
                  <button type="button" className={styles.playButton} onClick={() => playTrack(track, queue)}>
                    Play
                  </button>
                </div>
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
          </div>
          <div className={styles.artworkPanel}>
            <img src={artist.featuredImage} alt={`${artist.nickname} featured artwork`} className={styles.artworkImage} />
          </div>
        </div>
      </section>
    </section>
    {activeVideo ? (
      <div className={styles.modalOverlay} role="dialog" aria-modal="true">
        <div className={styles.modalContent}>
          <button type="button" className={styles.closeButton} onClick={() => setActiveVideo(null)}>
            Close
          </button>
          <ReactPlayer src={activeVideo} controls width="100%" height="100%" />
        </div>
      </div>
    ) : null}
    </>
  )
}
