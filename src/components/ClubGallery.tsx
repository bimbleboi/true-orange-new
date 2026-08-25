import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type MouseEvent as ReactMouseEvent,
} from 'react'

type StoryMedia =
  | {
      type: 'video'
      src: string
      alt: string
    }
  | {
      type: 'image'
      src: string
      alt: string
    }

const PHOTO_DURATION_MS = 4500

const stories: StoryMedia[] = [
  {
    type: 'video',
    src: '/images/0729.mp4',
    alt: 'True Orange — live performance.',
  },
  {
    type: 'image',
    src: '/images/LDEAN_DSC_5904.jpg',
    alt: 'True Orange — guitar and keys under chartreuse stage light.',
  },
  {
    type: 'image',
    src: '/images/right-column-first-row.jpg',
    alt: 'True Orange — full band live under blue and gold stage lights.',
  },
  {
    type: 'image',
    src: '/images/left-column-second-row.jpg',
    alt: 'True Orange — singer and bass under yellow and blue lights.',
  },
  {
    type: 'image',
    src: '/images/band-pic-aura.jpg',
    alt: 'True Orange — band portrait.',
  },
  {
    type: 'image',
    src: '/images/left-column-third-row.jpg',
    alt: 'True Orange — bass and guitar under blue stage light.',
  },
  {
    type: 'image',
    src: '/images/band-pic-2.jpg',
    alt: 'True Orange — band photo.',
  },
]

export function ClubGallery() {
  const [index, setIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const [muted, setMuted] = useState(true)
  const [reduceMotion, setReduceMotion] = useState(false)

  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const holdTimerRef = useRef<number | null>(null)
  const holdingRef = useRef(false)
  const pointerIdRef = useRef<number | null>(null)
  const photoElapsedRef = useRef(0)

  const current = stories[index]
  const isVideo = current.type === 'video'
  const active = inView && !paused && !reduceMotion

  const goTo = useCallback((next: number) => {
    const len = stories.length
    const wrapped = ((next % len) + len) % len
    photoElapsedRef.current = 0
    setIndex(wrapped)
    setProgress(0)
  }, [])

  const goNext = useCallback(() => {
    goTo(index + 1)
  }, [goTo, index])

  const goPrev = useCallback(() => {
    goTo(index - 1)
  }, [goTo, index])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const el = frameRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.45),
      { threshold: [0, 0.45, 0.75, 1] },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    photoElapsedRef.current = 0
    setProgress(0)
  }, [index])

  useEffect(() => {
    const video = videoRef.current
    if (!isVideo || !video) return

    video.muted = muted

    if (!active) {
      video.pause()
      return
    }

    const play = async () => {
      try {
        await video.play()
      } catch {
        // Autoplay may be blocked until user interacts; keep muted retry path.
      }
    }
    void play()
  }, [active, index, isVideo, muted])

  useEffect(() => {
    if (!active || isVideo) return

    let raf = 0
    const started = performance.now()
    const base = photoElapsedRef.current

    const tick = (now: number) => {
      const elapsed = base + (now - started)
      photoElapsedRef.current = elapsed
      const ratio = Math.min(elapsed / PHOTO_DURATION_MS, 1)
      setProgress(ratio)
      if (ratio >= 1) {
        goNext()
        return
      }
      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [active, goNext, index, isVideo])

  const onVideoTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration || Number.isNaN(video.duration)) return
    setProgress(Math.min(video.currentTime / video.duration, 1))
  }

  const onVideoEnded = () => {
    goNext()
  }

  const clearHoldTimer = () => {
    if (holdTimerRef.current != null) {
      window.clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    pointerIdRef.current = e.pointerId
    holdingRef.current = false
    clearHoldTimer()
    holdTimerRef.current = window.setTimeout(() => {
      holdingRef.current = true
      setPaused(true)
    }, 160)
  }

  const endPointer = (e: ReactPointerEvent<HTMLDivElement>, commitTap: boolean) => {
    if (pointerIdRef.current !== e.pointerId) return
    clearHoldTimer()
    pointerIdRef.current = null

    const wasHolding = holdingRef.current
    holdingRef.current = false
    setPaused(false)

    if (!commitTap || wasHolding) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width * 0.35) goPrev()
    else goNext()
  }

  const onMuteToggle = (e: ReactMouseEvent | ReactPointerEvent) => {
    e.stopPropagation()
    setMuted((m) => !m)
  }

  return (
    <section
      id="gallery"
      className="section club-section"
      aria-labelledby="live-heading"
    >
      <h2 id="live-heading">LIVE @ The Red Room 06/25/26</h2>
      <div
        ref={frameRef}
        className="stories"
        onPointerDown={onPointerDown}
        onPointerUp={(e) => endPointer(e, true)}
        onPointerCancel={(e) => endPointer(e, false)}
        onPointerLeave={(e) => {
          if (pointerIdRef.current != null) endPointer(e, false)
        }}
      >
        <div className="stories__progress" aria-hidden="true">
          {stories.map((story, i) => {
            const fill =
              i < index ? 1 : i === index ? (reduceMotion ? 0 : progress) : 0
            return (
              <div key={story.src} className="stories__segment">
                <div
                  className="stories__segment-fill"
                  style={{ transform: `scaleX(${fill})` }}
                />
              </div>
            )
          })}
        </div>

        <div className="stories__stage">
          {current.type === 'video' ? (
            <video
              key={current.src}
              ref={videoRef}
              className="stories__media"
              src={current.src}
              playsInline
              muted={muted}
              preload="metadata"
              poster="/images/right-column-first-row.jpg"
              onTimeUpdate={onVideoTimeUpdate}
              onEnded={onVideoEnded}
              aria-label={current.alt}
            />
          ) : (
            <img
              key={current.src}
              className="stories__media"
              src={current.src}
              alt={current.alt}
              draggable={false}
            />
          )}
        </div>

        {isVideo ? (
          <button
            type="button"
            className="stories__mute"
            onClick={onMuteToggle}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={muted ? 'Unmute video' : 'Mute video'}
          >
            {muted ? (
              <svg
                className="stories__mute-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M11.5 4.8 7.2 9H3.8v6H7.2l4.3 4.2V4.8Z"
                />
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="m4 4 16 16"
                />
              </svg>
            ) : (
              <svg
                className="stories__mute-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M11.5 4.8 7.2 9H3.8v6H7.2l4.3 4.2V4.8Z"
                />
                <path
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  d="M14.6 9.2a3.4 3.4 0 0 1 0 5.6"
                />
                <path
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  d="M17 6.8a6.6 6.6 0 0 1 0 10.4"
                />
              </svg>
            )}
          </button>
        ) : null}

        <p className="sr-only">
          Tap the right side to advance, left side to go back. Hold to pause.
          Story {index + 1} of {stories.length}.
        </p>
      </div>
    </section>
  )
}
