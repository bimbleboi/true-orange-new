import type { SiteLink } from '../types/site'

type Props = {
  links: SiteLink[]
}

export function LinkGrid({ links }: Props) {
  return (
    <section className="section" id="links" aria-labelledby="links-heading">
      <h2 id="links-heading">Links</h2>
      <ul className="link-grid">
        {links.map((link) => (
          <li key={link.href}>
            <a
              className="link-grid__pill"
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
