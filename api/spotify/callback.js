export default async function handler(req, res) {
  const { code, error } = req.query

  if (error) {
    return res.status(400).send(`Spotify authorization failed: ${error}`)
  }

  if (!code) {
    return res.status(400).send('Missing Spotify authorization code.')
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    return res.status(500).json({
      error: 'Spotify environment variables are missing.',
      clientId: Boolean(clientId),
      clientSecret: Boolean(clientSecret),
      redirectUri: Boolean(redirectUri),
    })
  }

  try {
    const credentials = Buffer.from(
      `${clientId}:${clientSecret}`,
    ).toString('base64')

    const response = await fetch(
      'https://accounts.spotify.com/api/token',
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
      },
    )

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      console.error('Spotify token error:', data)

      return res.status(response.status).json({
        error: data.error || 'Failed to get Spotify token.',
        description: data.error_description || '',
      })
    }

    // Jangan tampilkan token di browser.
    // Token hanya ditulis ke terminal Vercel Dev.
    console.log('========================================')
    console.log('SPOTIFY CONNECTED')
    console.log('REFRESH TOKEN:')
    console.log(data.refresh_token)
    console.log('========================================')

    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Spotify Connected</title>
        </head>
        <body style="
          font-family: monospace;
          background: #111;
          color: #fff;
          padding: 40px;
        ">
          <h2>Spotify connected successfully.</h2>
          <p>Refresh token berhasil dibuat.</p>
          <p>
            Cek terminal tempat
            <b>vercel dev</b>
            berjalan.
          </p>
          <p>
            Jangan kirim refresh token tersebut ke siapa pun.
          </p>
        </body>
      </html>
    `)
  } catch (error) {
    console.error('Spotify callback error:', error)

    return res.status(500).send('Spotify callback failed.')
  }
}
