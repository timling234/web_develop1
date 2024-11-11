'use client'

import { useState, useRef, useEffect } from 'react'
import type { NextPage } from 'next'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const ChatPage: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const newUserMessage: Message = { 
      role: 'user', 
      content: message 
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
        content: data.message
      }
      setMessages([...newMessages, assistantMessage])
    } catch (error: any) {
      console.error('Chat error:', error.message)
      const errorMessage: Message = {
        role: 'assistant',
        content: `抱歉，发生了一个错误：${error.message}`
      }
      setMessages([...newMessages, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-800">AI 助手</h1>
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