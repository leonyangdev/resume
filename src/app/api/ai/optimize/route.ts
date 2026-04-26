import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: '未登录' }, { status: 401 })

  const { type, content, jobDescription } = await req.json()

  let prompt = ''

  if (type === 'bullet') {
    prompt = `你是一位专业的简历优化专家。请将以下工作经历描述优化为更专业、量化、有力的表述。
要求：
1. 使用 STAR 法则（情境-任务-行动-结果）
2. 尽量量化成果（如：提升X%、节省X小时、服务X用户）
3. 使用强动词开头（如：主导、推动、优化、构建）
4. 保持简洁，每条不超过2行
5. 直接返回优化后的内容，不需要解释

原始内容：
${content}

请直接返回优化后的文字，保持原有格式（如有多条请分行）。`
  } else if (type === 'summary') {
    prompt = `你是一位专业的简历优化专家。请将以下个人简介优化为更吸引HR的版本。
要求：
1. 突出核心竞争力和独特价值
2. 包含具体年限、技能或成就
3. 语气自信但不浮夸
4. 控制在3-4句话内
5. 使用第一人称

原始内容：
${content}

请直接返回优化后的个人简介。`
  } else if (type === 'ats') {
    prompt = `你是一位ATS（招聘管理系统）优化专家。请分析以下简历内容与目标职位描述的匹配度，并给出优化建议。

职位描述：
${jobDescription}

简历内容：
${content}

请返回以下JSON格式（不要包含其他文字）：
{
  "score": 75,
  "matched_keywords": ["关键词1", "关键词2"],
  "missing_keywords": ["关键词3", "关键词4"],
  "suggestions": [
    "建议1：...",
    "建议2：..."
  ],
  "summary": "总体评价..."
}`
  } else {
    return NextResponse.json({ error: '无效的优化类型' }, { status: 400 })
  }

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  })

  const result = message.content[0].type === 'text' ? message.content[0].text : ''

  if (type === 'ats') {
    try {
      const json = JSON.parse(result)
      return NextResponse.json(json)
    } catch {
      return NextResponse.json({ error: '解析失败', raw: result }, { status: 500 })
    }
  }

  return NextResponse.json({ result })
}
