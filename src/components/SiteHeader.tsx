type Props = {
  name: string
  logoSrc: string
  logoAlt: string
  overlay?: boolean
}

export function SiteHeader({ name, logoSrc, logoAlt, overlay }: Props) {
  const heroBar = overlay === true

  return (
    <header
      className={`site-header${heroBar ? ' site-header--overlay' : ''}`}
    >
      <div className="site-header__inner">
        <div
          className={`site-header__tier site-header__tier--expanded${heroBar ? ' is-visible' : ' is-away'}`}
          aria-hidden={!heroBar}
        >
          <a className="site-logo site-logo--hero-bar" href="#top">
            {name}
          </a>
          <nav className="site-nav site-nav--hero-bar" aria-label="On this page">
            <a href="#shows">Upcoming Shows</a>
            <a href="#links">Links</a>
          </nav>
        </div>
        <div
          className={`site-header__tier site-header__tier--compact${heroBar ? ' is-away' : ' is-visible'}`}
          aria-hidden={heroBar}
        >
          <a className="site-logo site-logo--mark" href="#top">
            <img
              src={logoSrc}
              alt={logoAlt}
              width={560}
              height={140}
              decoding="async"
            />
          </a>
        </div>
      </div>
    </header>
  )
}
