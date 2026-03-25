// src/app/page.tsx
'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import InputPanel from '@/components/InputPanel'
import OutputPanel from '@/components/OutputPanel'
import { TranslateResponse } from '@/types'

export default function Home() {
  const [result, setResult] = useState<TranslateResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [userInput, setUserInput] = useState('')

  const handleTranslate = async (input: string) => {
    setResult(null)
    setError(null)
    setIsLoading(true)
    setUserInput(input)

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Try again.')
        return
      }

      setResult(data)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-col md:flex-row md:items-stretch border-b border-gray-200">
        <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 bg-white">
          <InputPanel onTranslate={handleTranslate} isLoading={isLoading} />
        </div>
        <div className="md:w-1/2 bg-white">
          <OutputPanel result={result} error={error} userInput={userInput} />
        </div>
      </main>
    </div>
  )
}
