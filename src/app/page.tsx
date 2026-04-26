import Link from 'next/link'
import {
  FileText,
  Sparkles,
  Target,
  Share2,
  Download,
  BarChart2,
  Zap,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <FileText className="w-6 h-6" />
            ResumeAI
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">登录</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">免费开始</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-white py-24 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.1),rgba(255,255,255,0))]" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-full text-indigo-700 text-sm font-medium mb-8 border border-indigo-100">
            <Sparkles className="w-4 h-4" />
            AI 驱动 · 5分钟搞定专业简历
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
            让 AI 帮你写出
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              拿到 Offer 的简历
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            ATS 关键词匹配 · AI 内容优化 · 5套精美模板 · 实时预览 · 一键分享
            <br />
            比超级简历更智能，比 Canva 更 ATS 友好
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-indigo-200">
                <Zap className="w-5 h-5" />
                免费制作简历
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-12">
                已有账号？登录
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-4">无需信用卡 · 永久免费基础版</p>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">为什么选择 ResumeAI？</h2>
          <p className="text-gray-500 text-center mb-12">解决竞品的核心痛点，专为中国求职者打造</p>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Target className="w-6 h-6 text-indigo-600" />}
              title="ATS 智能评分"
              description="粘贴 JD，AI 自动分析简历与职位匹配度，找出缺失关键词并给出优化建议。超级简历没有，这是我们的核心差异。"
              tag="独家功能"
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-purple-600" />}
              title="AI 内容优化"
              description="将平淡的工作描述一键优化为量化的、有力的 STAR 法则表述，如「提升30%用户留存」，让简历更有说服力。"
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6 text-green-600" />}
              title="分享 & 访问分析"
              description="一键生成分享链接，实时查看谁在何时浏览了你的简历。在 HR 查阅后及时跟进，提升求职成功率。"
              tag="独家功能"
            />
            <FeatureCard
              icon={<FileText className="w-6 h-6 text-orange-600" />}
              title="5套精美模板"
              description="现代简约、经典商务、极简风格、技术极客、创意活力。每套均为 ATS 友好设计，不因华而不实牺牲机器可读性。"
            />
            <FeatureCard
              icon={<BarChart2 className="w-6 h-6 text-blue-600" />}
              title="多版本历史"
              description="同一份简历可针对不同职位快速定制，系统自动保存历史版本，随时可以回滚，再也不怕改错。"
            />
            <FeatureCard
              icon={<Download className="w-6 h-6 text-red-600" />}
              title="高质量 PDF 导出"
              description="一键导出像素级完美的 PDF 简历，完全还原预览效果，无需担心格式错乱问题。"
            />
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">与竞品对比</h2>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-5 font-semibold text-gray-500 w-44">功能</th>
                  <th className="text-center py-3 px-4 font-bold text-indigo-600 bg-indigo-50">ResumeAI</th>
                  <th className="text-center py-3 px-4 text-gray-400">超级简历</th>
                  <th className="text-center py-3 px-4 text-gray-400">Canva</th>
                  <th className="text-center py-3 px-4 text-gray-400">五百丁</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['ATS 关键词评分', true, false, false, false],
                  ['AI 内容优化', true, '基础', '无', false],
                  ['访问统计分析', true, false, false, false],
                  ['多版本历史', true, true, false, false],
                  ['免费无水印', true, '收费', '免费', '收费'],
                  ['ATS 友好模板', true, true, false, true],
                  ['实时预览编辑', true, true, true, true],
                ].map(([feature, ...vals], i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                    <td className="py-3.5 px-5 text-gray-700 font-medium">{feature}</td>
                    {vals.map((v, j) => (
                      <td key={j} className={`text-center py-3.5 px-4 ${j === 0 ? 'bg-indigo-50/50' : ''}`}>
                        {v === true ? (
                          <CheckCircle2 className={`w-5 h-5 mx-auto ${j === 0 ? 'text-indigo-600' : 'text-green-500'}`} />
                        ) : v === false ? (
                          <span className="text-gray-300 text-lg">—</span>
                        ) : (
                          <span className={`text-xs ${j === 0 ? 'text-indigo-600 font-semibold' : 'text-gray-400'}`}>{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">现在开始，5分钟制作你的 AI 简历</h2>
          <p className="text-indigo-200 mb-8">加入数千名求职者，用更智能的简历赢得面试机会</p>
          <Link href="/register">
            <Button variant="secondary" size="lg" className="gap-2 px-8 h-12 text-base">
              <Zap className="w-5 h-5" />
              免费开始制作
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FileText className="w-4 h-4" />
            ResumeAI © 2025
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  tag,
}: {
  icon: React.ReactNode
  title: string
  description: string
  tag?: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">{icon}</div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {tag && (
              <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full font-medium border border-indigo-100">
                {tag}
              </span>
            )}
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
