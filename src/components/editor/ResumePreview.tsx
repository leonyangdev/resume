'use client'

import { useRef } from 'react'
import { ResumeData, TemplateId } from '@/types/resume'
import { ResumeTemplate } from '@/components/templates'

interface Props {
  data: ResumeData
  templateId: string
  scale?: number
  id?: string
}

export function ResumePreview({ data, templateId, scale = 0.65, id = 'resume-preview' }: Props) {
  return (
    <div className="relative">
      <div
        style={{
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          width: `${100 / scale}%`,
          pointerEvents: 'none',
        }}
      >
        <div id={id} className="shadow-2xl">
          <ResumeTemplate data={data} templateId={templateId} scale={1} />
        </div>
      </div>
      <div style={{ height: `calc(297mm * ${scale})` }} />
    </div>
  )
}
