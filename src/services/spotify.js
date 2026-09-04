// Spotify integration point.
//
// This file is intentionally the ONLY place that knows how to reach Spotify.
// UI components never call fetch() directly — they call the functions below
// and render whatever state comes back (loading / connected / not-connected).
//
// Required env vars (create a .env file, see .env.example):
//   VITE_SPOTIFY_CLIENT_ID
// The CLIENT SECRET must never live in frontend code. If you need one
// (e.g. for the Client Credentials or Authorization Code flow with refresh
// tokens), put it behind a small serverless function / backend route and
// have this file call that endpoint instead of Spotify directly.
//
// Suggested architecture:
//   Browser  ->  /api/spotify/now-playing (your serverless function)
//                     -> holds refresh token + client secret server-side
//                     -> calls Spotify Web API
//                     -> returns just the fields the UI needs
//
// Until that backend exists, these functions safely report "not connected"
// instead of fabricating data that looks live.

const SPOTIFY_ENDPOINT = import.meta.env.VITE_SPOTIFY_API_ENDPOINT || null

export const spotifyStatus = {
  NOT_CONFIGURED: 'not_configured',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
}

/**
 * Fetches the currently playing track plus light listening stats.
 * Returns a discriminated-union-style object so the UI can branch on `status`.
 */
export async function getSpotifyActivity() {
  if (!SPOTIFY_ENDPOINT) {
    return { status: spotifyStatus.NOT_CONFIGURED }
  }

  try {
    const response = await fetch(SPOTIFY_ENDPOINT, { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`Spotify endpoint responded ${response.status}`)
    const data = await response.json()

    return {
      status: spotifyStatus.CONNECTED,
      nowPlaying: data.nowPlaying ?? null, // { track, artist, albumArt, isPlaying }
      topArtists: data.topArtists ?? [],
      topTracks: data.topTracks ?? [],
      listeningTimeHours: data.listeningTimeHours ?? null,
    }
  } catch (error) {
    console.error('[spotify] failed to load activity:', error)
    return { status: spotifyStatus.ERROR, error: error.message }
  }
}
