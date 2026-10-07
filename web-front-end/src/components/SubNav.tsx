'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface SubNavItem {
  label: string
  href: string
}

export default function SubNav({ items }: { items: SubNavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="w-full bg-[#073b78] shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex h-14 w-max max-w-full items-center justify-center overflow-x-auto px-8">
        {items.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-full items-center whitespace-nowrap px-5 text-base transition-colors ${
                active
                  ? 'bg-[#007c6d] font-semibold text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}