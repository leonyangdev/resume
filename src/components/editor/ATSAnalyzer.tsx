'use client'

import { useState } from 'react'
import { ResumeData } from '@/types/resume'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Loader2, Target, CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'

interface ATSResult {
  score: number
  matched_keywords: string[]
  missing_keywords: string[]
  suggestions: string[]
  summary: string
}

interface Props {
  data: ResumeData
}

export function ATSAnalyzer({ data }: Props) {
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ATSResult | null>(null)
  const [expanded, setExpanded] = useState(false)

  async function analyze() {
    if (!jd.trim()) return
    setLoading(true)
    setResult(null)

    const resumeText = JSON.stringify({
      summary: data.personal.summary,
      experience: data.experience.map((e) => ({
        position: e.position,
        company: e.company,
        highlights: e.highlights,
      })),
      skills: data.skills.map((s) => s.name),
      projects: data.projects.map((p) => ({ name: p.name, description: p.description })),
    })

    try {
      const res = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'ats', content: resumeText, jobDescription: jd }),
      })
      const json = await res.json()
      setResult(json)
    } finally {
      setLoading(false)
    }
  }

  const scoreColor =
    result?.score !== undefined
      ? result.score >= 80
        ? 'text-green-600'
        : result.score >= 60
        ? 'text-yellow-600'
        : 'text-red-600'
      : ''

  const scoreBg =
    result?.score !== undefined
      ? result.score >= 80
        ? 'bg-green-50 border-green-200'
        : result.score >= 60
        ? 'bg-yellow-50 border-yellow-200'
        : 'bg-red-50 border-red-200'
      : ''

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl hover:border-indigo-200 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700">ATS 匹配度分析</span>
          <Badge variant="default" className="text-xs">AI 专属</Badge>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-indigo-400" />}
      </button>

      {expanded && (
        <div className="space-y-3 px-1">
          <Textarea
            placeholder="粘贴目标职位的JD（职位描述）...&#10;&#10;AI 将分析你的简历与职位的匹配度，找出缺失的关键词并给出优化建议"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={5}
          />
          <Button
            onClick={analyze}
            disabled={loading || !jd.trim()}
            className="w-full gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
            {loading ? '分析中...' : '开始 ATS 分析'}
          </Button>

          {result && (
            <div className="space-y-3">
              {/* Score */}
              <div className={`flex items-center justify-between p-4 rounded-xl border ${scoreBg}`}>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">匹配度评分</p>
                  <p className={`text-3xl font-black ${scoreColor}`}>{result.score}<span className="text-base font-normal"> / 100</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 max-w-40">{result.summary}</p>
                </div>
              </div>

              {/* Keywords */}
              <div className="grid grid-cols-2 gap-3">
                {result.matched_keywords.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      <p className="text-xs font-semibold text-green-700">已匹配关键词</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.matched_keywords.map((kw) => (
                        <Badge key={kw} variant="success" className="text-xs">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.missing_keywords.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                      <p className="text-xs font-semibold text-red-700">缺失关键词</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {result.missing_keywords.map((kw) => (
                        <Badge key={kw} variant="destructive" className="text-xs">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Suggestions */}
              {result.suggestions.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <p className="text-xs font-semibold text-amber-700">优化建议</p>
                  </div>
                  <ul className="space-y-1">
                    {result.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                        <span className="text-amber-400 mt-0.5 flex-shrink-0">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
