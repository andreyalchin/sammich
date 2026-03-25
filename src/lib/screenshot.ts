// src/lib/screenshot.ts
export async function capturePostCard(element: HTMLElement): Promise<Blob> {
  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(element, { scale: 2, useCORS: true })
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to capture screenshot'))
    }, 'image/png')
  })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
