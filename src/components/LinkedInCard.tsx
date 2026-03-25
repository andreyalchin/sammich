// src/components/LinkedInCard.tsx
import { TranslateResponse } from '@/types'

const AVATAR_NAME = 'Alex P.'

interface LinkedInCardProps {
  result: TranslateResponse
}

export default function LinkedInCard({ result }: LinkedInCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-lg font-semibold flex-shrink-0">
          {AVATAR_NAME[0]}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{AVATAR_NAME}</p>
          <p className="text-xs text-gray-500">Chief Everything Officer · 1st</p>
        </div>
      </div>

      <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed mb-4">
        {result.post}
      </p>

      <div className="flex flex-wrap gap-1">
        {result.hashtags.map((tag, i) => (
          <span key={`${tag}-${i}`} className="text-blue-600 text-sm hover:underline cursor-pointer">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
