import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputPanel from '@/components/InputPanel'

describe('InputPanel', () => {
  it('disables Translate button when input is empty', () => {
    render(<InputPanel onTranslate={vi.fn()} isLoading={false} />)
    expect(screen.getByRole('button', { name: /^translate$/i })).toBeDisabled()
  })

  it('enables Translate button when input has text', async () => {
    const user = userEvent.setup()
    render(<InputPanel onTranslate={vi.fn()} isLoading={false} />)
    await user.type(screen.getByRole('textbox'), 'hello')
    expect(screen.getByRole('button', { name: /^translate$/i })).toBeEnabled()
  })

  it('disables button and shows red counter when input exceeds 500 chars', async () => {
    const user = userEvent.setup()
    render(<InputPanel onTranslate={vi.fn()} isLoading={false} />)
    await user.type(screen.getByRole('textbox'), 'a'.repeat(501))
    expect(screen.getByRole('button', { name: /^translate$/i })).toBeDisabled()
    const counter = screen.getByText(/501\s*\/\s*500/)
    expect(counter).toHaveClass('text-red-500')
  })

  it('shows spinner text and disables button when loading', () => {
    render(<InputPanel onTranslate={vi.fn()} isLoading={true} />)
    expect(screen.getByRole('button', { name: /translating/i })).toBeDisabled()
  })

  it('calls onTranslate with the input value on button click', async () => {
    const onTranslate = vi.fn()
    const user = userEvent.setup()
    render(<InputPanel onTranslate={onTranslate} isLoading={false} />)
    await user.type(screen.getByRole('textbox'), 'I ate a sandwich')
    await user.click(screen.getByRole('button', { name: /^translate$/i }))
    expect(onTranslate).toHaveBeenCalledWith('I ate a sandwich')
  })
})
