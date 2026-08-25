type Props = {
  text: string
}

export function Bio({ text }: Props) {
  return (
    <section className="section section--bio" aria-labelledby="bio-heading">
      <h2 id="bio-heading">About</h2>
      <p className="bio-copy">{text}</p>
    </section>
  )
}
