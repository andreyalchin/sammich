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
      <div className="flex flex-1 justify-center px-4 py-8">
        <main className="w-full max-w-3xl flex flex-col md:flex-row md:items-stretch border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col">
            <InputPanel onTranslate={handleTranslate} isLoading={isLoading} />
          </div>
          <div className="md:w-1/2 flex flex-col">
            <OutputPanel result={result} error={error} userInput={userInput} />
          </div>
        </main>
      </div>
    </div>
  )
}
