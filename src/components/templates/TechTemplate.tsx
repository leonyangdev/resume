import { ResumeData } from '@/types/resume'
import { formatDate } from '@/lib/utils'
import { proficiencyMap, renderHighlights } from './shared'

interface Props {
  data: ResumeData
  scale?: number
}

export function TechTemplate({ data, scale = 1 }: Props) {
  const { personal, experience, education, skills, projects, certificates, languages, sections } = data
  const sorted = [...sections].filter((s) => s.visible).sort((a, b) => a.order - b.order)

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || '技能'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <div
      className="bg-gray-950 text-gray-100 font-mono"
      style={{ width: '210mm', minHeight: '297mm', fontSize: `${13 * scale}px`, padding: '10mm 12mm' }}
    >
      {/* Header */}
      <div className="border border-green-500/30 rounded-lg p-5 mb-5 bg-gray-900/50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-green-400 text-xs mb-1">$ whoami</div>
            <h1 className="text-2xl font-bold text-white">{personal.name || 'your_name'}</h1>
            <p className="text-green-400 text-sm mt-0.5">{personal.title || 'Software Engineer'}</p>
          </div>
          <div className="text-xs text-gray-500 text-right space-y-0.5">
            {personal.email && <div className="text-gray-300">✉ {personal.email}</div>}
            {personal.phone && <div className="text-gray-300">✆ {personal.phone}</div>}
            {personal.location && <div className="text-gray-300">⌖ {personal.location}</div>}
            {personal.github && <div className="text-green-400">⌥ {personal.github}</div>}
            {personal.website && <div className="text-green-400">⊕ {personal.website}</div>}
          </div>
        </div>
        {personal.summary && (
          <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-400 leading-relaxed">
            <span className="text-green-400">// </span>
            {personal.summary}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Left column: Skills */}
        <div className="space-y-4">
          {sorted.find((s) => s.type === 'skills') && skills.length > 0 && (
            <TechSection title="tech_stack">
              {Object.entries(skillsByCategory).map(([cat, items]) => (
                <div key={cat} className="mb-3">
                  <div className="text-green-400 text-xs mb-1.5">{'>'} {cat}</div>
                  <div className="flex flex-wrap gap-1">
                    {items.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-1.5 py-0.5 bg-green-500/10 text-green-300 border border-green-500/20 text-xs rounded"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </TechSection>
          )}

          {sorted.find((s) => s.type === 'education') && education.length > 0 && (
            <TechSection title="education">
              {education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <p className="text-white text-xs font-bold">{edu.school}</p>
                  <p className="text-gray-400 text-xs">{edu.degree} {edu.major}</p>
                  <p className="text-gray-500 text-xs">
                    {formatDate(edu.startDate)}-{edu.endDate ? formatDate(edu.endDate) : '今'}
                  </p>
                  {edu.gpa && <p className="text-green-400 text-xs">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </TechSection>
          )}

          {sorted.find((s) => s.type === 'languages') && languages.length > 0 && (
            <TechSection title="languages">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">{lang.name}</span>
                  <span className="text-green-400">{proficiencyMap[lang.proficiency]}</span>
                </div>
              ))}
            </TechSection>
          )}
        </div>

        {/* Right 2 columns: Experience + Projects */}
        <div className="col-span-2 space-y-4">
          {sorted.find((s) => s.type === 'experience') && experience.length > 0 && (
            <TechSection title="work_experience">
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-green-500/30 pl-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-bold text-sm">{exp.position}</p>
                        <p className="text-green-400 text-xs">{exp.company}</p>
                      </div>
                      <p className="text-gray-500 text-xs flex-shrink-0">
                        {formatDate(exp.startDate)}-{exp.isCurrent ? '今' : formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && <p className="text-gray-400 text-xs mt-1">{exp.description}</p>}
                    {exp.highlights.filter(Boolean).length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {exp.highlights.filter(Boolean).map((h, i) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                            <span className="text-green-400 flex-shrink-0">▸</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </TechSection>
          )}

          {sorted.find((s) => s.type === 'projects') && projects.length > 0 && (
            <TechSection title="projects">
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="border border-gray-700/50 rounded p-2.5 bg-gray-900/30">
                    <div className="flex justify-between items-start">
                      <p className="text-white font-bold text-sm">{proj.name}</p>
                      {proj.url && <a href={proj.url} className="text-green-400 text-xs">{proj.url}</a>}
                    </div>
                    {proj.description && <p className="text-gray-400 text-xs mt-1">{proj.description}</p>}
                    {proj.highlights.filter(Boolean).map((h, i) => (
                      <div key={i} className="text-xs text-gray-300 flex items-start gap-1 mt-0.5">
                        <span className="text-green-400">▸</span>{h}
                      </div>
                    ))}
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.technologies.map((t) => (
                          <span key={t} className="text-xs px-1 bg-gray-800 text-gray-400 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TechSection>
          )}
        </div>
      </div>
    </div>
  )
}

function TechSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-700/50 rounded-lg overflow-hidden">
      <div className="bg-gray-800/80 px-3 py-1.5 border-b border-gray-700/50">
        <span className="text-green-400 text-xs font-bold">{'{'}</span>
        <span className="text-gray-200 text-xs mx-1">{title}</span>
        <span className="text-green-400 text-xs font-bold">{'}'}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}
