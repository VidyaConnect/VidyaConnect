import type { Metadata } from 'next'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './globals.css'
import { AuthProvider } from '@/features/auth/context/authProvider'

config.autoAddCss = false

export const metadata: Metadata = {
  title: 'VidyaConnect - School Management Portal',
  description: 'Complete school management and student information system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  )
}
