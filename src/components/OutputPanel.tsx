// src/components/OutputPanel.tsx
'use client'

import { useState } from 'react'
import { TranslateResponse } from '@/types'
import LinkedInCard from './LinkedInCard'
import CopyButton from './CopyButton'
import SharePopover from './SharePopover'
import { buildCopyText } from '@/lib/share'

interface OutputPanelProps {
  result: TranslateResponse | null
  error: string | null
  userInput: string
}

export default function OutputPanel({ result, error, userInput }: OutputPanelProps) {
  const [popoverOpen, setPopoverOpen] = useState(false)

  const copyText = result ? buildCopyText(result.post, result.hashtags) : ''

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 p-4" style={{ minHeight: 240 }}>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        {!result && !error && (
          <div className="flex items-center justify-center h-full" style={{ minHeight: 208 }}>
            <p className="text-gray-300 text-sm">Your LinkedIn masterpiece will appear here.</p>
          </div>
        )}
        {result && (
          <LinkedInCard result={result} />
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 relative">
        <div className="relative">
          <button
            onClick={() => setPopoverOpen((o) => !o)}
            disabled={!result}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Share
          </button>
          {popoverOpen && result && (
            <SharePopover
              result={result}
              userInput={userInput}
              onClose={() => setPopoverOpen(false)}
            />
          )}
        </div>
        <CopyButton text={copyText} disabled={!result} />
      </div>
    </div>
  )
}
