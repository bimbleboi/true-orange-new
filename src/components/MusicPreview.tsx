import { useEffect, useRef } from 'react'

type Props = {
  heading: string
  src: string
  listenUrl?: string
  clipStart: number
  clipEnd: number
}

export function MusicPreview({
  heading,
  src,
  listenUrl,
  clipStart,
  clipEnd,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const clampTime = () => {
      if (audio.currentTime < clipStart) audio.currentTime = clipStart
      if (audio.currentTime > clipEnd) audio.currentTime = clipEnd
    }

    const onPlay = () => {
      if (audio.currentTime < clipStart || audio.currentTime >= clipEnd) {
        audio.currentTime = clipStart
      }
    }

    const onTimeUpdate = () => {
      if (audio.currentTime >= clipEnd) {
        audio.pause()
        audio.currentTime = clipStart
      }
    }

    const onSeeked = () => {
      clampTime()
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('seeked', onSeeked)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('seeked', onSeeked)
    }
  }, [clipStart, clipEnd])

  return (
    <section className="section" id="music" aria-labelledby="music-heading">
      <h2 id="music-heading">{heading}</h2>
      <div className="music-preview">
        <audio
          ref={audioRef}
          className="music-preview__player"
          controls
          preload="metadata"
          src={src}
        >
          Your browser does not support audio playback.
        </audio>
        {listenUrl ? (
          <a
            className="music-preview__link button-link"
            href={listenUrl}
            target="_blank"
            rel="noreferrer"
          >
            Full track on Bandcamp
          </a>
        ) : null}
      </div>
    </section>
  )
}
