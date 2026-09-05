export default function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return res.status(500).json({
      error: 'Spotify login configuration is missing.',
      clientId: Boolean(clientId),
      redirectUri: Boolean(redirectUri),
    })
  }

  const scope = [
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-top-read',
  ].join(' ')

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope,
  })

  return res.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`,
  )
}
