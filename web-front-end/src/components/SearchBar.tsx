'use client'

import { SearchIcon } from './Icons'

interface SearchBarProps {
  placeholder?: string
  onSearch: (term: string) => void
  value?: string
  className?: string
}

export default function SearchBar({
  placeholder = 'Search student...',
  onSearch,
  value: initialValue = '',
  className = '',
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  return (
    <div className={`relative w-full ${className}`}>
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#454a54]" />
      <input
        type="text"
        value={initialValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-[#c9ced9] bg-[#fbfcff] pl-10 pr-4 text-sm font-normal text-[#25272c] shadow-sm outline-none placeholder:text-[#707786] focus:border-[#9fa8b8] focus:bg-white"
      />
    </div>
  )
}
