'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

interface VideoPlayerProps {
  lessonId: string
  title?: string
}

export default function VideoPlayer({ lessonId, title }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

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

  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Fetch signed URL
  useEffect(() => {
    setLoading(true)
    setError(null)
    setSignedUrl(null)

    fetch('/api/videos/signed-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Error al cargar el video')
        }
        return res.json()
      })
      .then((data) => {
        setSignedUrl(data.url)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [lessonId])

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true)
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000)
    }
  }, [isPlaying])

  useEffect(() => {
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current)
    }
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    if (!isFullscreen) {
      await containerRef.current.requestFullscreen?.()
    } else {
      await document.exitFullscreen?.()
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = x / rect.width
    videoRef.current.currentTime = pct * videoRef.current.duration
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${String(sec).padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="aspect-video bg-glow-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-glow-blush border-t-transparent rounded-full animate-spin" />
          <p className="font-montserrat text-xs text-white/40 tracking-widest uppercase">
            Cargando video
          </p>
        </div>
      </div>
    )
  }

  if (error || !signedUrl) {
    return (
      <div className="aspect-video bg-glow-dark flex items-center justify-center">
        <p className="font-montserrat text-xs text-white/40 text-center px-6">
          {error || 'No se pudo cargar el video.'}
        </p>
      </div>
    )
  }

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
        controlsList="nodownload nofullscreen"
        disablePictureInPicture
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={() => {
          if (!videoRef.current) return
          setCurrentTime(videoRef.current.currentTime)
          setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
        }}
        onLoadedMetadata={() => {
          if (!videoRef.current) return
          setDuration(videoRef.current.duration)
        }}
        onClick={togglePlay}
      />

      <div
        className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          ref={progressRef}
          className="mx-4 mb-3 h-1 bg-white/20 cursor-pointer group/progress"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-glow-blush transition-all duration-100 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-glow-blush opacity-0 group-hover/progress:opacity-100 transition-opacity -translate-x-1/2" />
          </div>
        </div>

        <div className="flex items-center gap-4 px-4 pb-4">
          <button
            onClick={togglePlay}
            className="text-white hover:text-glow-blush transition-colors"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>

          <button
            onClick={toggleMute}
            className="text-white hover:text-glow-blush transition-colors"
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          <span className="font-montserrat text-[10px] text-white/60 ml-1 tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {title && (
            <span className="font-cormorant text-sm text-white/60 flex-1 truncate ml-2">
              {title}
            </span>
          )}

          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-glow-blush transition-colors ml-auto"
            aria-label="Pantalla completa"
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
