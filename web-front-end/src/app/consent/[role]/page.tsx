import ConsentWorkspace from '@/features/consent/components/ConsentWorkspace'
import { notFound } from 'next/navigation'

export default async function ConsentPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  if (role !== 'teacher' && role !== 'school-admin') notFound()
  return <ConsentWorkspace role={role} />
}
