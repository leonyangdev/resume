'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  Share2,
  Eye,
  MoreVertical,
  LogOut,
  User,
  Loader2,
  TrendingUp,
  Copy,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface ResumeItem {
  id: string
  title: string
  templateId: string
  atsScore?: number
  isPublic: boolean
  shareToken?: string
  shareViews: number
  updatedAt: string
}

const templateNames: Record<string, string> = {
  modern: '现代简约',
  classic: '经典商务',
  minimal: '极简风格',
  tech: '技术极客',
  creative: '创意活力',
}

export default function DashboardPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<ResumeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/resumes')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setResumes(data)
        setLoading(false)
      })
  }, [])

  async function createResume() {
    setCreating(true)
    const res = await fetch('/api/resumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '我的简历' }),
    })
    const resume = await res.json()
    setCreating(false)
    router.push(`/editor/${resume.id}`)
  }

  async function deleteResume(id: string) {
    if (!confirm('确定删除这份简历吗？此操作不可恢复。')) return
    await fetch(`/api/resumes/${id}`, { method: 'DELETE' })
    setResumes((prev) => prev.filter((r) => r.id !== id))
    setOpenMenu(null)
  }

  function copyLink(token: string) {
    navigator.clipboard.writeText(`${window.location.origin}/preview/${token}`)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const totalViews = resumes.reduce((s, r) => s + r.shareViews, 0)
  const sharedCount = resumes.filter((r) => r.isPublic).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
            <FileText className="w-6 h-6" />
            ResumeAI
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="gap-1.5 text-gray-600" onClick={() => router.push('/profile')}>
              <User className="w-4 h-4" />
              个人资料
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-gray-600"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="w-4 h-4" />
              退出
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="简历数量" value={resumes.length} icon={<FileText className="w-5 h-5 text-indigo-600" />} />
          <StatCard label="总浏览次数" value={totalViews} icon={<Eye className="w-5 h-5 text-green-600" />} />
          <StatCard label="分享中" value={sharedCount} icon={<Share2 className="w-5 h-5 text-purple-600" />} />
        </div>

        {/* Title + Create */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">我的简历</h1>
          <Button onClick={createResume} disabled={creating} className="gap-2">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            新建简历
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : resumes.length === 0 ? (
          <EmptyState onCreate={createResume} creating={creating} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* New resume card */}
            <button
              onClick={createResume}
              disabled={creating}
              className="h-48 rounded-2xl border-2 border-dashed border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-indigo-600 group"
            >
              {creating ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
              )}
              <span className="text-sm font-medium">新建简历</span>
            </button>

            {resumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-md transition-shadow cursor-pointer relative group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900 truncate">{resume.title}</h3>
                        {resume.isPublic && (
                          <Badge variant="success" className="text-xs flex-shrink-0">分享中</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{templateNames[resume.templateId] || resume.templateId}</p>

                      <div className="flex gap-4 text-xs text-gray-500">
                        {resume.atsScore && (
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            ATS {resume.atsScore}分
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {resume.shareViews} 次浏览
                        </span>
                      </div>
                    </div>

                    {/* Menu */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === resume.id ? null : resume.id) }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                      {openMenu === resume.id && (
                        <div className="absolute right-0 top-9 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-10">
                          <MenuItem icon={<Edit3 className="w-3.5 h-3.5" />} label="编辑" onClick={() => router.push(`/editor/${resume.id}`)} />
                          {resume.shareToken && (
                            <>
                              <MenuItem
                                icon={copiedToken === resume.shareToken ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                label={copiedToken === resume.shareToken ? '已复制' : '复制链接'}
                                onClick={() => copyLink(resume.shareToken!)}
                              />
                              <a href={`/preview/${resume.shareToken}`} target="_blank" rel="noopener noreferrer">
                                <MenuItem icon={<Eye className="w-3.5 h-3.5" />} label="预览" onClick={() => {}} />
                              </a>
                            </>
                          )}
                          <div className="border-t border-gray-100 my-1" />
                          <MenuItem
                            icon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                            label="删除"
                            className="text-red-500"
                            onClick={() => deleteResume(resume.id)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true, locale: zhCN })}更新
                    </span>
                    <Button size="sm" className="h-7 text-xs" onClick={() => router.push(`/editor/${resume.id}`)}>
                      <Edit3 className="w-3 h-3 mr-1" />
                      编辑
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Close menu on outside click */}
      {openMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setOpenMenu(null)} />
      )}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center">{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <button
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${className || 'text-gray-700'}`}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      {icon}
      {label}
    </button>
  )
}

function EmptyState({ onCreate, creating }: { onCreate: () => void; creating: boolean }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-5">
        <FileText className="w-10 h-10 text-indigo-400" />
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">还没有简历</h2>
      <p className="text-gray-500 mb-6 text-sm">创建你的第一份 AI 驱动简历，3分钟搞定</p>
      <Button onClick={onCreate} disabled={creating} size="lg" className="gap-2">
        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        创建第一份简历
      </Button>
    </div>
  )
}
