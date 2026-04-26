import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { defaultResumeData } from '@/types/resume'
import { nanoid } from 'nanoid'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const resumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      title: true,
      templateId: true,
      atsScore: true,
      isPublic: true,
      shareToken: true,
      shareViews: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(resumes)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const title = body.title || '新简历'
  const templateId = body.templateId || 'modern'

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      title,
      templateId,
      content: JSON.stringify(defaultResumeData),
    },
  })

  return NextResponse.json(resume, { status: 201 })
}
