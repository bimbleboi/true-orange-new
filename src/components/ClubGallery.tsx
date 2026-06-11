const clubPhotos = [
  {
    file: 'IMG_7195.jpeg',
    alt: 'True Orange — live show, crowd watching the band from the floor.',
  },
  {
    file: 'P5300447.jpeg',
    alt: 'True Orange — live performance from above the crowd.',
  },
  {
    file: 'IMG_7649.jpg',
    alt: 'True Orange — band on stage, seen from the crowd.',
  },
  {
    file: 'IMG_7212.jpeg',
    alt: 'True Orange — full room during a live set.',
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
