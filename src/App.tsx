import { useEffect, useState } from 'react'
import site from './data/site.json'
import { Bio } from './components/Bio'
import { ClubGallery } from './components/ClubGallery'
import { EmailSignup } from './components/EmailSignup'
import { Hero } from './components/Hero'
import { LinkGrid } from './components/LinkGrid'
import { ShowList } from './components/ShowList'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import type { SiteConfig } from './types/site'
import './App.css'

const data = site as SiteConfig

function App() {
  const [heroInView, setHeroInView] = useState(true)

  useEffect(() => {
    document.title = data.meta.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', data.meta.description)
  }, [])

  useEffect(() => {
    const el = document.getElementById('top')
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { rootMargin: '-56px 0px 0px 0px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
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
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = easeInOutCubic(progress)
      const nextY = startY + (targetY - startY) * eased
      window.scrollTo(0, nextY)

      if (progress < 1) rafId = window.requestAnimationFrame(animate)
    }

    rafId = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(rafId)
  }, [])

  return (
    <div className="site">
      <SiteHeader
        name={data.band.name}
        logoSrc={data.hero.logo}
        logoAlt={data.hero.logoAlt}
        overlay={heroInView}
      />
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
        <EmailSignup />
        <LinkGrid links={data.links} />
        <ClubGallery />
      </main>
      <SiteFooter bandName={data.band.name} />
    </div>
  )
}

export default App
