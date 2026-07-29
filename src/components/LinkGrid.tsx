import type { SiteLink } from '../types/site'

type Props = {
  links: SiteLink[]
}

export function LinkGrid({ links }: Props) {
  return (
    <section className="section" id="links" aria-label="Links">
      <ul className="link-grid">
        {links.map((link) => (
          <li key={link.href}>
            <a
              className="button-link"
              href={link.href}
              {...(link.external !== false
                ? { target: '_blank', rel: 'noreferrer' }
                : {})}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
