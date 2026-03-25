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
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <div className="flex flex-col md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 bg-white min-h-[300px] md:min-h-0">
          <InputPanel onTranslate={handleTranslate} isLoading={isLoading} />
        </div>
        <div className="flex flex-col md:w-1/2 bg-white min-h-[300px] md:min-h-0">
          <OutputPanel result={result} error={error} userInput={userInput} />
        </div>
      </main>
    </div>
  )
}
