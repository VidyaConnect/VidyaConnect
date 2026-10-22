'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/hooks/userAuth'

export default function AssignmentPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth()
  const router = useRouter()
  useEffect(() => { if (isInitialized && (!user || user.role !== 'TEACHER')) router.replace('/login') }, [isInitialized, user, router])
  if (!isInitialized || !user || user.role !== 'TEACHER') return null
  return <>{children}</>
}
