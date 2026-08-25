type Props = {
  bandName: string
}

export function SiteFooter({ bandName }: Props) {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <img
        className="site-footer__photo"
        src="/images/band-pic-1.jpg"
        alt="True Orange — band photo."
        loading="lazy"
        decoding="async"
      />
      <div className="site-footer__content">
        <p className="site-footer__inner">
          <span className="site-footer__tagline">5:00 AM, Yeah.</span>
          <span className="site-footer__copyright">
            © {year} {bandName}
          </span>
        </p>
      </div>
    </footer>
  )
}
