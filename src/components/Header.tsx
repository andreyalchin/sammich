// src/components/Header.tsx
export default function Header() {
  return (
    <header className="flex items-center px-6 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-gray-900 tracking-tight">Sammich</span>
        <span className="text-sm text-gray-500">English → LinkedIn</span>
      </div>
    </header>
  )
}
