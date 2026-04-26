import { ResumeData, TemplateId } from '@/types/resume'
import { ModernTemplate } from './ModernTemplate'
import { ClassicTemplate } from './ClassicTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { TechTemplate } from './TechTemplate'
import { CreativeTemplate } from './CreativeTemplate'

interface Props {
  data: ResumeData
  templateId: TemplateId | string
  scale?: number
}

export function ResumeTemplate({ data, templateId, scale = 1 }: Props) {
  switch (templateId) {
    case 'classic':
      return <ClassicTemplate data={data} scale={scale} />
    case 'minimal':
      return <MinimalTemplate data={data} scale={scale} />
    case 'tech':
      return <TechTemplate data={data} scale={scale} />
    case 'creative':
      return <CreativeTemplate data={data} scale={scale} />
    default:
      return <ModernTemplate data={data} scale={scale} />
  }
}
