import { useCallback, useEffect, useRef, useState } from 'react'

const clubPhotos = [
  {
    file: 'picture-1.jpg',
    alt: 'True Orange — band candid on the couch.',
  },
  {
    file: 'picture-2.jpg',
    alt: 'True Orange — band photo indoors.',
  },
  {
    file: 'picture-3.jpg',
    alt: 'True Orange — group on the couch, pink light.',
  },
] as const

const DRAG_THRESHOLD_PX = 48
const WHEEL_THRESHOLD = 72

export function ClubGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeIndexRef = useRef(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const wheelAcc = useRef(0)
  const wheelResetT = useRef<ReturnType<typeof setTimeout> | null>(null)
  const drag = useRef<{ pointerId: number | null; startX: number }>({
    pointerId: null,
    startX: 0,
  })

  const count = clubPhotos.length

  const readIndex = useCallback(() => {
    const el = viewportRef.current
    if (!el) return 0
    const w = el.clientWidth
    if (w <= 0) return 0
    return Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / w)))
  }, [count])

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = 'smooth') => {
      const el = viewportRef.current
      if (!el) return
      const w = el.clientWidth
      if (w <= 0) return
      const clamped = Math.min(count - 1, Math.max(0, index))
      activeIndexRef.current = clamped
      el.scrollTo({ left: clamped * w, behavior })
      setActiveIndex(clamped)
    },
    [count],
  )

  const goPrev = useCallback(() => {
    const cur = readIndex()
    scrollToIndex((cur - 1 + count) % count)
  }, [count, readIndex, scrollToIndex])

  const goNext = useCallback(() => {
    const cur = readIndex()
    scrollToIndex((cur + 1) % count)
  }, [count, readIndex, scrollToIndex])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const onScroll = () => {
      const i = readIndex()
      activeIndexRef.current = i
      setActiveIndex(i)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const ro = new ResizeObserver(() => {
      scrollToIndex(activeIndexRef.current, 'auto')
    })
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [readIndex, scrollToIndex])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const bumpWheel = () => {
      wheelAcc.current = 0
      if (wheelResetT.current != null) clearTimeout(wheelResetT.current)
    }

    const onWheel = (e: WheelEvent) => {
      const dominantX = Math.abs(e.deltaX) >= Math.abs(e.deltaY)
      const delta = dominantX ? e.deltaX : e.shiftKey ? e.deltaY : 0
      const carouselIntent = dominantX || e.shiftKey

      if (!carouselIntent) {
        bumpWheel()
        return
      }
      if (Math.abs(delta) < 0.35) return

      e.preventDefault()

      wheelAcc.current += delta
      wheelAcc.current = Math.max(-240, Math.min(240, wheelAcc.current))

      if (wheelResetT.current != null) clearTimeout(wheelResetT.current)
      wheelResetT.current = setTimeout(() => bumpWheel(), 140)

      if (wheelAcc.current <= -WHEEL_THRESHOLD) {
        goNext()
        bumpWheel()
      } else if (wheelAcc.current >= WHEEL_THRESHOLD) {
        goPrev()
        bumpWheel()
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      if (wheelResetT.current != null) clearTimeout(wheelResetT.current)
    }
  }, [goPrev, goNext])

  const onViewportPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onViewportPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current.pointerId !== e.pointerId) return
    const dx = e.clientX - drag.current.startX
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* released */
    }
    drag.current.pointerId = null

    if (Math.abs(dx) < DRAG_THRESHOLD_PX) return
    if (dx > 0) goPrev()
    else goNext()
  }

  return (
    <section
      id="gallery"
      className="section club-section"
      aria-labelledby="gallery-heading"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          goPrev()
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          goNext()
        }
      }}
      tabIndex={0}
    >
      <h2 className="section-heading club-callout" id="gallery-heading">
        Join the True Orange club
      </h2>

      <div
        className="club-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Band photo gallery"
      >
        <div
          className="club-carousel__viewport"
          ref={viewportRef}
          onPointerDown={onViewportPointerDown}
          onPointerUp={onViewportPointerUp}
          onPointerCancel={onViewportPointerUp}
        >
          {clubPhotos.map((photo, i) => (
            <figure
              key={photo.file}
              className="club-carousel__slide"
              aria-hidden={i !== activeIndex}
            >
              <img
                src={`/images/${encodeURIComponent(photo.file)}`}
                alt={photo.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </figure>
          ))}
        </div>

        <div className="club-carousel__dots" role="tablist" aria-label="Choose photo">
          {clubPhotos.map((photo, i) => (
            <button
              key={photo.file}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              className={`club-carousel__dot${i === activeIndex ? ' club-carousel__dot--active' : ''}`}
              onClick={() => scrollToIndex(i)}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
