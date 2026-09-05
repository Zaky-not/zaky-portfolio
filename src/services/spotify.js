const LASTFM_ENDPOINT = '/api/lastfm/now-playing'

export const lastfmStatus = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  ERROR: 'error',
}

export async function getLastfmActivity() {
  try {
    const response = await fetch(LASTFM_ENDPOINT)

    if (!response.ok) {
      throw new Error(`Last.fm request failed: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: lastfmStatus.CONNECTED,
      nowPlaying: data.nowPlaying || null,
      previousTracks: data.previousTracks || [],
    }
  } catch (error) {
    console.error('[lastfm]', error)

    return {
      status: lastfmStatus.ERROR,
      error: error.message,
      nowPlaying: null,
      previousTracks: [],
    }
  }
}