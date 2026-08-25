import type { SiteRelease } from '../types/site'

type Props = {
  releases: SiteRelease[]
}

export function ReleaseList({ releases }: Props) {
  return (
    <section className="section" id="music" aria-labelledby="music-heading">
      <h2 id="music-heading">Music</h2>
      {releases.length === 0 ? (
        <p className="muted">Releases coming soon.</p>
      ) : (
        <ul className="release-list">
          {releases.map((r) => (
            <li key={r.title}>
              <a
                href={r.href}
                {...(r.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              >
                <span className="release-list__title">{r.title}</span>
                <span className="release-list__year">{r.year}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
