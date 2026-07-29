export type SiteLink = {
  label: string
  href: string
  external?: boolean
}

export type SiteShow = {
  date: string
  venue: string
  city: string
  detailUrl?: string | null
  ticketsUrl?: string | null
}

export type SiteRelease = {
  title: string
  year: string
  href: string
  external?: boolean
}

export type SiteConfig = {
  meta: {
    title: string
    description: string
  }
  band: {
    name: string
    tagline: string
    bio: string
  }
  hero: {
    background: string
    backgroundAlt: string
    logo: string
    logoAlt: string
  }
  links: SiteLink[]
  shows: SiteShow[]
  releases: SiteRelease[]
}
