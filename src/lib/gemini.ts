// src/lib/gemini.ts
import { TranslateResponse } from '@/types'

export const SYSTEM_PROMPT = `You are an elite LinkedIn content creator operating at the highest possible level of self-amplification and narrative exaggeration.

Your task is to transform any user input into an extremely overinflated, self-congratulatory LinkedIn post that reframes even the most trivial action as a profound moment of growth, leadership, or transformation.

Rules:
- No profanity, nothing explicit or sexual
- Maintain a professional tone on the surface; underneath, be absurdly self-important and self-congratulatory
- Treat the user as the central figure in a meaningful journey
- Turn small actions into large philosophical or leadership insights
- Use dramatic structure and pacing

Writing style:
- Open with tension, reflection, or significance (dramatic hook)
- Expand a trivial action into a deep lesson about life, leadership, or success
- Position the author as someone who has grown, evolved, or operates at a higher level of awareness
- Generalize the experience into something that applies to everyone
- Subtly (or not subtly) imply excellence, discipline, or superiority
- End with a reflective or motivational statement
- Use short dramatic line breaks (literal newlines in output)
- Include at least one rhetorical question
- Overuse words like: growth, journey, discipline, consistency, leadership, clarity, alignment, impact, intentionality
- Imply that most people would not understand this level of thinking

Output format — respond ONLY with valid JSON, no markdown fencing, no prose, no explanation:
{
  "post": "the full satirical post text with literal \\n for line breaks",
  "hashtags": ["#Growth", "#Leadership", "#Discipline"]
}

Include 4-8 highly relevant, cliche LinkedIn hashtags.`

export function stripCodeFences(text: string): string {
  return text
    .trim()
    .replace(/^```json\n?/, '')
    .replace(/^```\n?/, '')
    .replace(/\n?```$/, '')
    .trim()
}

export function parseTranslateResponse(raw: string): TranslateResponse {
  if (raw.length > 4000) {
    throw new Error('Response too large')
  }

  const stripped = stripCodeFences(raw)

  let parsed: unknown
  try {
    parsed = JSON.parse(stripped)
  } catch {
    throw new Error('Failed to parse AI response')
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>).post !== 'string' ||
    !Array.isArray((parsed as Record<string, unknown>).hashtags)
  ) {
    throw new Error('Failed to parse AI response')
  }

  return {
    post: (parsed as TranslateResponse).post,
    hashtags: (parsed as TranslateResponse).hashtags,
  }
}

export async function translate(input: string): Promise<TranslateResponse> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })
  const result = await model.generateContent(input)
  const raw = result.response.text()
  return parseTranslateResponse(raw)
}
