'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface SliderImage {
  url: string
  slug: string
  nombre: string
}

export default function EditorialSlider({ images }: { images: SliderImage[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const posRef = useRef(0)
  const rafRef = useRef<number>(0)

  const items = [...images, ...images, ...images]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const speed = 0.5
    const totalWidth = track.scrollWidth / 3
    const animate = () => {
      if (!isPaused) {
        posRef.current += speed
        if (posRef.current >= totalWidth) posRef.current = 0
        track.style.transform = `translateX(-${posRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPaused])

  return (
    <section className="bg-glow-cream py-16 overflow-hidden">
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className="flex gap-3"
          style={{ width: 'max-content', willChange: 'transform' }}
        >
          {items.map((img, i) => (
            <Link
              key={i}
              href={`/productos/${img.slug}`}
              className="relative flex-shrink-0 overflow-hidden block group"
              style={{ width: '320px', height: '420px' }}
            >
              <Image
                src={img.url}
                alt={img.nombre}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="320px"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
