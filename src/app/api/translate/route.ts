import { NextRequest, NextResponse } from 'next/server'
import { translate } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { input } = body

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const result = await translate(input.trim())
    return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Try again.' },
      { status: 500 }
    )
  }
}
