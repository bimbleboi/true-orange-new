type Props = {
  background: string
  backgroundAlt: string
  logo: string
  logoAlt: string
  tagline: string
}

export function Hero({
  background,
  backgroundAlt,
  logo,
  logoAlt,
  tagline,
}: Props) {
  return (
    <section className="hero-landing" id="top" aria-labelledby="hero-heading">
      <div className="hero-landing__media">
        <img
          className="hero-landing__bg"
          src={background}
          alt={backgroundAlt}
          width={1920}
          height={1080}
          decoding="async"
        />
        <div className="hero-landing__scrim" aria-hidden="true" />
      </div>
      <div className="hero-landing__content">
        <h1 id="hero-heading" className="hero-landing__title">
          <img
            className="hero-landing__logo"
            src={logo}
            alt={logoAlt}
            width={800}
            height={200}
            decoding="async"
          />
        </h1>
        {tagline.trim() ? (
          <p className="hero-landing__tagline">{tagline}</p>
        ) : null}
      </div>
    </section>
  )
}
