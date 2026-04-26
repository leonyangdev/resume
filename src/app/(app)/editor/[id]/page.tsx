'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ResumeData, defaultResumeData, TEMPLATE_LIST } from '@/types/resume'
import { ResumePreview } from '@/components/editor/ResumePreview'
import { PersonalForm } from '@/components/editor/PersonalForm'
import { ExperienceForm } from '@/components/editor/ExperienceForm'
import { EducationForm } from '@/components/editor/EducationForm'
import { SkillsForm } from '@/components/editor/SkillsForm'
import { ProjectsForm } from '@/components/editor/ProjectsForm'
import { ATSAnalyzer } from '@/components/editor/ATSAnalyzer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Save,
  Download,
  Share2,
  Layout,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  FolderOpen,
  Loader2,
  CheckCircle2,
  Copy,
  Eye,
} from 'lucide-react'

type Tab = 'personal' | 'experience' | 'education' | 'skills' | 'projects'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'personal', label: '个人信息', icon: <User className="w-4 h-4" /> },
  { id: 'experience', label: '工作经历', icon: <Briefcase className="w-4 h-4" /> },
  { id: 'education', label: '教育经历', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'skills', label: '技能专长', icon: <Code2 className="w-4 h-4" /> },
  { id: 'projects', label: '项目经历', icon: <FolderOpen className="w-4 h-4" /> },
]

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [data, setData] = useState<ResumeData>(defaultResumeData)
  const [title, setTitle] = useState('我的简历')
  const [templateId, setTemplateId] = useState('modern')
  const [activeTab, setActiveTab] = useState<Tab>('personal')
  const [showTemplates, setShowTemplates] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [sharing, setSharing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  const saveTimer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    fetch(`/api/resumes/${id}`)
      .then((r) => r.json())
      .then((resume) => {
        if (resume.content) {
          try {
            setData(JSON.parse(resume.content))
          } catch {}
        }
        setTitle(resume.title || '我的简历')
        setTemplateId(resume.templateId || 'modern')
        setShareToken(resume.shareToken || null)
        setLoading(false)
      })
      .catch(() => router.push('/dashboard'))
  }, [id, router])

  const autoSave = useCallback(
    (newData: ResumeData, newTemplateId: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        setSaving(true)
        await fetch(`/api/resumes/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: JSON.stringify(newData), templateId: newTemplateId }),
        })
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }, 1200)
    },
    [id]
  )

  function updateData(newData: ResumeData) {
    setData(newData)
    autoSave(newData, templateId)
  }

  function selectTemplate(tid: string) {
    setTemplateId(tid)
    setShowTemplates(false)
    autoSave(data, tid)
  }

  async function exportPDF() {
    setExporting(true)
    const { default: html2canvas } = await import('html2canvas')
    const { default: jsPDF } = await import('jspdf')
    try {
      // Render at full scale
      const element = document.getElementById('resume-preview-full')
      if (!element) return
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false })
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = (canvas.height * pdfW) / canvas.width
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfW, pdfH)
      pdf.save(`${title || '简历'}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  async function toggleShare() {
    setSharing(true)
    if (shareToken) {
      await fetch(`/api/resumes/${id}/share`, { method: 'DELETE' })
      setShareToken(null)
    } else {
      const res = await fetch(`/api/resumes/${id}/share`, { method: 'POST' })
      const json = await res.json()
      setShareToken(json.shareToken)
    }
    setSharing(false)
  }

  function copyShareLink() {
    if (!shareToken) return
    navigator.clipboard.writeText(`${window.location.origin}/preview/${shareToken}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14 flex-shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => fetch(`/api/resumes/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title }) })}
            className="text-sm font-semibold text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded px-1 py-0.5 w-40"
          />
          <div className="flex items-center gap-1 text-xs">
            {saving && <><Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" /><span className="text-gray-400">保存中</span></>}
            {saved && <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-green-600">已保存</span></>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Share */}
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={toggleShare} disabled={sharing} className="gap-1.5">
              {sharing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5" />}
              {shareToken ? '关闭分享' : '分享简历'}
            </Button>
            {shareToken && (
              <>
                <Button variant="outline" size="sm" onClick={copyShareLink} className="gap-1.5">
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? '已复制' : '复制链接'}
                </Button>
                <a href={`/preview/${shareToken}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Eye className="w-4 h-4" />
                  </Button>
                </a>
              </>
            )}
          </div>

          {/* Template picker */}
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setShowTemplates(!showTemplates)} className="gap-1.5">
              <Layout className="w-3.5 h-3.5" />
              模板
            </Button>
            {showTemplates && (
              <div className="absolute right-0 top-10 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-50">
                <p className="text-xs font-semibold text-gray-500 mb-2 px-1">选择模板</p>
                <div className="space-y-1">
                  {TEMPLATE_LIST.map((t) => (
                    <button
                      key={t.id}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                        templateId === t.id
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                      onClick={() => selectTemplate(t.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-800">{t.name}</span>
                        {t.tag && <Badge variant="default" className="text-xs">{t.tag}</Badge>}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button size="sm" onClick={exportPDF} disabled={exporting} className="gap-1.5">
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            导出 PDF
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: form */}
        <div className="w-96 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'personal' && (
              <>
                <PersonalForm data={data.personal} onChange={(personal) => updateData({ ...data, personal })} />
                <ATSAnalyzer data={data} />
              </>
            )}
            {activeTab === 'experience' && (
              <ExperienceForm data={data.experience} onChange={(experience) => updateData({ ...data, experience })} />
            )}
            {activeTab === 'education' && (
              <EducationForm data={data.education} onChange={(education) => updateData({ ...data, education })} />
            )}
            {activeTab === 'skills' && (
              <SkillsForm data={data.skills} onChange={(skills) => updateData({ ...data, skills })} />
            )}
            {activeTab === 'projects' && (
              <ProjectsForm data={data.projects} onChange={(projects) => updateData({ ...data, projects })} />
            )}
          </div>
        </div>

        {/* Right panel: preview */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          <div className="max-w-3xl mx-auto">
            <ResumePreview data={data} templateId={templateId} scale={0.7} />
          </div>
        </div>
      </div>

      {/* Hidden full-scale for export */}
      <div className="fixed left-[-9999px] top-0 overflow-hidden">
        <div id="resume-preview-full">
          <ResumePreview data={data} templateId={templateId} scale={1} />
        </div>
      </div>
    </div>
  )
}
