'use client'

import { useState, useRef, useEffect } from 'react'
import type { NextPage } from 'next'
import { useAuth } from '@/contexts/AuthContext'
import { db } from '@/lib/firebase'
import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface APIError {
  message: string
}

const ChatPage: NextPage = () => {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 修改加载历史对话的逻辑
  useEffect(() => {
    // 移除强制登录检查
    // 如果URL中有会话ID，且用户已登录，则加载该会话
    const sessionId = params?.id as string
    if (sessionId && user) {
      loadSession(sessionId)
    }
  }, [user, router, params])

  // 加载指定的会话
  const loadSession = async (sessionId: string) => {
    try {
      const sessionRef = doc(db, 'chatSessions', sessionId)
      const sessionSnap = await getDoc(sessionRef)
      
      if (sessionSnap.exists()) {
        const sessionData = sessionSnap.data()
        // 确保这个会话属于当前用户
        if (sessionData.userId === user?.uid) {
          setMessages(sessionData.messages || [])
          setCurrentSession(sessionId)
        } else {
          console.error('Unauthorized access to session')
          router.push('/chat')
        }
      } else {
        console.error('Session not found')
        router.push('/chat')
      }
    } catch (error) {
      console.error('Error loading session:', error)
      router.push('/chat')
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 创建新的聊天会话
  const createNewSession = async () => {
    if (!user) return null

    try {
      const docRef = await addDoc(collection(db, 'chatSessions'), {
        userId: user.uid,
        title: '新对话',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating new session:', error)
      return null
    }
  }

  // 更新聊天会话
  const updateSession = async (sessionId: string, newMessages: Message[]) => {
    if (!user) return

    try {
      const sessionRef = doc(db, 'chatSessions', sessionId)
      await updateDoc(sessionRef, {
        messages: newMessages,
        updatedAt: Date.now(),
        // 使用第一条用户消息作为标题
        title: newMessages.find(m => m.role === 'user')?.content.slice(0, 50) || '新对话'
      })
    } catch (error) {
      console.error('Error updating session:', error)
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    // 如果用户已登录且没有当前会话，创建一个新的
    if (user && !currentSession) {
      const sessionId = await createNewSession()
      if (sessionId) {
        setCurrentSession(sessionId)
      }
    }

    const newUserMessage: Message = { 
      role: 'user', 
      content: message,
      timestamp: Date.now()
    }
    const newMessages = [...messages, newUserMessage]
    setMessages(newMessages)
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'API request failed')
      }

      if (!data.message) {
        throw new Error('Invalid response format from API')
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: Date.now()
      }
      const updatedMessages = [...newMessages, assistantMessage]
      setMessages(updatedMessages)

      // 只有在用户登录且有当前会话时才保存到 Firestore
      if (user && currentSession) {
        await updateSession(currentSession, updatedMessages)
      }
    } catch (error: unknown) {
      const apiError = error as APIError
      console.error('Chat error:', apiError.message)
      const errorMessage: Message = {
        role: 'assistant',
        content: `抱歉，发生了一个错误：${apiError.message}`,
        timestamp: Date.now()
      }
      setMessages([...newMessages, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link 
            href="/"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">AI 助手</h1>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href="/history"
                className="text-gray-600 hover:text-gray-900"
              >
                历史记录
              </Link>
              <button
                onClick={async () => {
                  const sessionId = await createNewSession()
                  if (sessionId) {
                    setCurrentSession(sessionId)
                    setMessages([])
                    router.push(`/chat/${sessionId}`)
                  }
                }}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
              >
                新对话
              </button>
            </>
          ) : (
            <div className="text-sm text-gray-500">
              登录后可保存聊天记录
            </div>
          )}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
          {loading && (
            <ChatMessage
              role="assistant"
              content="正在思考..."
              isLoading={true}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat input */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={loading} />
        </div>
      </div>
    </div>
  )
}

export default ChatPage 