// src/components/Header.tsx
function SandwichIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
      <path d="M4 13C4 8.582 9.373 5 16 5C22.627 5 28 8.582 28 13V14H4V13Z" fill="#F5A623"/>
      <ellipse cx="11" cy="9.5" rx="1.2" ry="0.7" fill="#D4861E" transform="rotate(-15 11 9.5)"/>
      <ellipse cx="16" cy="8.2" rx="1.2" ry="0.7" fill="#D4861E" transform="rotate(5 16 8.2)"/>
      <ellipse cx="21" cy="9.5" rx="1.2" ry="0.7" fill="#D4861E" transform="rotate(15 21 9.5)"/>
      <path d="M2 14C6 12 10 15 16 14C22 13 26 12 30 14V16C26 14 22 15 16 16C10 17 6 14 2 16V14Z" fill="#5CB85C"/>
      <rect x="2" y="16" width="28" height="4" rx="2" fill="#C0622B"/>
      <rect x="1" y="20" width="30" height="2.5" rx="1" fill="#F5C842"/>
      <path d="M4 22.5H28V25C28 28.314 22.627 31 16 31C9.373 31 4 28.314 4 25V22.5Z" fill="#F5A623"/>
    </svg>
  )
}

export default function Header() {
  return (
    <header className="px-6 py-4 border-b border-[#004182]" style={{ backgroundColor: '#0A66C2' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SandwichIcon />
          <div>
            <div className="text-2xl font-bold text-white tracking-tight leading-tight">Sammich</div>
            <div className="text-sm text-blue-200 leading-tight">Plain English → LinkedIn</div>
          </div>
        </div>
        <p className="hidden sm:block text-sm text-blue-200 italic">
          For when your sandwich deserves a platform.
        </p>
      </div>
    </header>
  )
}
