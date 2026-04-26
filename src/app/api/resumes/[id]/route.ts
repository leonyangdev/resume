import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { nanoid } from 'nanoid'

async function getOwnedResume(id: string, userId: string) {
  return prisma.resume.findFirst({ where: { id, userId } })
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const { id } = await params
  const resume = await getOwnedResume(id, session.user.id)
  if (!resume) return NextResponse.json({ error: '简历不存在' }, { status: 404 })

  return NextResponse.json(resume)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const { id } = await params
  const resume = await getOwnedResume(id, session.user.id)
  if (!resume) return NextResponse.json({ error: '简历不存在' }, { status: 404 })

  const body = await req.json()

  // Save version snapshot before update if content changed
  if (body.content && body.content !== resume.content) {
    await prisma.resumeVersion.create({
      data: {
        resumeId: id,
        content: resume.content,
        label: body.versionLabel,
      },
    })
    // Keep only last 20 versions
    const versions = await prisma.resumeVersion.findMany({
      where: { resumeId: id },
      orderBy: { createdAt: 'desc' },
      skip: 20,
    })
    if (versions.length > 0) {
      await prisma.resumeVersion.deleteMany({
        where: { id: { in: versions.map((v: { id: string }) => v.id) } },
      })
    }
  }

  const updated = await prisma.resume.update({
    where: { id },
    data: {
      title: body.title,
      templateId: body.templateId,
      content: body.content,
      atsScore: body.atsScore,
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const { id } = await params
  const resume = await getOwnedResume(id, session.user.id)
  if (!resume) return NextResponse.json({ error: '简历不存在' }, { status: 404 })

  await prisma.resume.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
