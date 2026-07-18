const clubPhotos = [
  {
    file: 'LDEAN_DSC_5904.jpg',
    alt: 'True Orange — guitar and keys under chartreuse stage light.',
  },
  {
    file: 'right-column-first-row.jpg',
    alt: 'True Orange — full band live under blue and gold stage lights.',
  },
  {
    file: 'left-column-second-row.jpg',
    alt: 'True Orange — singer and bass under yellow and blue lights.',
  },
  {
    file: 'band-pic-aura.jpg',
    alt: 'True Orange — band portrait.',
  },
  {
    file: 'left-column-third-row.jpg',
    alt: 'True Orange — bass and guitar under blue stage light.',
  },
  {
    file: 'band-pic-2.jpg',
    alt: 'True Orange — band photo.',
  },
] as const

export function ClubGallery() {
  return (
    <section
      id="gallery"
      className="section club-section"
      aria-label="Band photo gallery"
    >
      <div className="club-gallery">
        {clubPhotos.map((photo) => (
          <figure key={photo.file} className="club-gallery__item">
            <img
              src={`/images/${encodeURIComponent(photo.file)}`}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ))}
      </div>
    </section>
  )
}
