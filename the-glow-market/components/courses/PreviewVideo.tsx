'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

export default function PreviewVideo({ cursoId }: { cursoId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    fetch('/api/videos/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cursoId }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Sin video preview')
        return res.json()
      })
      .then((data) => { setSignedUrl(data.url); setLoading(false) })
      .catch((err) => { setError(err.message); setLoading(false) })
  }, [cursoId])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true)
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000)
    }
  }, [isPlaying])

  const togglePlay = () => {
    if (!videoRef.current) return
    isPlaying ? videoRef.current.pause() : videoRef.current.play()
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    if (!isFullscreen) await containerRef.current.requestFullscreen?.()
    else await document.exitFullscreen?.()
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    videoRef.current.currentTime = ((e.clientX - rect.left) / rect.width) * videoRef.current.duration
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

  if (loading) return (
    <div className="aspect-video bg-glow-navy/5 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-glow-blush border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error || !signedUrl) return null

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black group"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        ref={videoRef}
        src={signedUrl}
        className="w-full h-full select-none"
        controlsList="nodownload"
        disablePictureInPicture
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (!videoRef.current) return
          setCurrentTime(videoRef.current.currentTime)
          setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
        }}
        onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration) }}
        onClick={togglePlay}
      />
      <div className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div ref={progressRef} className="mx-4 mb-3 h-1 bg-white/20 cursor-pointer" onClick={handleProgressClick}>
          <div className="h-full bg-glow-blush" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-4 px-4 pb-4">
          <button onClick={togglePlay} className="text-white hover:text-glow-blush transition-colors">
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button onClick={toggleMute} className="text-white hover:text-glow-blush transition-colors">
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <span className="font-montserrat text-[10px] text-white/60 tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button onClick={toggleFullscreen} className="text-white hover:text-glow-blush transition-colors ml-auto">
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
