import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import jefferson from '../assets/music/jefferson.mp3'
import matimuda from '../assets/music/matimuda.mp3'
import sekianTerimaKasih from '../assets/music/sekian,terima_kasih.mp3'

const TRACKS = [
  { id: jefferson, title: 'Jefferson', artist: 'FSTVLS', src: jefferson },
  { id: matimuda, title: 'Matimuda', artist: 'Jenny', src: matimuda },
  { id: sekianTerimaKasih, title: 'Sekian Terima Kasih', artist: 'The Jeblogs,Lealona', src: sekianTerimaKasih },
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
