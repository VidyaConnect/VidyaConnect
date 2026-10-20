export type ConsentStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED'

export type ConsentForm = {
  id: string
  title: string
  description: string
  audience: string
  instructions: string | null
  classId: string | null
  scope: 'CLASS' | 'SCHOOL'
  status: ConsentStatus
  deadline: string
  createdAt: string
  creator: string
  recipients: number
  accepted: number
  declined: number
  pending: number
  publishedAt: string | null
  closedAt: string | null
}
