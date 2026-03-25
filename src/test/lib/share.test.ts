// src/test/lib/share.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getAppUrl,
  buildAttributionFooter,
  buildCopyText,
  buildTwitterText,
  buildWhatsAppUrl,
  buildFacebookUrl,
  buildLinkedInUrl,
  buildTwitterUrl,
} from '@/lib/share'

beforeEach(() => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://sammich.vercel.app'
})

describe('getAppUrl', () => {
  it('returns NEXT_PUBLIC_APP_URL when set', () => {
    expect(getAppUrl()).toBe('https://sammich.vercel.app')
  })

  it('falls back to localhost:3000 when not set', () => {
    delete process.env.NEXT_PUBLIC_APP_URL
    expect(getAppUrl()).toBe('http://localhost:3000')
  })
})

describe('buildAttributionFooter', () => {
  it('includes the app URL', () => {
    expect(buildAttributionFooter()).toBe(
      'Try Sammich. Plain English to LinkedIn translator — https://sammich.vercel.app'
    )
  })
})

describe('buildCopyText', () => {
  it('formats post, hashtags, and attribution with blank line separators', () => {
    const result = buildCopyText('my post', ['#Growth', '#Leadership'])
    expect(result).toBe(
      'my post\n\n#Growth #Leadership\n\nTry Sammich. Plain English to LinkedIn translator — https://sammich.vercel.app'
    )
  })
})

describe('buildTwitterText', () => {
  it('returns input + attribution when combined is under 280 chars', () => {
    const result = buildTwitterText('I ate a sandwich')
    expect(result).toBe('I ate a sandwich\n\nTry Sammich: https://sammich.vercel.app')
    expect(result.length).toBeLessThanOrEqual(280)
  })

  it('truncates at word boundary when combined exceeds 280 chars', () => {
    const longInput = 'hello world '.repeat(25).trim()
    const result = buildTwitterText(longInput)
    expect(result.length).toBeLessThanOrEqual(280)
    expect(result).toContain('…')
    expect(result).toContain('Try Sammich: https://sammich.vercel.app')
  })

  it('always includes full attribution and stays within 280 chars even with no whitespace', () => {
    const longInput = 'a'.repeat(300)
    const result = buildTwitterText(longInput)
    expect(result).toContain('Try Sammich: https://sammich.vercel.app')
    expect(result.length).toBeLessThanOrEqual(280)
  })

  it('does not truncate when input fits exactly', () => {
    const attribution = '\n\nTry Sammich: https://sammich.vercel.app'
    const input = 'x'.repeat(280 - attribution.length)
    const result = buildTwitterText(input)
    expect(result.length).toBeLessThanOrEqual(280)
    expect(result).not.toContain('…')
  })
})

describe('buildWhatsAppUrl', () => {
  it('starts with whatsapp URL scheme', () => {
    const result = buildWhatsAppUrl('my post', ['#Growth'])
    expect(result).toMatch(/^https:\/\/wa\.me\/\?text=/)
  })

  it('URL-encodes the full copy text', () => {
    const result = buildWhatsAppUrl('my post', ['#Growth'])
    const decoded = decodeURIComponent(result.replace('https://wa.me/?text=', ''))
    expect(decoded).toContain('my post')
    expect(decoded).toContain('#Growth')
    expect(decoded).toContain('Try Sammich')
  })
})

describe('buildFacebookUrl', () => {
  it('uses Facebook sharer with encoded app URL', () => {
    const result = buildFacebookUrl()
    expect(result).toContain('https://www.facebook.com/sharer/sharer.php?u=')
    expect(result).toContain(encodeURIComponent('https://sammich.vercel.app'))
  })
})

describe('buildLinkedInUrl', () => {
  it('returns LinkedIn feed URL', () => {
    expect(buildLinkedInUrl()).toBe('https://www.linkedin.com/feed/')
  })
})

describe('buildTwitterUrl', () => {
  it('returns Twitter intent URL with encoded tweet text', () => {
    const result = buildTwitterUrl('I ate lunch')
    expect(result).toMatch(/^https:\/\/twitter\.com\/intent\/tweet\?text=/)
    const decoded = decodeURIComponent(result.replace('https://twitter.com/intent/tweet?text=', ''))
    expect(decoded).toContain('I ate lunch')
    expect(decoded).toContain('Try Sammich:')
  })
})
