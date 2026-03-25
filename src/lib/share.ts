// src/lib/share.ts

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

export function buildAttributionFooter(): string {
  return `Try Sammich. Plain English to LinkedIn translator — ${getAppUrl()}`
}

export function buildCopyText(post: string, hashtags: string[]): string {
  return `${post}\n\n${hashtags.join(' ')}\n\n${buildAttributionFooter()}`
}

export function buildTwitterText(userInput: string): string {
  const appUrl = getAppUrl()
  const attribution = `Try Sammich: ${appUrl}`
  const separator = '\n\n'
  const suffix = `${separator}${attribution}`
  const maxLen = 280

  if (userInput.length + suffix.length <= maxLen) {
    return `${userInput}${suffix}`
  }

  // Truncate at last word boundary, leaving room for suffix + ellipsis character
  const available = maxLen - suffix.length - 1
  const truncated = userInput.slice(0, available).replace(/\s+\S*$/, '')
  return `${truncated}…${suffix}`
}

export function buildTwitterUrl(userInput: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(buildTwitterText(userInput))}`
}

export function buildWhatsAppUrl(post: string, hashtags: string[]): string {
  return `https://wa.me/?text=${encodeURIComponent(buildCopyText(post, hashtags))}`
}

export function buildLinkedInUrl(): string {
  return 'https://www.linkedin.com/feed/'
}

export function buildFacebookUrl(): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getAppUrl())}`
}
