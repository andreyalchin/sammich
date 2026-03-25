// src/components/SharePopover.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { type RefObject } from 'react'
import { TranslateResponse, SharePlatform } from '@/types'
import {
  buildLinkedInUrl,
  buildTwitterUrl,
  buildFacebookUrl,
  buildWhatsAppUrl,
  buildCopyText,
} from '@/lib/share'
import { capturePostCard, downloadBlob } from '@/lib/screenshot'

interface SharePopoverProps {
  result: TranslateResponse
  userInput: string
  cardRef: RefObject<HTMLDivElement | null>
  onClose: () => void
}

interface PlatformConfig {
  id: SharePlatform
  label: string
  icon: string
}

const PLATFORMS: PlatformConfig[] = [
  { id: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { id: 'twitter', label: 'X', icon: 'X' },
  { id: 'facebook', label: 'Facebook', icon: 'f' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'W' },
  { id: 'instagram', label: 'Instagram', icon: 'IG' },
  { id: 'tiktok', label: 'TikTok', icon: 'TT' },
]

const STAY_OPEN_PLATFORMS: SharePlatform[] = ['linkedin', 'instagram', 'tiktok']

function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

export default function SharePopover({ result, userInput, cardRef, onClose }: SharePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)
  const [loadingPlatform, setLoadingPlatform] = useState<SharePlatform | null>(null)
  const [instruction, setInstruction] = useState<string | null>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const handleShare = async (platform: SharePlatform) => {
    const copyText = buildCopyText(result.post, result.hashtags)

    switch (platform) {
      case 'linkedin':
        await navigator.clipboard.writeText(copyText)
        openExternal(buildLinkedInUrl())
        setInstruction('Text copied — paste your post into LinkedIn')
        break

      case 'twitter':
        openExternal(buildTwitterUrl(userInput))
        break

      case 'facebook':
        openExternal(buildFacebookUrl())
        break

      case 'whatsapp':
        openExternal(buildWhatsAppUrl(result.post, result.hashtags))
        break

      case 'instagram':
      case 'tiktok': {
        setLoadingPlatform(platform)
        try {
          await navigator.clipboard.writeText(copyText)
          if (cardRef.current) {
            const blob = await capturePostCard(cardRef.current)
            downloadBlob(blob, 'sammich-post.png')
          }
          const app = platform === 'instagram' ? 'Instagram' : 'TikTok'
          setInstruction(`Text copied & image saved — open ${app} and paste`)
        } catch {
          setInstruction('Something went wrong. Please try again.')
        } finally {
          setLoadingPlatform(null)
        }
        break
      }
    }

    if (!STAY_OPEN_PLATFORMS.includes(platform)) {
      onClose()
    }
  }

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 min-w-[280px]"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Share</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-nowrap">
        {PLATFORMS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => handleShare(id)}
            disabled={loadingPlatform !== null}
            className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 min-w-[44px]"
            title={label}
          >
            {loadingPlatform === id ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <span className="text-sm font-bold text-gray-700 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                {icon}
              </span>
            )}
            <span className="text-xs text-gray-500">{label}</span>
          </button>
        ))}
      </div>

      {instruction && (
        <p className="mt-3 text-xs text-gray-600 border-t border-gray-100 pt-2">{instruction}</p>
      )}
    </div>
  )
}
