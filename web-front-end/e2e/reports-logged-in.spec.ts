import { test, expect, type Page } from '@playwright/test'

const SCHOOL_ADMIN = {
  email: 'testuser1@vidyaconnect.local',
  password: process.env.SCHOOL_ADMIN_PASSWORD ?? '',
}
const SUPER_ADMIN = {
  email: 'testuser1admin@vidyaconnect.local',
  password: process.env.SUPER_ADMIN_PASSWORD ?? '',
}

async function login(page: Page, user: { email: string; password: string }) {
  await page.goto('/login')
  await page.locator('#email').fill(user.email)
  await page.locator('#password').fill(user.password)
  await page.getByRole('button', { name: 'Sign In to Portal' }).click()
  await page.waitForURL(/\/dashboard\//)
}

test.describe('School Admin reports', () => {
  test.skip(!SCHOOL_ADMIN.password, 'SCHOOL_ADMIN_PASSWORD is not set')
  test.setTimeout(60_000)

  test('page loads with real attendance data', async ({ page }) => {
    await login(page, SCHOOL_ADMIN)
    const apiCall = page.waitForResponse(
      (r) => r.url().includes('/reports/school-admin/attendance') && r.status() === 200
    )
    await page.goto('/reports/school-admin')
    await apiCall

    await expect(page.getByText('School reports', { exact: true })).toBeVisible()
    await expect(page.getByText('Latest attendance')).toBeVisible()
    await expect(page.getByText('Attendance trend (%)')).toBeVisible()
    await expect(page.getByText('Class vs class attendance (%)')).toBeVisible()
    await expect(page.getByText('Attendance calendar heatmap')).toBeVisible()
    await expect(page.getByText('Attendance status split')).toBeVisible()
    await expect(page.getByText('Students below 80% attendance')).toBeVisible()
  })

  test('date range filter calls the API with the chosen range', async ({ page }) => {
    await login(page, SCHOOL_ADMIN)
    await page.goto('/reports/school-admin')
    await expect(page.getByText('Attendance trend (%)')).toBeVisible()

    const apiCall = page.waitForResponse(
      (r) => r.url().includes('days=7') && r.status() === 200
    )
    await page.locator('select').nth(1).selectOption('7d')
    await apiCall
  })

  test('class filter calls the API with a classId', async ({ page }) => {
    await login(page, SCHOOL_ADMIN)
    await page.goto('/reports/school-admin')
    await expect(page.getByText('Attendance trend (%)')).toBeVisible()

    const apiCall = page.waitForResponse(
      (r) => r.url().includes('classId=') && r.status() === 200
    )
    await page.locator('select').first().selectOption({ index: 1 })
    await apiCall
  })

  test('Export CSV downloads a file', async ({ page }) => {
    await login(page, SCHOOL_ADMIN)
    await page.goto('/reports/school-admin')
    await expect(page.getByText('Students below 80% attendance')).toBeVisible()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /export csv/i }).first().click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.csv$/)
  })

  test('is redirected away from the Super Admin reports page', async ({ page }) => {
    await login(page, SCHOOL_ADMIN)
    await page.goto('/reports/super-admin')
    await expect(page).toHaveURL(/\/dashboard\/school-admin/)
  })
})

test.describe('Super Admin reports', () => {
  test.skip(!SUPER_ADMIN.password, 'SUPER_ADMIN_PASSWORD is not set')
  test.setTimeout(60_000)

  test('page loads with real system data', async ({ page }) => {
    await login(page, SUPER_ADMIN)
    const apiCall = page.waitForResponse(
      (r) => r.url().includes('/reports/super-admin/summary') && r.status() === 200
    )
    await page.goto('/reports/super-admin')
    await apiCall

    await expect(page.getByText('System reports', { exact: true })).toBeVisible()
    await expect(page.getByText('Total schools')).toBeVisible()
    await expect(page.getByText('Users by role')).toBeVisible()
    await expect(page.getByText('New schools per month')).toBeVisible()
    await expect(page.getByText('Schools by registration status')).toBeVisible()
    await expect(page.getByText('School adoption (accounts created vs active)')).toBeVisible()
  })

  test('Export CSV downloads a file', async ({ page }) => {
    await login(page, SUPER_ADMIN)
    await page.goto('/reports/super-admin')
    await expect(page.getByText('School adoption (accounts created vs active)')).toBeVisible()

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /export csv/i }).first().click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/\.csv$/)
  })

  test('is redirected away from the School Admin reports page', async ({ page }) => {
    await login(page, SUPER_ADMIN)
    await page.goto('/reports/school-admin')
    await expect(page).toHaveURL(/\/dashboard\/admin/)
  })
})
