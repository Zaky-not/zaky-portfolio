import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'

// Replace src with real files in src/assets/music/ (or /public/music/).
// Keeping this list here means the player UI never needs to change when
// tracks are swapped.
const TRACKS = [
  { id: 'track-01', title: 'Track 01', artist: 'Unreleased', src: '/music/track-01.mp3' },
  { id: 'track-02', title: 'Track 02', artist: 'Unreleased', src: '/music/track-02.mp3' },
  { id: 'track-03', title: 'Track 03', artist: 'Unreleased', src: '/music/track-03.mp3' },
  { id: 'track-04', title: 'Track 04', artist: 'Unreleased', src: '/music/track-04.mp3' },
]

const PlayerContext = createContext(null)

export function PlayerProvider({ children }) {
  const audioRef = useRef(null)
  const [trackIndex, setTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.6)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = 'none'
    }
    audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = TRACKS[trackIndex].src
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleEnded = () => next()
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex])

  const play = useCallback(() => {
    setHasInteracted(true)
    audioRef.current?.play().then(
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    )
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const next = useCallback(() => {
    setTrackIndex((i) => (i + 1) % TRACKS.length)
  }, [])

  const previous = useCallback(() => {
    setTrackIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length)
  }, [])

  const value = useMemo(
    () => ({
      tracks: TRACKS,
      trackIndex,
      currentTrack: TRACKS[trackIndex],
      isPlaying,
      hasInteracted,
      volume,
      setVolume,
      play,
      pause,
      toggle,
      next,
      previous,
      setTrackIndex,
    }),
    [trackIndex, isPlaying, hasInteracted, volume, play, pause, toggle, next, previous]
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
