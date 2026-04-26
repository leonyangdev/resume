import { ResumeData } from '@/types/resume'
import { formatDate } from '@/lib/utils'
import { proficiencyMap, renderHighlights } from './shared'
import { Mail, Phone, MapPin, Globe, Link, GitBranch } from 'lucide-react'

interface Props {
  data: ResumeData
  scale?: number
}

export function ModernTemplate({ data, scale = 1 }: Props) {
  const { personal, experience, education, skills, projects, certificates, languages, sections } = data

  const visibleSections = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || '技能'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <div
      className="bg-white font-sans text-gray-800"
      style={{ width: '210mm', minHeight: '297mm', fontSize: `${14 * scale}px` }}
    >
      {/* Header */}
      <div className="bg-indigo-600 text-white px-10 py-8">
        <h1 className="text-3xl font-bold tracking-wide">{personal.name || '你的姓名'}</h1>
        <p className="text-indigo-200 text-lg mt-1">{personal.title || '职位头衔'}</p>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-indigo-100">
          {personal.email && (
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {personal.email}
            </span>
          )}
          {personal.phone && (
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              {personal.phone}
            </span>
          )}
          {personal.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {personal.location}
            </span>
          )}
          {personal.website && (
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              {personal.website}
            </span>
          )}
          {personal.github && (
            <span className="flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" />
              {personal.github}
            </span>
          )}
          {personal.linkedin && (
            <span className="flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5" />
              {personal.linkedin}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-0">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-100 px-6 py-6 space-y-6 flex-shrink-0">
          {/* Skills */}
          {visibleSections.find((s) => s.type === 'skills') && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">技能专长</h2>
              {Object.entries(skillsByCategory).map(([cat, items]) => (
                <div key={cat} className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1.5">{cat}</p>
                  <div className="flex flex-wrap gap-1">
                    {items.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {visibleSections.find((s) => s.type === 'education') && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">教育经历</h2>
              {education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <p className="text-sm font-semibold text-gray-800">{edu.school}</p>
                  <p className="text-xs text-gray-600">
                    {edu.degree} · {edu.major}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : '至今'}
                  </p>
                  {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {visibleSections.find((s) => s.type === 'languages') && languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">语言能力</h2>
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">{lang.name}</span>
                  <span className="text-xs text-gray-500">{proficiencyMap[lang.proficiency]}</span>
                </div>
              ))}
            </div>
          )}

          {/* Certificates */}
          {visibleSections.find((s) => s.type === 'certificates') && certificates.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">资质证书</h2>
              {certificates.map((cert) => (
                <div key={cert.id} className="mb-2">
                  <p className="text-sm font-medium text-gray-800">{cert.name}</p>
                  <p className="text-xs text-gray-500">
                    {cert.issuer} · {formatDate(cert.date)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 px-8 py-6 space-y-6">
          {/* Summary */}
          {visibleSections.find((s) => s.type === 'summary') && personal.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 pb-1 border-b border-indigo-100">
                个人简介
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">{personal.summary}</p>
            </div>
          )}

          {/* Experience */}
          {visibleSections.find((s) => s.type === 'experience') && experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 pb-1 border-b border-indigo-100">
                工作经历
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{exp.position}</p>
                        <p className="text-sm text-indigo-600 font-medium">{exp.company}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-xs text-gray-500">
                          {formatDate(exp.startDate)} – {exp.isCurrent ? '至今' : formatDate(exp.endDate)}
                        </p>
                        {exp.location && <p className="text-xs text-gray-400">{exp.location}</p>}
                      </div>
                    </div>
                    {exp.description && <p className="text-sm text-gray-600 mt-1">{exp.description}</p>}
                    {renderHighlights(exp.highlights)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {visibleSections.find((s) => s.type === 'projects') && projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 pb-1 border-b border-indigo-100">
                项目经历
              </h2>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{proj.name}</p>
                        {proj.role && <p className="text-xs text-indigo-600">{proj.role}</p>}
                      </div>
                      {(proj.startDate || proj.endDate) && (
                        <p className="text-xs text-gray-500 flex-shrink-0 ml-4">
                          {proj.startDate && formatDate(proj.startDate)}
                          {proj.startDate && proj.endDate && ' – '}
                          {proj.endDate && formatDate(proj.endDate)}
                        </p>
                      )}
                    </div>
                    {proj.description && <p className="text-sm text-gray-600 mt-1">{proj.description}</p>}
                    {renderHighlights(proj.highlights)}
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.technologies.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
