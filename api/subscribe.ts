type Req = { method?: string; body?: { email?: string } }
type Res = {
  status: (code: number) => { json: (body: unknown) => void }
}

const MAILERLITE_API = 'https://connect.mailerlite.com/api/subscribers'

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.MAILERLITE_API_KEY
  const groupId = process.env.MAILERLITE_GROUP_ID

  if (!apiKey || !groupId) {
    return res.status(500).json({ error: 'Email signup is not configured' })
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : ''

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  try {
    const mlRes = await fetch(MAILERLITE_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, groups: [groupId] }),
    })

    if (mlRes.ok || mlRes.status === 422 || mlRes.status === 409) {
      return res.status(200).json({ ok: true })
    }

    const err = await mlRes.json().catch(() => ({}))
    const msg =
      typeof err === 'object' &&
      err !== null &&
      'message' in err &&
      typeof (err as { message: unknown }).message === 'string'
        ? (err as { message: string }).message
        : 'Signup failed. Please try again.'

    return res.status(502).json({ error: msg })
  } catch {
    return res.status(502).json({ error: 'Signup failed. Please try again.' })
  }
}
