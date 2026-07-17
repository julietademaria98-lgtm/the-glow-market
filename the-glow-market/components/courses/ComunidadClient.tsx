'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'

const NINA_EMAIL = 'ninaamateis@gmail.com'

function getDisplayName(user: any, email: string) {
  if (email === NINA_EMAIL) return 'Nina Amateis'
  return user?.user_metadata?.nombre || email?.split('@')[0] || 'Alumna'
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function ComunidadClient({ posts: initialPosts, currentUserId, currentUserEmail }: {
  posts: any[]
  currentUserId: string
  currentUserEmail: string
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [newPost, setNewPost] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const router = useRouter()

  const handlePost = async () => {
    if (!newPost.trim() || submitting) return
    setSubmitting(true)
    const res = await fetch('/api/comunidad/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido: newPost }),
    })
    if (res.ok) {
      setNewPost('')
      router.refresh()
    }
    setSubmitting(false)
  }

  const handleReply = async (postId: string) => {
    if (!replyContent.trim()) return
    const res = await fetch('/api/comunidad/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, contenido: replyContent }),
    })
    if (res.ok) {
      setReplyContent('')
      setReplyingTo(null)
      router.refresh()
    }
  }

  const handleLike = async (postId: string) => {
    await fetch('/api/comunidad/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId }),
    })
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-glow-cream pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-6">

        {/* Header */}
        <div className="mb-10">
          <p className="font-montserrat text-[10px] tracking-[0.3em] uppercase text-glow-navy/40 mb-2">
            Espacio exclusivo para alumnas
          </p>
          <h1 className="font-cormorant text-5xl text-glow-navy font-light">
            Comunidad
          </h1>
        </div>

        {/* Nueva pregunta */}
        <div className="bg-white border border-glow-navy/10 p-6 mb-8">
          <p className="font-montserrat text-[10px] tracking-[0.2em] uppercase text-glow-navy/40 mb-3">
            Hacé una pregunta
          </p>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="¿Qué querés preguntar?"
            rows={3}
            className="w-full font-montserrat text-sm text-glow-navy placeholder:text-glow-navy/30 border-b border-glow-navy/20 focus:outline-none focus:border-glow-navy resize-none pb-2 bg-transparent"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handlePost}
              disabled={submitting || !newPost.trim()}
              className="flex items-center gap-2 font-montserrat text-[10px] tracking-[0.2em] uppercase bg-glow-navy text-white px-5 py-2.5 hover:bg-glow-navy/80 disabled:opacity-40 transition-colors"
            >
              <Send size={11} />
              {submitting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.length === 0 && (
            <p className="font-montserrat text-sm text-glow-navy/40 text-center py-12">
              Sé la primera en preguntar algo.
            </p>
          )}
          {posts.map((post, i) => {
            const isNina = post.user?.email === NINA_EMAIL
            const displayName = getDisplayName(post.user, post.user?.email)
            const userLiked = (post.likes || []).some((l: any) => l.user_id === currentUserId)
            const likeCount = (post.likes || []).length

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-glow-navy/10 p-6"
              >
                {/* Autor */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-montserrat text-[10px] font-medium ${isNina ? 'bg-glow-blush text-white' : 'bg-glow-navy/10 text-glow-navy'}`}>
                    {getInitials(displayName)}
                  </div>
                  <div>
                    <p className={`font-montserrat text-xs font-medium ${isNina ? 'text-glow-blush' : 'text-glow-navy'}`}>
                      {displayName}
                      {isNina && <span className="ml-2 text-[9px] tracking-widest uppercase bg-glow-blush/10 px-2 py-0.5 rounded-full">Profesora</span>}
                    </p>
                    <p className="font-montserrat text-[9px] text-glow-navy/30">
                      {new Date(post.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                </div>

                {/* Contenido */}
                <p className="font-montserrat text-sm text-glow-navy/80 leading-relaxed mb-4">
                  {post.contenido}
                </p>

                {/* Acciones */}
                <div className="flex items-center gap-4 border-t border-glow-navy/10 pt-3">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 font-montserrat text-[10px] transition-colors ${userLiked ? 'text-glow-blush' : 'text-glow-navy/40 hover:text-glow-blush'}`}
                  >
                    <Heart size={13} fill={userLiked ? 'currentColor' : 'none'} />
                    {likeCount > 0 && likeCount}
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 font-montserrat text-[10px] text-glow-navy/40 hover:text-glow-navy transition-colors"
                  >
                    <MessageCircle size={13} />
                    {post.replies?.length > 0 ? `${post.replies.length} respuestas` : 'Responder'}
                  </button>
                </div>

                {/* Replies */}
                {post.replies?.length > 0 && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-glow-blush/20">
                    {post.replies.map((reply: any) => {
                      const replyIsNina = reply.user?.email === NINA_EMAIL
                      const replyName = getDisplayName(reply.user, reply.user?.email)
                      return (
                        <div key={reply.id}>
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-montserrat text-[9px] font-medium ${replyIsNina ? 'bg-glow-blush text-white' : 'bg-glow-navy/10 text-glow-navy'}`}>
                              {getInitials(replyName)}
                            </div>
                            <p className={`font-montserrat text-[10px] font-medium ${replyIsNina ? 'text-glow-blush' : 'text-glow-navy'}`}>
                              {replyName}
                              {replyIsNina && <span className="ml-2 text-[9px] tracking-widest uppercase bg-glow-blush/10 px-1.5 py-0.5 rounded-full">Profesora</span>}
                            </p>
                          </div>
                          <p className="font-montserrat text-xs text-glow-navy/70 leading-relaxed pl-8">
                            {reply.contenido}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Reply input */}
                {replyingTo === post.id && (
                  <div className="mt-4 flex gap-2">
                    <input
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Tu respuesta..."
                      className="flex-1 font-montserrat text-xs text-glow-navy placeholder:text-glow-navy/30 border-b border-glow-navy/20 focus:outline-none focus:border-glow-navy bg-transparent pb-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleReply(post.id)}
                    />
                    <button
                      onClick={() => handleReply(post.id)}
                      className="font-montserrat text-[9px] tracking-widest uppercase text-glow-navy hover:text-glow-blush transition-colors"
                    >
                      Enviar
                    </button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
