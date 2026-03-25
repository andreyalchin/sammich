// src/test/lib/gemini.test.ts
import { describe, it, expect } from 'vitest'
import { stripCodeFences, parseTranslateResponse } from '@/lib/gemini'

describe('stripCodeFences', () => {
  it('returns plain JSON unchanged', () => {
    const input = '{"post":"hello","hashtags":["#a"]}'
    expect(stripCodeFences(input)).toBe(input)
  })

  it('strips ```json fences', () => {
    const input = '```json\n{"post":"hello","hashtags":["#a"]}\n```'
    expect(stripCodeFences(input)).toBe('{"post":"hello","hashtags":["#a"]}')
  })

  it('strips plain ``` fences', () => {
    const input = '```\n{"post":"hello","hashtags":["#a"]}\n```'
    expect(stripCodeFences(input)).toBe('{"post":"hello","hashtags":["#a"]}')
  })
})

describe('parseTranslateResponse', () => {
  it('parses a valid response', () => {
    const raw = '{"post":"test post","hashtags":["#Growth"]}'
    expect(parseTranslateResponse(raw)).toEqual({
      post: 'test post',
      hashtags: ['#Growth'],
    })
  })

  it('throws if response exceeds 4000 chars', () => {
    const raw = 'x'.repeat(4001)
    expect(() => parseTranslateResponse(raw)).toThrow('Response too large')
  })

  it('throws if JSON is invalid after stripping', () => {
    expect(() => parseTranslateResponse('not json')).toThrow('Failed to parse AI response')
  })

  it('throws if post field is missing', () => {
    expect(() => parseTranslateResponse('{"hashtags":["#a"]}')).toThrow(
      'Failed to parse AI response'
    )
  })

  it('throws if hashtags field is missing', () => {
    expect(() => parseTranslateResponse('{"post":"hello"}')).toThrow(
      'Failed to parse AI response'
    )
  })

  it('handles fenced JSON within 4000 chars', () => {
    const raw = '```json\n{"post":"ok","hashtags":["#a"]}\n```'
    expect(parseTranslateResponse(raw)).toEqual({ post: 'ok', hashtags: ['#a'] })
  })

  it('throws if hashtags contains non-string elements', () => {
    expect(() => parseTranslateResponse('{"post":"hello","hashtags":[1,2,3]}')).toThrow(
      'Failed to parse AI response'
    )
  })
})
