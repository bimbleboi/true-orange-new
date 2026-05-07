import { useCallback, useEffect, useRef, useState } from 'react'

const clubPhotos = [
  {
    file: 'picture 1.png',
    alt: 'True Orange — band candid on the couch.',
  },
  {
    file: 'picture 2.png',
    alt: 'True Orange — band photo indoors.',
  },
  {
    file: 'picture 3.png',
    alt: 'True Orange — group on the couch, pink light.',
  },
] as const

const DRAG_THRESHOLD_PX = 48
const WHEEL_THRESHOLD = 72

export function ClubGallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const viewportRef = useRef<HTMLDivElement>(null)
  const wheelAcc = useRef(0)
  const wheelResetT = useRef<ReturnType<typeof setTimeout> | null>(null)
  const drag = useRef<{ pointerId: number | null; startX: number }>({
    pointerId: null,
    startX: 0,
  })

  const count = clubPhotos.length
  const prevIndex = (activeIndex - 1 + count) % count
  const nextIndex = (activeIndex + 1) % count

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + count) % count)
  }, [count])

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % count)
  }, [count])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    const bumpWheel = () => {
      wheelAcc.current = 0
      if (wheelResetT.current != null) clearTimeout(wheelResetT.current)
    }

    const onWheel = (e: WheelEvent) => {
      const dominantX = Math.abs(e.deltaX) >= Math.abs(e.deltaY)
      const delta =
        dominantX ? e.deltaX : e.shiftKey ? e.deltaY : 0
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
      wheelResetT.current = setTimeout(() => {
        bumpWheel()
      }, 140)

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

  const onActivePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onActivePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current.pointerId !== e.pointerId) return
    const dx = e.clientX - drag.current.startX
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* released */
    }
    drag.current.pointerId = null
    if (Math.abs(dx) >= DRAG_THRESHOLD_PX) {
      if (dx > 0) goPrev()
      else goNext()
    }
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
        <div className="club-carousel__viewport" ref={viewportRef}>
          <div className="club-carousel__track">
            <button
              type="button"
              className="club-carousel__slide club-carousel__slide--side"
              aria-label={`Previous photo: ${clubPhotos[prevIndex].alt}`}
              onClick={goPrev}
            >
              <img
                src={`/images/${encodeURIComponent(clubPhotos[prevIndex].file)}`}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </button>
            <div
              id="club-carousel-pane"
              className="club-carousel__slide club-carousel__slide--active"
              aria-hidden={false}
              onPointerDown={onActivePointerDown}
              onPointerUp={onActivePointerUp}
              onPointerCancel={onActivePointerUp}
            >
              <img
                src={`/images/${encodeURIComponent(clubPhotos[activeIndex].file)}`}
                alt={clubPhotos[activeIndex].alt}
                loading="eager"
                decoding="async"
                draggable={false}
              />
            </div>
            <button
              type="button"
              className="club-carousel__slide club-carousel__slide--side"
              aria-label={`Next photo: ${clubPhotos[nextIndex].alt}`}
              onClick={goNext}
            >
              <img
                src={`/images/${encodeURIComponent(clubPhotos[nextIndex].file)}`}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </button>
          </div>
        </div>
        <div
          className="club-carousel__dots"
          role="tablist"
          aria-label="Choose photo"
        >
          {clubPhotos.map((_, i) => (
            <button
              key={clubPhotos[i].file}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-controls="club-carousel-pane"
              className={`club-carousel__dot${i === activeIndex ? ' club-carousel__dot--active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
