// src/types/index.ts

export interface TranslateResponse {
  post: string
  hashtags: string[]
}

export type SharePlatform =
  | 'linkedin'
  | 'twitter'
  | 'facebook'
  | 'whatsapp'
  | 'instagram'
  | 'tiktok'
