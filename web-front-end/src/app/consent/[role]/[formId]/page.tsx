import ConsentWorkspace from '@/features/consent/components/ConsentWorkspace'
import { notFound } from 'next/navigation'

export default async function ConsentDetailsPage({ params }: { params: Promise<{ role: string; formId: string }> }) {
  const { role, formId } = await params
  if (role !== 'teacher' && role !== 'school-admin') notFound()
  return <ConsentWorkspace role={role} view="details" formId={formId} />
}
