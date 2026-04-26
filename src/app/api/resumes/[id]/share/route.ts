import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { nanoid } from 'nanoid'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const { id } = await params
  const resume = await prisma.resume.findFirst({ where: { id, userId: session.user.id } })
  if (!resume) return NextResponse.json({ error: '简历不存在' }, { status: 404 })

  const shareToken = resume.shareToken || nanoid(10)
  const updated = await prisma.resume.update({
    where: { id },
    data: { isPublic: true, shareToken },
  })

  return NextResponse.json({ shareToken: updated.shareToken, isPublic: true })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const { id } = await params
  await prisma.resume.updateMany({
    where: { id, userId: session.user.id },
    data: { isPublic: false },
  })

  return NextResponse.json({ isPublic: false })
}
