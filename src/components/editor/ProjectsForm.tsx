'use client'

import { useState } from 'react'
import { Project } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, X, Sparkles, Loader2 } from 'lucide-react'
import { nanoid } from 'nanoid'

interface Props {
  data: Project[]
  onChange: (data: Project[]) => void
}

export function ProjectsForm({ data, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(data[0]?.id || null)
  const [optimizing, setOptimizing] = useState<string | null>(null)
  const [newTech, setNewTech] = useState<Record<string, string>>({})

  function add() {
    const id = nanoid()
    onChange([{ id, name: '', role: '', startDate: '', endDate: '', url: '', description: '', highlights: [''], technologies: [] }, ...data])
    setExpanded(id)
  }

  function remove(id: string) {
    onChange(data.filter((p) => p.id !== id))
  }

  function update(id: string, patch: Partial<Project>) {
    onChange(data.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  function addTech(projId: string) {
    const tech = newTech[projId]?.trim()
    if (!tech) return
    const proj = data.find((p) => p.id === projId)!
    if (!proj.technologies.includes(tech)) {
      update(projId, { technologies: [...proj.technologies, tech] })
    }
    setNewTech((prev) => ({ ...prev, [projId]: '' }))
  }

  function removeTech(projId: string, tech: string) {
    const proj = data.find((p) => p.id === projId)!
    update(projId, { technologies: proj.technologies.filter((t) => t !== tech) })
  }

  function updateHighlight(projId: string, idx: number, value: string) {
    const proj = data.find((p) => p.id === projId)!
    const highlights = [...proj.highlights]
    highlights[idx] = value
    update(projId, { highlights })
  }

  async function optimizeHighlights(projId: string) {
    const proj = data.find((p) => p.id === projId)!
    const content = proj.highlights.filter(Boolean).join('\n')
    if (!content) return
    setOptimizing(projId)
    try {
      const res = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bullet', content }),
      })
      const json = await res.json()
      if (json.result) update(projId, { highlights: json.result.split('\n').filter(Boolean) })
    } finally {
      setOptimizing(null)
    }
  }

  return (
    <div className="space-y-3">
      <Button onClick={add} variant="outline" size="sm" className="w-full border-dashed gap-1">
        <Plus className="w-4 h-4" />
        添加项目经历
      </Button>

      {data.map((proj) => (
        <div key={proj.id} className="border border-gray-200 rounded-xl overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === proj.id ? null : proj.id)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-800 truncate">{proj.name || '项目名称'}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Button size="icon" variant="ghost" className="w-7 h-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => { e.stopPropagation(); remove(proj.id) }}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              {expanded === proj.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </div>

          {expanded === proj.id && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>项目名称</Label>
                  <Input placeholder="用户增长平台" value={proj.name} onChange={(e) => update(proj.id, { name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>担任角色</Label>
                  <Input placeholder="前端负责人" value={proj.role || ''} onChange={(e) => update(proj.id, { role: e.target.value })} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>项目链接</Label>
                <Input placeholder="https://..." value={proj.url || ''} onChange={(e) => update(proj.id, { url: e.target.value })} />
              </div>

              <div className="space-y-1.5">
                <Label>项目描述</Label>
                <Textarea placeholder="简要描述项目背景和目标..." value={proj.description}
                  onChange={(e) => update(proj.id, { description: e.target.value })} rows={2} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>项目亮点</Label>
                  <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    onClick={() => optimizeHighlights(proj.id)} disabled={optimizing === proj.id}>
                    {optimizing === proj.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI 优化
                  </Button>
                </div>
                {proj.highlights.map((h, idx) => (
                  <div key={idx} className="flex gap-2 mb-2">
                    <Input placeholder={`亮点 ${idx + 1}`} value={h}
                      onChange={(e) => updateHighlight(proj.id, idx, e.target.value)} />
                    <Button size="icon" variant="ghost" className="w-9 h-9 flex-shrink-0 text-gray-400 hover:text-red-500"
                      onClick={() => update(proj.id, { highlights: proj.highlights.filter((_, i) => i !== idx) })}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="ghost" className="text-xs text-gray-500 gap-1"
                  onClick={() => update(proj.id, { highlights: [...proj.highlights, ''] })}>
                  <Plus className="w-3.5 h-3.5" />添加亮点
                </Button>
              </div>

              <div>
                <Label className="block mb-2">技术栈</Label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {proj.technologies.map((t) => (
                    <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                      {t}
                      <button onClick={() => removeTech(proj.id, t)} className="text-gray-400 hover:text-gray-700">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input placeholder="React" value={newTech[proj.id] || ''} className="text-xs h-8"
                    onChange={(e) => setNewTech((prev) => ({ ...prev, [proj.id]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && addTech(proj.id)} />
                  <Button size="sm" className="h-8" onClick={() => addTech(proj.id)}>
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
