import { ResumeData } from '@/types/resume'
import { formatDate } from '@/lib/utils'
import { proficiencyMap, renderHighlights } from './shared'

interface Props {
  data: ResumeData
  scale?: number
}

export function MinimalTemplate({ data, scale = 1 }: Props) {
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
      className="bg-white font-sans text-gray-700"
      style={{ width: '210mm', minHeight: '297mm', fontSize: `${13 * scale}px`, padding: '16mm 18mm' }}
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-light text-gray-900 tracking-tight">{personal.name || '姓名'}</h1>
        {personal.title && <p className="text-sm text-gray-400 mt-1 tracking-widest uppercase">{personal.title}</p>}

        <div className="flex gap-5 mt-4 text-xs text-gray-400">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </div>

      <div className="space-y-8">
        {sorted.map((section) => {
          if (section.type === 'personal') return null

          if (section.type === 'summary' && personal.summary) {
            return (
              <section key="summary">
                <MinimalSectionTitle title="About" />
                <p className="text-sm text-gray-600 leading-loose mt-2">{personal.summary}</p>
              </section>
            )
          }

          if (section.type === 'experience' && experience.length > 0) {
            return (
              <section key="experience">
                <MinimalSectionTitle title="Experience" />
                <div className="space-y-5 mt-2">
                  {experience.map((exp) => (
                    <div key={exp.id} className="flex gap-6">
                      <div className="w-28 flex-shrink-0 text-xs text-gray-400 pt-0.5">
                        <span>
                          {formatDate(exp.startDate)} –<br />
                          {exp.isCurrent ? '至今' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{exp.position}</p>
                        <p className="text-xs text-gray-500">{exp.company}{exp.location && ` · ${exp.location}`}</p>
                        {exp.description && <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{exp.description}</p>}
                        {renderHighlights(exp.highlights)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section.type === 'education' && education.length > 0) {
            return (
              <section key="education">
                <MinimalSectionTitle title="Education" />
                <div className="space-y-3 mt-2">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex gap-6">
                      <div className="w-28 flex-shrink-0 text-xs text-gray-400 pt-0.5">
                        {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : '至今'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{edu.school}</p>
                        <p className="text-xs text-gray-500">{edu.degree} · {edu.major}</p>
                        {edu.gpa && <p className="text-xs text-gray-400">GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section.type === 'skills' && skills.length > 0) {
            return (
              <section key="skills">
                <MinimalSectionTitle title="Skills" />
                <div className="mt-2 space-y-1.5">
                  {Object.entries(skillsByCategory).map(([cat, items]) => (
                    <div key={cat} className="flex gap-3 text-sm">
                      <span className="text-gray-400 w-20 flex-shrink-0 text-xs pt-0.5">{cat}</span>
                      <span className="text-gray-700">{items.map((s) => s.name).join(' · ')}</span>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section.type === 'projects' && projects.length > 0) {
            return (
              <section key="projects">
                <MinimalSectionTitle title="Projects" />
                <div className="space-y-4 mt-2">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex items-baseline gap-2">
                        <p className="text-sm font-semibold text-gray-900">{proj.name}</p>
                        {proj.url && <a href={proj.url} className="text-xs text-gray-400">{proj.url}</a>}
                      </div>
                      {proj.description && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{proj.description}</p>}
                      {renderHighlights(proj.highlights)}
                      {proj.technologies.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">{proj.technologies.join(' · ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}

function MinimalSectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xs text-gray-400 tracking-widest uppercase">{title}</h2>
  )
}
