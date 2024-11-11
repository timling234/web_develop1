import { FC } from 'react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isLoading?: boolean
}

const ChatMessage: FC<ChatMessageProps> = ({ role, content, isLoading }) => {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-white shadow-sm border border-gray-200'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        ) : (
          <p className={role === 'assistant' ? 'text-gray-800' : ''}>{content}</p>
        )}
      </div>
    </div>
  )
}

export default ChatMessage 