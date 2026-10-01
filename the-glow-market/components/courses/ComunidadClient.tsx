'use client'

import '@/components/ui/glow-spaces.css'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Send, MessageCircle } from 'lucide-react'

const NINA_EMAIL = 'ninaamateis@gmail.com'

interface Reply {
  id: string
  contenido: string
  created_at: string
  user_id: string
  email?: string
}

interface Post {
  id: string
  contenido: string
  created_at: string
  user_id: string
  email?: string
  likes: number
  liked_by_user: boolean
  respuestas: Reply[]
}

interface Props {
  posts: Post[]
  currentUserId: string
  currentUserEmail: string
}

export default function ComunidadClient({
  posts: initialPosts,
  currentUserId,
  currentUserEmail,
}: Props) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [nuevoPost, setNuevoPost] = useState('')
  const [loadingPost, setLoadingPost] = useState(false)
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({})
  const [replyOpen, setReplyOpen] = useState<Record<string, boolean>>({})

  function formatName(email?: string) {
    if (!email) return 'Alumna'
    return email.split('@')[0]
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  async function handlePost() {
    if (!nuevoPost.trim() || loadingPost) return

    setLoadingPost(true)

    try {
      const res = await fetch('/api/comunidad/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: nuevoPost.trim() }),
      })

      if (res.ok) {
        setNuevoPost('')
        router.refresh()
      }
    } finally {
      setLoadingPost(false)
    }
  }

  async function handleLike(postId: string) {
    const res = await fetch('/api/comunidad/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    })

    if (res.ok) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                liked_by_user: !post.liked_by_user,
                likes: post.liked_by_user
                  ? post.likes - 1
                  : post.likes + 1,
              }
            : post
        )
      )
    }
  }

  async function handleReply(postId: string) {
    const texto = replyTexts[postId]?.trim()
    if (!texto) return

    const res = await fetch('/api/comunidad/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, contenido: texto }),
    })

    if (res.ok) {
      setReplyTexts((prev) => ({ ...prev, [postId]: '' }))
      setReplyOpen((prev) => ({ ...prev, [postId]: false }))
      router.refresh()
    }
  }

  return (
    <main className="glow-space glow-community min-h-screen bg-glow-cream pt-24 pb-16">
      <div className="max-w-[860px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glow-space-heading mb-10"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-glow-navy/50 mb-2">
            Espacio exclusivo para alumnas
          </p>

          <h1 className="font-display text-5xl text-glow-navy font-light">
            Comunidad
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-glow-navy/10 bg-white p-6 mb-8"
        >
          <p className="font-body text-xs tracking-[0.2em] uppercase text-glow-navy/50 mb-3">
            Hacé una pregunta
          </p>

          <textarea
            value={nuevoPost}
            onChange={(event) => setNuevoPost(event.target.value)}
            placeholder="¿Qué querés preguntar?"
            rows={3}
            className="w-full font-body text-sm text-glow-navy placeholder:text-glow-navy/65 resize-none outline-none border-b border-glow-navy/10 pb-3"
          />

          <div className="flex justify-end mt-3">
            <button
              onClick={handlePost}
              disabled={loadingPost || !nuevoPost.trim()}
              className="font-body text-xs tracking-[0.2em] uppercase bg-glow-navy text-white px-6 py-2.5 hover:bg-glow-navy/80 transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              <Send size={12} />
              Publicar
            </button>
          </div>
        </motion.div>

        {posts.length === 0 ? (
          <p className="font-display text-xl text-glow-navy/65 text-center py-12">
            Sé la primera en preguntar algo.
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="rounded-3xl border border-glow-navy/10 bg-white p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  {post.email === NINA_EMAIL ? (
                    <span className="font-body text-[12px] font-bold text-glow-navy">
                      Nina Amateis — Creadora
                    </span>
                  ) : (
                    <span className="font-body text-[11px] font-medium text-glow-navy">
                      {formatName(post.email)}
                    </span>
                  )}

                  <span className="font-body text-xs text-glow-navy/65 ml-auto">
                    {formatDate(post.created_at)}
                  </span>
                </div>

                <p className="font-body text-sm text-glow-navy/80 leading-relaxed mb-4">
                  {post.contenido}
                </p>

                <div className="flex items-center gap-4 pt-3 border-t border-glow-navy/5">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 font-body text-xs tracking-[0.1em] uppercase transition-colors ${
                      post.liked_by_user
                        ? 'text-rose-400'
                        : 'text-glow-navy/65 hover:text-rose-400'
                    }`}
                  >
                    <Heart
                      aria-label="Me gusta"
                      size={13}
                      fill={post.liked_by_user ? 'currentColor' : 'none'}
                    />
                    {post.likes > 0 && post.likes}
                  </button>

                  <button
                    onClick={() =>
                      setReplyOpen((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                    className="flex items-center gap-1.5 font-body text-xs tracking-[0.1em] uppercase text-glow-navy/65 hover:text-glow-navy transition-colors"
                  >
                    <MessageCircle size={13} />
                    Responder
                  </button>
                </div>

                {post.respuestas?.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-glow-blush/40 flex flex-col gap-3">
                    {post.respuestas.map((respuesta) => (
                      <div key={respuesta.id}>
                        <div className="flex items-center gap-2 mb-1">
                          {respuesta.email === NINA_EMAIL ? (
                            <span className="font-body text-[12px] font-bold text-glow-navy">
                              Nina Amateis — Creadora
                            </span>
                          ) : (
                            <span className="font-body text-[11px] font-medium text-glow-navy">
                              {formatName(respuesta.email)}
                            </span>
                          )}

                          <span className="font-body text-xs text-glow-navy/65 ml-auto">
                            {formatDate(respuesta.created_at)}
                          </span>
                        </div>

                        <p className="font-body text-sm text-glow-navy/70 leading-relaxed">
                          {respuesta.contenido}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {replyOpen[post.id] && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={replyTexts[post.id] || ''}
                      onChange={(event) =>
                        setReplyTexts((prev) => ({
                          ...prev,
                          [post.id]: event.target.value,
                        }))
                      }
                      onKeyDown={(event) =>
                        event.key === 'Enter' && handleReply(post.id)
                      }
                      placeholder="Tu respuesta..."
                      className="flex-1 font-body text-sm text-glow-navy placeholder:text-glow-navy/65 border-b border-glow-navy/20 outline-none pb-1 bg-transparent"
                    />

                    <button
                      onClick={() => handleReply(post.id)}
                      className="text-glow-navy/65 hover:text-glow-navy transition-colors"
                    >
                      <Send aria-label="Enviar respuesta" size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
