'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ResumeData } from '@/types/resume'
import { ResumeTemplate } from '@/components/templates'
import { Loader2, FileText, Share2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ResumeInfo {
  id: string
  title: string
  templateId: string
  content: string
  authorName?: string
}

export default function PreviewPage() {
  const { token } = useParams<{ token: string }>()
  const [resume, setResume] = useState<ResumeInfo | null>(null)
  const [data, setData] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/share/${token}`)
      .then((r) => r.json())
      .then((info) => {
        if (info.error) {
          setError(info.error)
        } else {
          setResume(info)
          try {
            setData(JSON.parse(info.content))
          } catch {}
        }
        setLoading(false)
      })
  }, [token])

  function share() {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
        <FileText className="w-12 h-12 text-gray-300" />
        <p className="text-gray-500">{error || '简历不存在'}</p>
        <Link href="/">
          <Button variant="outline">返回首页</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm">
              <FileText className="w-4 h-4" />
              ResumeAI
            </Link>
            <span className="text-gray-300">·</span>
            <span className="text-sm text-gray-600 font-medium">{resume?.title}</span>
            {resume?.authorName && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-sm text-gray-500">by {resume.authorName}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={share} className="gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              {copied ? '已复制链接' : '分享'}
            </Button>
            <Link href="/register">
              <Button size="sm" className="gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                免费制作我的简历
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="py-8 px-4">
        <div className="max-w-[210mm] mx-auto shadow-2xl rounded-sm overflow-hidden">
          <ResumeTemplate data={data} templateId={resume?.templateId || 'modern'} />
        </div>
      </div>

      {/* CTA banner */}
      <div className="bg-indigo-600 text-white py-6 mt-8">
        <div className="max-w-2xl mx-auto text-center px-4">
          <h3 className="text-lg font-bold mb-2">想要一份这样专业的简历？</h3>
          <p className="text-indigo-200 text-sm mb-4">免费注册 ResumeAI，5分钟制作 AI 驱动的精美简历</p>
          <Link href="/register">
            <Button variant="secondary" className="gap-2">
              <FileText className="w-4 h-4" />
              免费开始
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
