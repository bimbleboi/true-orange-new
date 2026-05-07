type Props = {
  bandName: string
}

export function SiteFooter({ bandName }: Props) {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <p className="site-footer__inner">
        <span className="site-footer__tagline">5:00 AM, Yeah.</span>
        <span className="site-footer__copyright">
          © {year} {bandName}
        </span>
      </p>
    </footer>
  )
}
