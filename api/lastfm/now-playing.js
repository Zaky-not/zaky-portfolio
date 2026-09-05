export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')

    return res.status(405).json({
      error: 'Method not allowed',
    })
  }

  const apiKey = process.env.LASTFM_API_KEY
  const username = process.env.LASTFM_USERNAME

  if (!apiKey || !username) {
    return res.status(500).json({
      error: 'Last.fm configuration is missing.',
      apiKey: Boolean(apiKey),
      username: Boolean(username),
    })
  }

  try {
    const params = new URLSearchParams({
      method: 'user.getrecenttracks',
      user: username,
      api_key: apiKey,
      format: 'json',
      limit: '6',
    })

    const response = await fetch(
      `https://ws.audioscrobbler.com/2.0/?${params.toString()}`,
      {
        headers: {
          Accept: 'application/json',
        },
      },
    )

    const data = await response.json()

    if (!response.ok || data.error) {
      return res.status(502).json({
        error: 'Last.fm API request failed.',
        details: data,
      })
    }

    const tracks = data.recenttracks?.track || []

    /*
     * Last.fm mengembalikan:
     *
     * tracks[0] = lagu yang sedang diputar
     *              atau lagu terakhir dimainkan
     *
     * tracks[1..5] = 5 lagu sebelum lagu tersebut
     */

    const formatTrack = (track) => ({
      track: track.name || 'Unknown Track',

      artist:
        track.artist?.['#text'] ||
        'Unknown Artist',

      album:
        track.album?.['#text'] ||
        '',

      albumArt:
        track.image?.find(
          (image) => image.size === 'extralarge',
        )?.['#text'] || '',

      isPlaying:
        track['@attr']?.nowplaying === 'true',

      url:
        track.url || '',
    })

    const currentTrack = tracks[0]
      ? formatTrack(tracks[0])
      : null

    const previousTracks = tracks
      .slice(1, 6)
      .map(formatTrack)

    return res.status(200).json({
      nowPlaying: currentTrack,
      previousTracks,
    })
  } catch (error) {
    console.error('Last.fm error:', error)

    return res.status(502).json({
      error: 'Unable to reach Last.fm.',
      details: error.message,
    })
  }
}
