'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
import Link from 'next/link'

interface ChatSession {
  id: string
  title: string
  updatedAt: number
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: number
  }>
}

export default function HistoryPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchSessions = async () => {
    try {
      setError(null)
      const q = query(
        collection(db, 'chatSessions'),
        where('userId', '==', user?.uid),
        orderBy('updatedAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const sessionData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as ChatSession))
      
      setSessions(sessionData)
    } catch (error) {
      console.error('Error fetching sessions:', error)
      setError('加载聊天记录时出错，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchSessions()
  }, [user, router])

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.preventDefault() // 阻止链接跳转
    if (!user || deleting) return

    if (!confirm('确定要删除这个对话吗？此操作不可撤销。')) {
      return
    }

    setDeleting(sessionId)
    try {
      await deleteDoc(doc(db, 'chatSessions', sessionId))
      // 重新获取会话列表
      await fetchSessions()
    } catch (error) {
      console.error('Error deleting session:', error)
      setError('删除对话时出错，请稍后重试')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">聊天历史</h1>
          <Link
            href="/chat"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            新对话
          </Link>
        </div>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <Link
                href={`/chat/${session.id}`}
                className="block"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      {session.title || '新对话'}
                    </h2>
                    {session.messages && session.messages.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {session.messages[session.messages.length - 1].content}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(session.updatedAt).toLocaleString()}
                  </span>
                </div>
              </Link>
              <button
                onClick={(e) => handleDelete(session.id, e)}
                disabled={deleting === session.id}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              暂无聊天记录
              <div className="mt-2">
                <Link
                  href="/chat"
                  className="text-blue-600 hover:text-blue-700"
                >
                  开始第一次对话
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 