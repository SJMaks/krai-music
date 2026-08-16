import { useEffect, useRef, useSyncExternalStore } from 'react'
import type { CSSProperties } from 'react'
import { FiPause, FiPlay, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX, FiRepeat, FiShuffle, FiX } from 'react-icons/fi'
import styles from './Player.module.css'
import { useAudioStore } from '../../store/audioStore'
import { Link } from 'react-router-dom'
import { getMediaUrl } from '../../shared/lib/media'

// Мобильная версия: ползунок громкости скрыт, звук всегда на максимуме
function subscribeToViewport(callback: () => void): () => void {
  const mql = window.matchMedia('(max-width: 620px)')
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getMobileSnapshot(): boolean {
  return window.matchMedia('(max-width: 620px)').matches
}

function useIsMobile(): boolean {
  return useSyncExternalStore(subscribeToViewport, getMobileSnapshot, () => false)
}

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

  const isMobile = useIsMobile()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Фактическая громкость: на мобильных всегда максимум, без беззвучного режима
  const effectiveVolume = isMobile ? 1 : volume
  const effectiveMuted = isMobile ? false : muted

  // Главный эффект: управление источником и воспроизведением
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    // Определяем, нужна ли загрузка источника:
    // 1) на свежем <audio> (после закрытия плеера) src пуст → грузим заново,
    //    даже если выбран «тот же самый» трек;
    // 2) трек не менялся, но store сбросил время в 0 (повторное нажатие «Слушать»),
    //    а звук всё ещё в середине → перезапускаем источник.
    const url = getMediaUrl(currentTrack.audio)
    // Читаем время из стора без реактивной подписки, чтобы не перезапускать эффект
    const restartRequested =
      audio.dataset.src === url &&
      audio.currentTime > 0 &&
      useAudioStore.getState().currentTime === 0
    if (audio.dataset.src !== url || restartRequested) {
      audio.dataset.src = url
      audio.src = url
      audio.load()
      audio.currentTime = 0
      setCurrentTime(0)
      setProgress(0)
      setDuration(0)
    }

    // Управление воспроизведением
    if (isPlaying) {
      if (audio.paused) {
        void audio.play().catch(() => { })
      }
    } else {
      audio.pause()
    }
  }, [currentTrack, isPlaying, setCurrentTime, setProgress, setDuration])

  // Эффект для громкости
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = effectiveVolume
    audio.muted = effectiveMuted
  }, [effectiveVolume, effectiveMuted])

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
    audio.volume = effectiveVolume
    audio.muted = effectiveMuted
  }

  const handleCanPlay = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = effectiveVolume
    audio.muted = effectiveMuted
  }

  if (!currentTrack || !isVisible) {
    return null
  }

  const authors = currentTrack.authors ?? []
  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0
  const volumePercent = (muted ? 0 : volume) * 100

  const playerStyle = {
    '--player-progress': `${progressPercent}%`,
    '--volume-progress': `${volumePercent}%`,
  } as CSSProperties

  return (
    <div className={styles.player} style={playerStyle}>
      {/* Тонкая полоса прогресса во всю ширину — фирменный приём Яндекс Музыки */}
      <div className={styles.topTrack}>
        <div className={styles.topLine}>
          <div className={styles.topLineFill} style={{ width: `${progressPercent}%` }} />
        </div>
        <input
          type="range"
          className={styles.topInput}
          min="0"
          max={duration || 100}
          step="0.1"
          value={currentTime}
          onChange={(e) => handleSeek(Number(e.target.value))}
          aria-label="Позиция воспроизведения"
        />
      </div>

      <div className={styles.body}>
        <div className={styles.leftGroup}>
          <span className={styles.timeText}>{formatTime(currentTime)}</span>
          <div className={styles.trackInfo}>
            {authors.length > 0 ? (
              <Link to={`/artists/${authors[0].id}`} className={styles.coverLink} aria-label={`Открыть страницу ${authors[0].nickname}`}>
                <img src={getMediaUrl(currentTrack.cover)} alt={currentTrack.title} className={styles.cover} />
              </Link>
            ) : (
              <img src={getMediaUrl(currentTrack.cover)} alt={currentTrack.title} className={styles.cover} />
            )}
            <div className={styles.trackMeta}>
              <p className={styles.title}>{currentTrack.title}</p>
              <div className={styles.authors}>
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
                  <span className={styles.artistLink}>Неизвестный артист</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.center}>
          <div className={styles.controls}>
            <button
              type="button"
              className={`${styles.stateButton} ${shuffle ? styles.active : ''}`}
              onClick={toggleShuffle}
              aria-label="Перемешать"
              title="Перемешать"
            >
              <FiShuffle size={15} />
            </button>
            <button type="button" className={styles.roundButton} onClick={previousTrack} aria-label="Предыдущий трек" title="Предыдущий трек">
              <FiSkipBack size={18} />
            </button>
            <button
              type="button"
              className={styles.playButton}
              onClick={togglePlay}
              aria-label={isPlaying ? 'Пауза' : 'Слушать'}
              title={isPlaying ? 'Пауза' : 'Слушать'}
            >
              {isPlaying ? <FiPause size={19} className={styles.pauseIcon} /> : <FiPlay size={19} className={styles.playIcon} />}
            </button>
            <button type="button" className={styles.roundButton} onClick={nextTrack} aria-label="Следующий трек" title="Следующий трек">
              <FiSkipForward size={18} />
            </button>
            <button
              type="button"
              className={`${styles.stateButton} ${repeat ? styles.active : ''}`}
              onClick={toggleRepeat}
              aria-label="Повторить"
              title="Повторить"
            >
              <FiRepeat size={15} />
            </button>
          </div>
        </div>

        <div className={styles.rightGroup}>
          <div className={styles.utilities}>
            <div className={styles.volumeWrap}>
              <button
                type="button"
                className={`${styles.stateButton} ${muted ? styles.active : ''}`}
                onClick={toggleMute}
                aria-label="Выключить звук"
                title="Звук"
              >
                {muted ? <FiVolumeX size={17} /> : <FiVolume2 size={17} />}
              </button>
              <div className={styles.volumeTrack}>
                <div className={styles.volumeLine}>
                  <div className={styles.volumeLineFill} style={{ width: `${volumePercent}%` }} />
                </div>
                <input
                  type="range"
                  className={styles.volumeInput}
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value))
                    if (muted && Number(e.target.value) > 0) {
                      toggleMute()
                    }
                  }}
                  aria-label="Громкость"
                />
              </div>
            </div>
            <button type="button" className={styles.closeButton} onClick={closePlayer} aria-label="Свернуть плеер" title="Свернуть">
              <FiX size={18} />
            </button>
          </div>
          <span className={styles.timeText}>{formatTime(duration)}</span>
        </div>
      </div>

      <audio
        ref={audioRef}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onCanPlay={handleCanPlay}
        onEnded={() => {
          const { repeat } = useAudioStore.getState()
          if (repeat) {
            const audio = audioRef.current
            if (audio) {
              audio.currentTime = 0
              setCurrentTime(0)
              setProgress(0)
              void audio.play().catch(() => { })
            }
            return
          }
          nextTrack()
        }}
      />
    </div>
  )
}

function formatTime(value: number) {
  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}