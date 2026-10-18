export type ConsentStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED'

export type ConsentForm = {
  id: string
  title: string
  description: string
  audience: string
  scope: 'CLASS' | 'SCHOOL'
  status: ConsentStatus
  deadline: string
  createdAt: string
  creator: string
  recipients: number
  accepted: number
  declined: number
  pending: number
}

export const demoConsentForms: ConsentForm[] = [
  {
    id: 'zoo-visit',
    title: 'Field Trip: City Zoo Visit',
    description: 'Please review the details and provide permission for the upcoming Grade 5 educational visit.',
    audience: 'Grade 5 • All sections',
    scope: 'SCHOOL',
    status: 'ACTIVE',
    deadline: '2026-11-04',
    createdAt: '2026-10-14',
    creator: 'Admin User',
    recipients: 124,
    accepted: 83,
    declined: 4,
    pending: 37,
  },
  {
    id: 'medical-waiver',
    title: 'Annual Medical Information Waiver',
    description: 'A yearly confirmation of emergency contact and medical information for school records.',
    audience: 'All students',
    scope: 'SCHOOL',
    status: 'ACTIVE',
    deadline: '2026-11-10',
    createdAt: '2026-10-10',
    creator: 'Admin User',
    recipients: 847,
    accepted: 402,
    declined: 9,
    pending: 436,
  },
  {
    id: 'sports-day',
    title: 'Inter-school Sports Day',
    description: 'Permission to participate in the annual athletics and sports day programme.',
    audience: 'Grade 8A',
    scope: 'CLASS',
    status: 'DRAFT',
    deadline: '2026-11-18',
    createdAt: '2026-10-16',
    creator: 'Mrs. Thompson',
    recipients: 31,
    accepted: 0,
    declined: 0,
    pending: 31,
  },
  {
    id: 'photography',
    title: 'School Events Photography',
    description: 'Consent for students to appear in school event photography and internal newsletters.',
    audience: 'Grade 3B',
    scope: 'CLASS',
    status: 'CLOSED',
    deadline: '2026-09-30',
    createdAt: '2026-09-04',
    creator: 'Mrs. Thompson',
    recipients: 28,
    accepted: 21,
    declined: 5,
    pending: 2,
  },
]
