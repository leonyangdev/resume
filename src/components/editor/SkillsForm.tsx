'use client'

import { useState } from 'react'
import { Skill } from '@/types/resume'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import { nanoid } from 'nanoid'

interface Props {
  data: Skill[]
  onChange: (data: Skill[]) => void
}

const SUGGESTED_CATEGORIES = ['前端开发', '后端开发', '数据库', '工具与框架', '设计', '语言', '软技能', '行业知识']

export function SkillsForm({ data, onChange }: Props) {
  const [newSkill, setNewSkill] = useState('')
  const [newCategory, setNewCategory] = useState('前端开发')

  function add() {
    if (!newSkill.trim()) return
    onChange([
      ...data,
      { id: nanoid(), name: newSkill.trim(), level: 3, category: newCategory },
    ])
    setNewSkill('')
  }

  function remove(id: string) {
    onChange(data.filter((s) => s.id !== id))
  }

  function updateLevel(id: string, level: number) {
    onChange(data.map((s) => (s.id === id ? { ...s, level } : s)))
  }

  const byCategory = data.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category || '技能'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {/* Add skill */}
      <div className="flex gap-2">
        <select
          className="h-9 rounded-lg border border-gray-300 px-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-shrink-0"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        >
          {SUGGESTED_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <Input
          placeholder="添加技能（如：React、Python）"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          className="flex-1"
        />
        <Button onClick={add} size="icon" className="flex-shrink-0">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Skill list by category */}
      {Object.entries(byCategory).map(([cat, skills]) => (
        <div key={cat}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{cat}</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full"
              >
                <span className="text-sm text-indigo-700 font-medium">{skill.name}</span>
                <button
                  onClick={() => remove(skill.id)}
                  className="text-indigo-400 hover:text-indigo-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">还没有技能，请添加</p>
      )}
    </div>
  )
}
