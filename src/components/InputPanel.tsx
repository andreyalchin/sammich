'use client'

import { useState } from 'react'

const MAX_LENGTH = 500

interface InputPanelProps {
  onTranslate: (input: string) => void
  isLoading: boolean
}

export default function InputPanel({ onTranslate, isLoading }: InputPanelProps) {
  const [value, setValue] = useState('')

  const isOverLimit = value.length > MAX_LENGTH
  const isEmpty = value.trim().length === 0
  const isDisabled = isEmpty || isOverLimit || isLoading

  return (
    <div className="flex flex-col h-full">
      <textarea
        className="flex-1 w-full resize-none p-4 text-gray-800 placeholder-gray-400 focus:outline-none text-base"
        placeholder="Type anything… (e.g. 'I ate a sandwich')"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100">
        <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
          {value.length} / {MAX_LENGTH}
        </span>
        <button
          onClick={() => onTranslate(value)}
          disabled={isDisabled}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-md font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Translating…
            </>
          ) : (
            'Translate'
          )}
        </button>
      </div>
    </div>
  )
}
