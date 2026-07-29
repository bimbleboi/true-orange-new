import { useEffect } from 'react'
import site from './data/site.json'
import { Bio } from './components/Bio'
import { ClubGallery } from './components/ClubGallery'
import { EmailSignup } from './components/EmailSignup'
import { Hero } from './components/Hero'
import { LinkGrid } from './components/LinkGrid'
import { ShowList } from './components/ShowList'
import { SiteFooter } from './components/SiteFooter'
import type { SiteConfig } from './types/site'
import './App.css'

const data = site as SiteConfig

function App() {
  useEffect(() => {
    document.title = data.meta.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', data.meta.description)
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    if (window.scrollY > 8) return

    const startY = window.scrollY
    const nudgeDistance = Math.min(Math.round(window.innerHeight * 0.14), 130)
    const targetY = startY + nudgeDistance
    const durationMs = 2800
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

    let rafId = 0
    let cancelled = false
    const startTime = performance.now()

    const stop = () => {
      if (cancelled) return
      cancelled = true
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('touchmove', stop)
      window.removeEventListener('mousedown', stop)
      window.removeEventListener('keydown', onKeyDown)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const scrollKeys = new Set([
        'ArrowDown',
        'ArrowUp',
        'PageDown',
        'PageUp',
        'Home',
        'End',
        ' ',
        'Spacebar',
      ])
      if (scrollKeys.has(e.key)) stop()
    }

    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    window.addEventListener('touchmove', stop, { passive: true })
    window.addEventListener('mousedown', stop)
    window.addEventListener('keydown', onKeyDown)

    const animate = (now: number) => {
      if (cancelled) return

      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = easeInOutCubic(progress)
      const nextY = startY + (targetY - startY) * eased
      window.scrollTo(0, nextY)

      if (progress < 1) {
        rafId = window.requestAnimationFrame(animate)
      } else {
        stop()
      }
    }

    rafId = window.requestAnimationFrame(animate)
    return stop
  }, [])

  return (
    <div className="site">
      <Hero
        background={data.hero.background}
        backgroundAlt={data.hero.backgroundAlt}
        logo={data.hero.logo}
        logoAlt={data.hero.logoAlt}
        tagline={data.band.tagline}
      />
      <main>
        <Bio text={data.band.bio} />
        <ShowList shows={data.shows} />
        <LinkGrid links={data.links} />
        <ClubGallery />
        <EmailSignup />
      </main>
      <SiteFooter bandName={data.band.name} />
    </div>
  )
}

export default App
