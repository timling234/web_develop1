'use client'

import { Inter, Noto_Sans_SC } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-sc',
})

function Navbar() {
  const { user } = useAuth()
  const pathname = usePathname()
  
  // 不在登录和注册页面显示导航栏
  if (pathname === '/login' || pathname === '/register') {
    return null
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800">AI 助手</span>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/chat" className="text-gray-700 hover:text-gray-900">
                  聊天
                </Link>
                <Link href="/history" className="text-gray-700 hover:text-gray-900">
                  历史记录
                </Link>
                <button
                  onClick={() => auth.signOut()}
                  className="text-gray-700 hover:text-gray-900"
                >
                  退出
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh" className={`${inter.variable} ${notoSansSC.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
