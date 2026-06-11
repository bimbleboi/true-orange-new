type Props = {
  bandName: string
}

export function SiteFooter({ bandName }: Props) {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <img
        className="site-footer__photo"
        src="/images/IMG_7222.jpeg"
        alt="True Orange — band performing on stage under red lights."
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
