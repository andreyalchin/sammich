import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CopyButton from '@/components/CopyButton'

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

describe('CopyButton', () => {
  it('shows "Copy" initially', () => {
    render(<CopyButton text="hello" />)
    expect(screen.getByRole('button', { name: /^copy$/i })).toBeInTheDocument()
  })

  it('writes text to clipboard and shows "Copied!" on click', async () => {
    vi.useFakeTimers()
    try {
      render(<CopyButton text="copy me" />)
      const button = screen.getByRole('button', { name: /^copy$/i })

      await act(async () => {
        button.click()
        await Promise.resolve()
      })

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('copy me')
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()

      await act(async () => { vi.advanceTimersByTime(2000) })
      expect(screen.getByRole('button', { name: /^copy$/i })).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
