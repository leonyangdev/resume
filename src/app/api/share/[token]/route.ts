import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { headers } from 'next/headers'

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const resume = await prisma.resume.findUnique({
    where: { shareToken: token, isPublic: true },
    include: { user: { select: { name: true } } },
  })

  if (!resume) return NextResponse.json({ error: '简历不存在或未公开' }, { status: 404 })

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const ua = headersList.get('user-agent') || ''
  const referer = headersList.get('referer') || ''

  // Log view asynchronously
  prisma.viewLog
    .create({ data: { resumeId: resume.id, viewerIp: ip, userAgent: ua, referer } })
    .then(() => prisma.resume.update({ where: { id: resume.id }, data: { shareViews: { increment: 1 } } }))
    .catch(() => {})

  return NextResponse.json({
    id: resume.id,
    title: resume.title,
    templateId: resume.templateId,
    content: resume.content,
    authorName: resume.user.name,
  })
}
