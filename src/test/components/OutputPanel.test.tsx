import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import OutputPanel from '@/components/OutputPanel'
import { TranslateResponse } from '@/types'

vi.mock('@/lib/screenshot', () => ({
  capturePostCard: vi.fn(),
  downloadBlob: vi.fn(),
}))

describe('OutputPanel', () => {
  it('shows placeholder and disables Share when no result', () => {
    render(<OutputPanel result={null} error={null} userInput="" />)
    expect(screen.queryByText('Alex P.')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^share$/i })).toBeDisabled()
  })

  it('renders post body and hashtags when result is provided', () => {
    const result: TranslateResponse = {
      post: 'Today I grew.',
      hashtags: ['#Growth', '#Leadership'],
    }
    render(<OutputPanel result={result} error={null} userInput="I worked" />)
    expect(screen.getByText('Today I grew.')).toBeInTheDocument()
    expect(screen.getByText('#Growth')).toBeInTheDocument()
    expect(screen.getByText('#Leadership')).toBeInTheDocument()
    expect(screen.getByText('Alex P.')).toBeInTheDocument()
  })

  it('enables Share button when result is present', () => {
    const result: TranslateResponse = { post: 'test', hashtags: ['#a'] }
    render(<OutputPanel result={result} error={null} userInput="test" />)
    expect(screen.getByRole('button', { name: /^share$/i })).toBeEnabled()
  })

  it('shows error message when error is provided', () => {
    render(<OutputPanel result={null} error="Something went wrong. Try again." userInput="" />)
    expect(screen.getByText('Something went wrong. Try again.')).toBeInTheDocument()
  })
})
