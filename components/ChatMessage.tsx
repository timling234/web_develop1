import { FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isLoading?: boolean
}

interface CodeBlockProps {
  inline?: boolean
  className?: string
  children: React.ReactNode
}

interface ComponentProps {
  children?: React.ReactNode
  href?: string
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
          <div className={role === 'user' ? 'text-white' : 'prose dark:prose-invert max-w-none text-gray-900'}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                code: ({ inline, className, children }: CodeBlockProps) => {
                  return !inline ? (
                    <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 overflow-x-auto">
                      <code className={className}>
                        {children}
                      </code>
                    </pre>
                  ) : (
                    <code className="bg-gray-100 text-gray-800 px-1 rounded">
                      {children}
                    </code>
                  )
                },
                pre: ({ children }: ComponentProps) => {
                  return <div className="not-prose">{children}</div>
                },
                p: ({ children }: ComponentProps) => {
                  return <p className="mb-2 last:mb-0">{children}</p>
                },
                ul: ({ children }: ComponentProps) => {
                  return <ul className="list-disc list-inside mb-2">{children}</ul>
                },
                ol: ({ children }: ComponentProps) => {
                  return <ol className="list-decimal list-inside mb-2">{children}</ol>
                },
                li: ({ children }: ComponentProps) => {
                  return <li className="mb-1">{children}</li>
                },
                a: ({ href, children }: ComponentProps) => {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={role === 'user' ? 'underline' : 'text-blue-600 hover:underline'}
                    >
                      {children}
                    </a>
                  )
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage 