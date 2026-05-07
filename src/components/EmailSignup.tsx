import { useState } from 'react'
import type { FormEvent } from 'react'

export function EmailSignup() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = email.trim()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)

    if (!valid) {
      setIsSuccess(false)
      setMessage('Please enter a valid email address.')
      return
    }

    setIsSuccess(true)
    setMessage('Thanks for signing up! You are on the list.')
    setEmail('')
  }

  return (
    <section className="section" id="signup" aria-labelledby="signup-heading">
      <h2 id="signup-heading">Email List</h2>
      <p className="signup-description">Sign up to receive updates on the band</p>
      <form className="signup-form" onSubmit={onSubmit} noValidate>
        <label htmlFor="email-input" className="sr-only">
          Email address
        </label>
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {message ? (
        <p
          className={`signup-message${isSuccess ? ' signup-message--success' : ''}`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      ) : null}
    </section>
  )
}
