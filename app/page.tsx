import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
          与AI对话，探索无限可能
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          体验下一代AI对话技术，获得智能、精准、自然的交互体验
        </p>
        <div>
          <Link 
            href="/chat"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-full text-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all transform hover:scale-105 hover:shadow-lg"
          >
            立即开始
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            无需登录即可开始对话，登录后可保存聊天记录
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">为什么选择我们？</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">实时响应</h3>
            <p className="text-gray-600 leading-relaxed">快速、流畅的对话体验，让您感受真实的交互。支持代码高亮和 Markdown 格式。</p>
          </div>
          
          <div className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">安全可靠</h3>
            <p className="text-gray-600 leading-relaxed">企业级安全保障，保护您的隐私和数据安全。支持访客模式和账户管理。</p>
          </div>
          
          <div className="p-8 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">历史记录</h3>
            <p className="text-gray-600 leading-relaxed">登录后自动保存所有对话，随时查看和继续之前的讨论。支持删除和管理。</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-4 py-16 text-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl my-8 mx-4">
        <h2 className="text-3xl font-bold mb-4">加入我们的学习社区</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          创建账户，解锁更多功能
        </p>
        <div className="flex justify-center space-x-4">
          <Link 
            href="/register"
            className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transition-all hover:shadow-lg"
          >
            免费注册
          </Link>
          <Link 
            href="/chat"
            className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full text-lg font-medium hover:bg-blue-50 transition-all"
          >
            继续体验
          </Link>
        </div>
      </section>
    </main>
  )
}
