import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const runtime = 'edge'

// Only initialise if Upstash env vars are present — skipped in local dev without them
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(10, '1 m'),
      })
    : null

function getIp(request: NextRequest): string | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ip = (request as any).ip as string | undefined
  if (ip && ip !== '::1' && ip !== '127.0.0.1') return ip

  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0].trim()
    if (first && first !== '::1' && first !== '127.0.0.1') return first
  }

  return null
}

export async function middleware(request: NextRequest) {
  if (!ratelimit) return NextResponse.next()

  const ip = getIp(request)
  if (!ip) return NextResponse.next()

  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Slow down.' },
      { status: 429 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/translate',
}
