import { test, expect } from '@playwright/test'

test.describe('Reports pages when logged out', () => {
  test('Super Admin reports redirects to login', async ({ page }) => {
    await page.goto('/reports/super-admin')
    await expect(page).toHaveURL(/\/login/)
  })

  test('School Admin reports redirects to login', async ({ page }) => {
    await page.goto('/reports/school-admin')
    await expect(page).toHaveURL(/\/login/)
  })
})
