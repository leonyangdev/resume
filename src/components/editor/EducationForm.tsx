'use client'

import { useState } from 'react'
import { Education } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'
import { nanoid } from 'nanoid'

interface Props {
  data: Education[]
  onChange: (data: Education[]) => void
}

export function EducationForm({ data, onChange }: Props) {
  const [expanded, setExpanded] = useState<string | null>(data[0]?.id || null)

  function add() {
    const id = nanoid()
    const newEdu: Education = {
      id,
      school: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
      honors: [],
    }
    onChange([newEdu, ...data])
    setExpanded(id)
  }

  function remove(id: string) {
    onChange(data.filter((e) => e.id !== id))
  }

  function update(id: string, patch: Partial<Education>) {
    onChange(data.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }

  return (
    <div className="space-y-3">
      <Button onClick={add} variant="outline" size="sm" className="w-full border-dashed gap-1">
        <Plus className="w-4 h-4" />
        添加教育经历
      </Button>

      {data.map((edu) => (
        <div key={edu.id} className="border border-gray-200 rounded-xl overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === edu.id ? null : edu.id)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{edu.school || '学校名称'}</p>
                <p className="text-xs text-gray-500 truncate">{[edu.degree, edu.major].filter(Boolean).join(' · ') || '学历 · 专业'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Button
                size="icon"
                variant="ghost"
                className="w-7 h-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                onClick={(e) => { e.stopPropagation(); remove(edu.id) }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              {expanded === edu.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </div>
          </div>

          {expanded === edu.id && (
            <div className="p-4 space-y-3">
              <Field label="学校名称">
                <Input placeholder="清华大学" value={edu.school} onChange={(e) => update(edu.id, { school: e.target.value })} />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="学历">
                  <select
                    className="flex h-9 w-full rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={edu.degree}
                    onChange={(e) => update(edu.id, { degree: e.target.value })}
                  >
                    <option value="">请选择</option>
                    {['博士', '硕士', '本科', '大专', '高中'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Field>
                <Field label="专业">
                  <Input placeholder="计算机科学" value={edu.major} onChange={(e) => update(edu.id, { major: e.target.value })} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="开始时间">
                  <Input type="month" value={edu.startDate} onChange={(e) => update(edu.id, { startDate: e.target.value })} />
                </Field>
                <Field label="结束时间">
                  <Input type="month" value={edu.endDate} onChange={(e) => update(edu.id, { endDate: e.target.value })} />
                </Field>
              </div>

              <Field label="GPA / 排名">
                <Input placeholder="3.8 / 4.0 或 前10%" value={edu.gpa || ''} onChange={(e) => update(edu.id, { gpa: e.target.value })} />
              </Field>
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
