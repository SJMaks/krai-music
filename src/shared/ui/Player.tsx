import { useEffect, useRef } from 'react'
import { FiPause, FiPlay, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX, FiRepeat, FiShuffle, FiX } from 'react-icons/fi'
import styles from './Player.module.css'
import { useAudioStore } from '../../store/audioStore'

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

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) {
      return
    }

    audio.src = currentTrack.audio
    audio.load()
    setCurrentTime(0)
    setProgress(0)

    if (isPlaying) {
      void audio.play().catch(() => undefined)
    } else {
      audio.pause()
    }
  }, [currentTrack?.audio, currentTrack?.id, setCurrentTime, setProgress])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) {
      return
    }

    if (isPlaying) {
      void audio.play().catch(() => undefined)
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack?.id])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

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
    if (!audio) {
      return
    }

    const nextTime = audio.currentTime
    setCurrentTime(nextTime)
    setProgress(nextTime)
  }

  const handleLoadedMetadata = () => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    setDuration(audio.duration || 0)
  }

  if (!currentTrack || !isVisible) {
    return null
  }

  return (
    <div className={styles.player}>
      <div className={styles.playerHeader}>
        <div className={styles.trackInfo}>
          <img src={currentTrack.cover} alt={currentTrack.title} className={styles.cover} />
          <div>
            <p className={styles.title}>{currentTrack.title}</p>
            <p className={styles.artist}>{currentTrack.artist}</p>
          </div>
        </div>
        <div className={styles.controls}>
          <button type="button" className={styles.iconButton} onClick={toggleShuffle} aria-label="Переключить случайный порядок">
            <FiShuffle color={shuffle ? '#c71d1b' : '#cfcbcb'} />
          </button>
          <button type="button" className={styles.iconButton} onClick={previousTrack} aria-label="Предыдущий трек">
            <FiSkipBack />
          </button>
          <button type="button" className={styles.playButton} onClick={togglePlay} aria-label={isPlaying ? 'Пауза' : 'Воспроизведение'}>
            {isPlaying ? <FiPause /> : <FiPlay />}
          </button>
          <button type="button" className={styles.iconButton} onClick={nextTrack} aria-label="Следующий трек">
            <FiSkipForward />
          </button>
          <button type="button" className={styles.iconButton} onClick={toggleRepeat} aria-label="Переключить повтор">
            <FiRepeat color={repeat ? '#c71d1b' : '#cfcbcb'} />
          </button>
        </div>
        <button type="button" className={styles.closeButton} onClick={closePlayer} aria-label="Закрыть плеер">
          <FiX />
        </button>
      </div>
      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      <div className={styles.timelineWrap}>
        <div className={styles.volumeWrap}>
          <button type="button" className={styles.iconButton} onClick={toggleMute} aria-label="Переключить беззвучный режим">
            {muted ? <FiVolumeX /> : <FiVolume2 />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            className={styles.range}
            aria-label="Громкость"
          />
        </div>
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={(event) => handleSeek(Number(event.target.value))}
          className={styles.range}
          aria-label="Позиция"
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
