import { test, expect } from '@playwright/test'

test.describe('Attendance API smoke checks', () => {
  const baseUrl = process.env.ATTENDANCE_API_URL || 'http://localhost:3003'

  test('GET /attendance/summary responds with a valid summary payload', async ({ request }) => {
    const response = await request.get(`${baseUrl}/attendance/summary?classId=class-8a`)

    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body).toHaveProperty('className')
    expect(body).toHaveProperty('present')
    expect(body).toHaveProperty('absent')
    expect(body).toHaveProperty('late')
    expect(body).toHaveProperty('notMarked')
    expect(body).toHaveProperty('progress')
  })

  test('GET /attendance/history/student-001 returns a history array', async ({ request }) => {
    const response = await request.get(`${baseUrl}/attendance/history/student-001`)

    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(Array.isArray(body)).toBeTruthy()
  })

  test('POST /attendance/roster/student-001 persists status updates', async ({ request }) => {
    const response = await request.post(`${baseUrl}/attendance/roster/student-001`, {
      data: { status: 'ABSENT' },
    })

    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body).toHaveProperty('success', true)
    expect(body).toHaveProperty('data')
    expect(body.data).toHaveProperty('status', 'absent')
  })
})
