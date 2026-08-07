import { useEffect, useRef } from 'react'
import { FiPause, FiPlay, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX, FiRepeat, FiShuffle, FiX } from 'react-icons/fi'
import styles from './Player.module.css'
import { useAudioStore } from '../../store/audioStore'
import { Link } from 'react-router-dom'
import { getMediaUrl } from '../../shared/lib/media'
import type { Track } from '../../types/content'

export function Player() {
  const {
    currentTrack,
    isPlaying,
    isVisible,
    volume,
    muted,
    duration,
    currentTime,
    repeat,
    shuffle,
    togglePlay,
    closePlayer,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    setCurrentTime,
    setDuration,
    setProgress,
  } = useAudioStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevTrackRef = useRef<Track | null>(null)

  // Главный эффект: управление источником и воспроизведением
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    // Сравниваем по ссылке на объект (при повторном нажатии создаётся новый объект)
    const trackChanged = prevTrackRef.current !== currentTrack
    prevTrackRef.current = currentTrack

    if (trackChanged) {
      // Меняем источник, сбрасываем время и длительность
      audio.src = getMediaUrl(currentTrack.audio)
      audio.load()
      audio.currentTime = 0
      setCurrentTime(0)
      setProgress(0)
      setDuration(0)
    }

    // Управление воспроизведением
    if (isPlaying) {
      if (audio.paused) {
        void audio.play().catch(() => {})
      }
    } else {
      audio.pause()
    }
  }, [currentTrack, isPlaying, setCurrentTime, setProgress, setDuration])

  // Эффект для громкости
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    audio.muted = muted
  }, [volume, muted])

  const handleSeek = (value: number) => {
    const audio = audioRef.current
    seek(value)
    setCurrentTime(value)
    setProgress(value)
    if (audio) {
      audio.currentTime = value
    }
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)
    setProgress(audio.currentTime)
  }

  const handleLoadedMetadata = () => {
    const audio = audioRef.current
    if (!audio) return
    setDuration(audio.duration || 0)
  }

  if (!currentTrack || !isVisible) {
    return null
  }

  const authors = currentTrack.authors ?? []

  return (
    <div className={styles.player}>
      <div className={styles.playerHeader}>
        <div className={styles.trackInfo}>
          <img src={getMediaUrl(currentTrack.cover)} alt={currentTrack.title} className={styles.cover} />
          <div>
            <p className={styles.title}>{currentTrack.title}</p>
            {authors.length > 0 ? (
              authors.map((author, index) => (
                <span key={author.id}>
                  <Link to={`/artists/${author.id}`} className={styles.artistLink}>
                    {author.nickname}
                  </Link>
                  {index < authors.length - 1 && ', '}
                </span>
              ))
            ) : (
              <span className={styles.artistLink}>Неизвестный исполнитель</span>
            )}
          </div>
        </div>
        <div className={styles.controls}>
          <button type="button" className={styles.iconButton} onClick={toggleShuffle}>
            <FiShuffle color={shuffle ? '#c71d1b' : '#cfcbcb'} />
          </button>
          <button type="button" className={styles.iconButton} onClick={previousTrack}>
            <FiSkipBack />
          </button>
          <button type="button" className={styles.playButton} onClick={togglePlay}>
            {isPlaying ? <FiPause /> : <FiPlay />}
          </button>
          <button type="button" className={styles.iconButton} onClick={nextTrack}>
            <FiSkipForward />
          </button>
          <button type="button" className={styles.iconButton} onClick={toggleRepeat}>
            <FiRepeat color={repeat ? '#c71d1b' : '#cfcbcb'} />
          </button>
        </div>
        <button type="button" className={styles.closeButton} onClick={closePlayer}>
          <FiX />
        </button>
      </div>
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          const { repeat } = useAudioStore.getState()
          if (repeat) {
            const audio = audioRef.current
            if (audio) {
              audio.currentTime = 0
              setCurrentTime(0)
              setProgress(0)
              void audio.play().catch(() => {})
            }
            return
          }
          nextTrack()
        }}
      />
      <div className={styles.timelineWrap}>
        <div className={styles.volumeWrap}>
          <button type="button" className={styles.iconButton} onClick={toggleMute}>
            {muted ? <FiVolumeX /> : <FiVolume2 />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className={styles.range}
          />
        </div>
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
          className={styles.range}
        />
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}

function formatTime(value: number) {
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}