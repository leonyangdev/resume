'use client'

import { useState } from 'react'
import { WorkExperience } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ChevronDown, ChevronUp, Sparkles, Loader2, GripVertical } from 'lucide-react'
import { nanoid } from 'nanoid'

interface Props {
  data: WorkExperience[]
  onChange: (data: WorkExperience[]) => void
}

export function ExperienceForm({ data, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(data[0]?.id || null)
  const [optimizing, setOptimizing] = useState<string | null>(null)

  function add() {
    const id = nanoid()
    const newExp: WorkExperience = {
      id,
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      highlights: [''],
    }
    onChange([newExp, ...data])
    setExpanded(id)
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id))
  }

  function update(id: string, patch: Partial<WorkExperience>) {
    onChange(data.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  function updateHighlight(expId: string, idx: number, value: string) {
    const exp = data.find((e) => e.id === expId)!
    const highlights = [...exp.highlights]
    highlights[idx] = value
    update(expId, { highlights })
  }

  function addHighlight(expId: string) {
    const exp = data.find((e) => e.id === expId)!
    update(expId, { highlights: [...exp.highlights, ''] })
  }

  function removeHighlight(expId: string, idx: number) {
    const exp = data.find((e) => e.id === expId)!
    update(expId, { highlights: exp.highlights.filter((_, i) => i !== idx) })
  }

  async function optimizeHighlights(expId: string) {
    const exp = data.find((e) => e.id === expId)!
    const content = exp.highlights.filter(Boolean).join('\n')
    if (!content) return

    setOptimizing(expId)
    try {
      const res = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bullet', content }),
      })
      const json = await res.json()
      if (json.result) {
        const optimized = json.result.split('\n').filter(Boolean)
        update(expId, { highlights: optimized })
      }
    } finally {
      setOptimizing(null)
    }
  }

  return (
    <div className="space-y-3">
      <Button onClick={add} variant="outline" size="sm" className="w-full border-dashed gap-1">
        <Plus className="w-4 h-4" />
        添加工作经历
      </Button>

      {data.map((exp) => (
        <div key={exp.id} className="border border-gray-200 rounded-xl overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {exp.position || '职位名称'}
                </p>
                <p className="text-xs text-gray-500 truncate">{exp.company || '公司名称'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Button
                size="icon"
                variant="ghost"
                className="w-7 h-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => { e.stopPropagation(); remove(exp.id) }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              {expanded === exp.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </div>

          {expanded === exp.id && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="公司名称">
                  <Input placeholder="字节跳动" value={exp.company} onChange={(e) => update(exp.id, { company: e.target.value })} />
                </Field>
                <Field label="职位名称">
                  <Input placeholder="高级产品经理" value={exp.position} onChange={(e) => update(exp.id, { position: e.target.value })} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="开始时间">
                  <Input type="month" value={exp.startDate} onChange={(e) => update(exp.id, { startDate: e.target.value })} />
                </Field>
                <Field label="结束时间">
                  <div className="space-y-1.5">
                    <Input
                      type="month"
                      value={exp.endDate}
                      disabled={exp.isCurrent}
                      onChange={(e) => update(exp.id, { endDate: e.target.value })}
                    />
                    <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.isCurrent}
                        onChange={(e) => update(exp.id, { isCurrent: e.target.checked, endDate: '' })}
                        className="rounded"
                      />
                      在职中
                    </label>
                  </div>
                </Field>
              </div>

              <Field label="工作地点">
                <Input placeholder="北京" value={exp.location || ''} onChange={(e) => update(exp.id, { location: e.target.value })} />
              </Field>

              <Field label="工作描述">
                <Textarea
                  placeholder="简要描述岗位职责..."
                  value={exp.description}
                  onChange={(e) => update(exp.id, { description: e.target.value })}
                  rows={2}
                />
              </Field>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>主要成就（量化成果更有力）</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    onClick={() => optimizeHighlights(exp.id)}
                    disabled={optimizing === exp.id}
                  >
                    {optimizing === exp.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI 优化
                  </Button>
                </div>
                <div className="space-y-2">
                  {exp.highlights.map((h, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        placeholder={`成就 ${idx + 1}（如：主导XX项目，使XX提升30%）`}
                        value={h}
                        onChange={(e) => updateHighlight(exp.id, idx, e.target.value)}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-9 h-9 flex-shrink-0 text-gray-400 hover:text-red-500"
                        onClick={() => removeHighlight(exp.id, idx)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="ghost" className="text-xs text-gray-500 gap-1" onClick={() => addHighlight(exp.id)}>
                    <Plus className="w-3.5 h-3.5" />
                    添加成就
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
