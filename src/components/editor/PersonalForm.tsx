'use client'

import { PersonalInfo } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface Props {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
}

export function PersonalForm({ data, onChange }: Props) {
  const [optimizing, setOptimizing] = useState(false)

  function update(key: keyof PersonalInfo, value: string) {
    onChange({ ...data, [key]: value })
  }

  async function optimizeSummary() {
    if (!data.summary) return
    setOptimizing(true)
    try {
      const res = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'summary', content: data.summary }),
      })
      const json = await res.json()
      if (json.result) update('summary', json.result)
    } finally {
      setOptimizing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="姓名" required>
          <Input placeholder="张三" value={data.name} onChange={(e) => update('name', e.target.value)} />
        </Field>
        <Field label="求职意向">
          <Input placeholder="产品经理" value={data.title} onChange={(e) => update('title', e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="邮箱" required>
          <Input type="email" placeholder="you@example.com" value={data.email} onChange={(e) => update('email', e.target.value)} />
        </Field>
        <Field label="手机">
          <Input placeholder="138 0000 0000" value={data.phone} onChange={(e) => update('phone', e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="所在城市">
          <Input placeholder="北京" value={data.location} onChange={(e) => update('location', e.target.value)} />
        </Field>
        <Field label="个人网站">
          <Input placeholder="https://..." value={data.website || ''} onChange={(e) => update('website', e.target.value)} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="GitHub">
          <Input placeholder="github.com/username" value={data.github || ''} onChange={(e) => update('github', e.target.value)} />
        </Field>
        <Field label="LinkedIn">
          <Input placeholder="linkedin.com/in/..." value={data.linkedin || ''} onChange={(e) => update('linkedin', e.target.value)} />
        </Field>
      </div>

      <Field label="个人简介">
        <div className="relative">
          <Textarea
            placeholder="简洁有力地介绍自己的核心优势、经验年限和职业目标..."
            value={data.summary}
            onChange={(e) => update('summary', e.target.value)}
            rows={4}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="absolute bottom-2 right-2 h-7 text-xs gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            onClick={optimizeSummary}
            disabled={optimizing || !data.summary}
          >
            {optimizing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            AI 优化
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-1">建议 50-100 字，突出核心竞争力</p>
      </Field>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  )
}
