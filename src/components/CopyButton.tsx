// src/components/CopyButton.tsx
'use client'

import { useState } from 'react'

interface CopyButtonProps {
  text: string
  disabled?: boolean
}

export default function CopyButton({ text, disabled }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard unavailable — do nothing
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={disabled}
      className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}
