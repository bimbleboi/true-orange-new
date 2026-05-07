import type { SiteShow } from '../types/site'

type Props = {
  shows: SiteShow[]
}

function formatShowDate(isoDate: string) {
  const d = new Date(`${isoDate}T12:00:00`)
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function ShowList({ shows }: Props) {
  return (
    <section className="section" id="shows" aria-labelledby="shows-heading">
      <h2 id="shows-heading">Upcoming Shows</h2>
      {shows.length === 0 ? (
        <p className="muted">No upcoming dates — check back soon.</p>
      ) : (
        <ul className="show-list">
          {shows.map((show) => (
            <li key={`${show.date}-${show.venue}`} className="show-list__item">
              <div className="show-list__when">{formatShowDate(show.date)}</div>
              <div className="show-list__where">
                <span className="show-list__venue">{show.venue}</span>
                <span className="show-list__city">{show.city}</span>
              </div>
              <div className="show-list__actions">
                {show.ticketsUrl ? (
                  <a href={show.ticketsUrl} className="button-link">
                    Tickets
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
