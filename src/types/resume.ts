export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  summary: string
  avatar?: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  isCurrent: boolean
  location?: string
  description: string
  highlights: string[]
}

export interface Education {
  id: string
  school: string
  degree: string
  major: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
  honors?: string[]
}

export interface Skill {
  id: string
  name: string
  level: number // 1-5
  category: string
}

export interface Project {
  id: string
  name: string
  role?: string
  startDate?: string
  endDate?: string
  url?: string
  description: string
  highlights: string[]
  technologies: string[]
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  date: string
  url?: string
}

export interface Language {
  id: string
  name: string
  proficiency: 'native' | 'fluent' | 'professional' | 'conversational' | 'basic'
}

export interface SectionConfig {
  id: string
  type: SectionType
  title: string
  visible: boolean
  order: number
}

export type SectionType =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certificates'
  | 'languages'
  | 'custom'

export interface CustomSection {
  id: string
  title: string
  items: CustomItem[]
}

export interface CustomItem {
  id: string
  title: string
  subtitle?: string
  date?: string
  description?: string
}

export interface ResumeData {
  personal: PersonalInfo
  experience: WorkExperience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certificates: Certificate[]
  languages: Language[]
  customSections: CustomSection[]
  sections: SectionConfig[]
}

export interface ResumeSettings {
  templateId: string
  colorScheme: string
  fontSize: number
  pageMargin: number
  fontFamily: string
}

export type TemplateId = 'modern' | 'classic' | 'minimal' | 'tech' | 'creative'

export const TEMPLATE_LIST: { id: TemplateId; name: string; description: string; preview: string; tag?: string }[] = [
  {
    id: 'modern',
    name: '现代简约',
    description: '干净清爽的双栏布局，适合互联网、产品等岗位',
    preview: '/templates/modern.png',
    tag: '最受欢迎',
  },
  {
    id: 'classic',
    name: '经典商务',
    description: '传统单栏布局，专业正式，适合金融、咨询等岗位',
    preview: '/templates/classic.png',
  },
  {
    id: 'minimal',
    name: '极简风格',
    description: '留白充足，注重排版，适合设计师、创意类岗位',
    preview: '/templates/minimal.png',
    tag: '设计师推荐',
  },
  {
    id: 'tech',
    name: '技术极客',
    description: '突出技术栈和项目，适合开发者、工程师等岗位',
    preview: '/templates/tech.png',
    tag: '程序员专属',
  },
  {
    id: 'creative',
    name: '创意活力',
    description: '色彩丰富，个性突出，适合营销、媒体等岗位',
    preview: '/templates/creative.png',
  },
]

export const defaultResumeData: ResumeData = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
  languages: [],
  customSections: [],
  sections: [
    { id: 'personal', type: 'personal', title: '个人信息', visible: true, order: 0 },
    { id: 'summary', type: 'summary', title: '个人简介', visible: true, order: 1 },
    { id: 'experience', type: 'experience', title: '工作经历', visible: true, order: 2 },
    { id: 'education', type: 'education', title: '教育经历', visible: true, order: 3 },
    { id: 'skills', type: 'skills', title: '技能专长', visible: true, order: 4 },
    { id: 'projects', type: 'projects', title: '项目经历', visible: true, order: 5 },
    { id: 'certificates', type: 'certificates', title: '资质证书', visible: false, order: 6 },
    { id: 'languages', type: 'languages', title: '语言能力', visible: false, order: 7 },
  ],
}
