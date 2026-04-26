import { ResumeData } from '@/types/resume'
import { formatDate } from '@/lib/utils'
import { proficiencyMap, renderHighlights } from './shared'

interface Props {
  data: ResumeData
  scale?: number
}

export function ClassicTemplate({ data, scale = 1 }: Props) {
  const { personal, experience, education, skills, projects, certificates, languages, sections } = data
  const visible = new Set(sections.filter((s) => s.visible).map((s) => s.type))
  const sorted = [...sections].filter((s) => s.visible).sort((a, b) => a.order - b.order)

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || '技能'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <div
      className="bg-white font-serif text-gray-900"
      style={{ width: '210mm', minHeight: '297mm', fontSize: `${14 * scale}px`, padding: '12mm 15mm' }}
    >
      {/* Header */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-5">
        <h1 className="text-3xl font-bold tracking-wide">{personal.name || '姓名'}</h1>
        {personal.title && <p className="text-base text-gray-600 mt-1">{personal.title}</p>}
        <div className="flex justify-center flex-wrap gap-4 mt-3 text-sm text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-5">
        {sorted.map((section) => {
          if (section.type === 'personal') return null

          if (section.type === 'summary' && personal.summary) {
            return (
              <section key="summary">
                <SectionTitle title="个人简介" />
                <p className="text-sm text-gray-700 leading-relaxed">{personal.summary}</p>
              </section>
            )
          }

          if (section.type === 'experience' && experience.length > 0) {
            return (
              <section key="experience">
                <SectionTitle title="工作经历" />
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="font-bold text-gray-900">{exp.position}</span>
                          <span className="text-gray-600"> · {exp.company}</span>
                        </div>
                        <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                          {formatDate(exp.startDate)} – {exp.isCurrent ? '至今' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                      {renderHighlights(exp.highlights)}
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section.type === 'education' && education.length > 0) {
            return (
              <section key="education">
                <SectionTitle title="教育经历" />
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold">{edu.school}</span>
                        <span className="text-gray-600 text-sm"> · {edu.degree} {edu.major}</span>
                        {edu.gpa && <span className="text-gray-500 text-sm"> · GPA {edu.gpa}</span>}
                      </div>
                      <span className="text-sm text-gray-500 flex-shrink-0 ml-2">
                        {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : '至今'}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section.type === 'skills' && skills.length > 0) {
            return (
              <section key="skills">
                <SectionTitle title="技能专长" />
                <div className="space-y-1">
                  {Object.entries(skillsByCategory).map(([cat, items]) => (
                    <div key={cat} className="flex gap-2 text-sm">
                      <span className="font-semibold text-gray-700 w-20 flex-shrink-0">{cat}：</span>
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
                <SectionTitle title="项目经历" />
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold">{proj.name}</span>
                        {proj.role && <span className="text-sm text-gray-600">{proj.role}</span>}
                      </div>
                      {proj.description && <p className="text-sm text-gray-600 mt-0.5">{proj.description}</p>}
                      {renderHighlights(proj.highlights)}
                      {proj.technologies.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">技术栈：{proj.technologies.join('、')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          if (section.type === 'languages' && languages.length > 0) {
            return (
              <section key="languages">
                <SectionTitle title="语言能力" />
                <div className="flex gap-6 text-sm">
                  {languages.map((lang) => (
                    <span key={lang.id}>
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-gray-500"> ({proficiencyMap[lang.proficiency]})</span>
                    </span>
                  ))}
                </div>
              </section>
            )
          }

          if (section.type === 'certificates' && certificates.length > 0) {
            return (
              <section key="certificates">
                <SectionTitle title="资质证书" />
                <div className="space-y-1 text-sm">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="flex justify-between">
                      <span className="font-medium">{cert.name}</span>
                      <span className="text-gray-500">
                        {cert.issuer} · {formatDate(cert.date)}
                      </span>
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

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <h2 className="text-base font-bold uppercase tracking-wider text-gray-800">{title}</h2>
      <div className="flex-1 border-b border-gray-300" />
    </div>
  )
}
