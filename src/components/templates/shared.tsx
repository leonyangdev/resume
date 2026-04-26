import { ResumeData } from '@/types/resume'
import { formatDate } from '@/lib/utils'

export function renderHighlights(highlights: string[]) {
  if (!highlights?.length) return null
  return (
    <ul className="mt-1 space-y-0.5">
      {highlights.filter(Boolean).map((h, i) => (
        <li key={i} className="flex items-start gap-1.5 text-sm">
          <span className="mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0 opacity-60" />
          <span>{h}</span>
        </li>
      ))}
    </ul>
  )
}

export function renderDescription(desc: string) {
  if (!desc) return null
  return <p className="text-sm mt-1 whitespace-pre-wrap leading-relaxed">{desc}</p>
}

export const proficiencyMap: Record<string, string> = {
  native: '母语',
  fluent: '流利',
  professional: '专业工作用语',
  conversational: '日常对话',
  basic: '基础',
}
