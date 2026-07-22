import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
