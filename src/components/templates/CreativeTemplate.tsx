import { ResumeData } from '@/types/resume'
import { formatDate } from '@/lib/utils'
import { proficiencyMap, renderHighlights } from './shared'

interface Props {
  data: ResumeData
  scale?: number
}

export function CreativeTemplate({ data, scale = 1 }: Props) {
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
      className="bg-white font-sans text-gray-800"
      style={{ width: '210mm', minHeight: '297mm', fontSize: `${13.5 * scale}px` }}
    >
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-10 py-10">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,...')]" />
        <div className="relative">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-black tracking-tight">{personal.name || '你的名字'}</h1>
              <p className="text-pink-100 text-lg font-light mt-1">{personal.title || '职位头衔'}</p>
            </div>
            <div className="text-right text-xs text-pink-100 space-y-0.5">
              {personal.email && <div>{personal.email}</div>}
              {personal.phone && <div>{personal.phone}</div>}
              {personal.location && <div>{personal.location}</div>}
              {personal.website && <div>{personal.website}</div>}
            </div>
          </div>
          {personal.summary && (
            <p className="mt-4 text-sm text-pink-50 max-w-2xl leading-relaxed italic">"{personal.summary}"</p>
          )}
        </div>
      </div>

      {/* Diagonal accent */}
      <div className="h-4 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-orange-400/20" />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 bg-gray-50 px-5 py-6 space-y-5 border-r border-gray-100">
          {/* Skills */}
          {sorted.find((s) => s.type === 'skills') && skills.length > 0 && (
            <div>
              <CreativeSideTitle title="技能专长" />
              {Object.entries(skillsByCategory).map(([cat, items]) => (
                <div key={cat} className="mb-3">
                  <p className="text-xs font-bold text-gray-500 mb-1.5 uppercase">{cat}</p>
                  <div className="flex flex-wrap gap-1">
                    {items.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-2 py-0.5 text-xs rounded-full font-medium"
                        style={{
                          background: `hsl(${(skill.name.charCodeAt(0) * 15) % 360}, 70%, 93%)`,
                          color: `hsl(${(skill.name.charCodeAt(0) * 15) % 360}, 60%, 35%)`,
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {sorted.find((s) => s.type === 'education') && education.length > 0 && (
            <div>
              <CreativeSideTitle title="教育背景" />
              {education.map((edu) => (
                <div key={edu.id} className="mb-3 relative pl-3 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-gradient-to-r before:from-purple-500 before:to-pink-500">
                  <p className="text-sm font-bold text-gray-800">{edu.school}</p>
                  <p className="text-xs text-gray-600">{edu.degree} · {edu.major}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(edu.startDate)} – {edu.endDate ? formatDate(edu.endDate) : '至今'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {sorted.find((s) => s.type === 'languages') && languages.length > 0 && (
            <div>
              <CreativeSideTitle title="语言能力" />
              {languages.map((lang) => (
                <div key={lang.id} className="mb-1.5">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="font-medium text-gray-700">{lang.name}</span>
                    <span className="text-gray-500">{proficiencyMap[lang.proficiency]}</span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full">
                    <div
                      className="h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{
                        width: `${({ native: 100, fluent: 90, professional: 75, conversational: 60, basic: 40 }[lang.proficiency])}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main */}
        <div className="flex-1 px-7 py-6 space-y-5">
          {sorted.find((s) => s.type === 'experience') && experience.length > 0 && (
            <div>
              <CreativeMainTitle title="工作经历" />
              <div className="space-y-4 mt-2">
                {experience.map((exp, i) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-gradient-to-b" style={{ borderColor: `hsl(${290 + i * 40}, 70%, 60%)` }}>
                    <div className="absolute -left-1.5 top-1 w-2.5 h-2.5 rounded-full" style={{ background: `hsl(${290 + i * 40}, 70%, 60%)` }} />
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{exp.position}</p>
                        <p className="text-xs font-semibold" style={{ color: `hsl(${290 + i * 40}, 60%, 50%)` }}>{exp.company}</p>
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {formatDate(exp.startDate)} – {exp.isCurrent ? '至今' : formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && <p className="text-xs text-gray-600 mt-1">{exp.description}</p>}
                    {exp.highlights.filter(Boolean).map((h, j) => (
                      <div key={j} className="flex items-start gap-1.5 mt-0.5 text-xs text-gray-700">
                        <span style={{ color: `hsl(${290 + i * 40}, 60%, 50%)` }}>◆</span>
                        {h}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {sorted.find((s) => s.type === 'projects') && projects.length > 0 && (
            <div>
              <CreativeMainTitle title="项目经历" />
              <div className="grid grid-cols-2 gap-3 mt-2">
                {projects.map((proj, i) => (
                  <div
                    key={proj.id}
                    className="rounded-xl p-3 border"
                    style={{
                      borderColor: `hsl(${200 + i * 50}, 60%, 85%)`,
                      background: `hsl(${200 + i * 50}, 60%, 97%)`,
                    }}
                  >
                    <p className="text-sm font-bold text-gray-900">{proj.name}</p>
                    {proj.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{proj.description}</p>}
                    {proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {proj.technologies.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-xs px-1.5 py-0.5 rounded font-medium"
                            style={{ background: `hsl(${200 + i * 50}, 60%, 88%)`, color: `hsl(${200 + i * 50}, 50%, 35%)` }}
                          >
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

          {sorted.find((s) => s.type === 'certificates') && certificates.length > 0 && (
            <div>
              <CreativeMainTitle title="资质证书" />
              <div className="flex flex-wrap gap-2 mt-2">
                {certificates.map((cert) => (
                  <div key={cert.id} className="px-3 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-xs">
                    <span className="font-semibold text-purple-700">{cert.name}</span>
                    <span className="text-purple-400 ml-1">· {cert.issuer}</span>
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

function CreativeSideTitle({ title }: { title: string }) {
  return (
    <h2 className="text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-3">
      {title}
    </h2>
  )
}

function CreativeMainTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
      <h2 className="text-sm font-black text-gray-800 uppercase tracking-wide">{title}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent" />
    </div>
  )
}
