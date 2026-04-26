import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const { id } = await params
  const resume = await prisma.resume.findFirst({ where: { id, userId: session.user.id } })
  if (!resume) return NextResponse.json({ error: '简历不存在' }, { status: 404 })

  const versions = await prisma.resumeVersion.findMany({
    where: { resumeId: id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: { id: true, label: true, createdAt: true },
  })

  return NextResponse.json(versions)
}
