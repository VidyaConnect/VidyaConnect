import { test, expect, type Page, type APIRequestContext } from '@playwright/test'

const API = 'http://localhost:3001/api'

const roles = [
  { label: 'Teacher', env: 'TEACHER', path: '/profile/teacher', name: 'Test Teacher' },
  { label: 'School Admin', env: 'SCHOOLADMIN', path: '/profile/school-admin', name: 'Test SchoolAdmin' },
  { label: 'Super Admin', env: 'ADMIN', path: '/profile/super-admin', name: 'Test Admin' },
]

const creds = (env: string) => ({
  email: process.env[`E2E_${env}_EMAIL`]!,
  password: process.env[`E2E_${env}_PASSWORD`]!,
})

async function apiLogin(request: APIRequestContext, email: string, password: string) {
  const res = await request.post(`${API}/auth/login`, { data: { email, password } })
  expect(res.ok(), 'login should succeed').toBeTruthy()
  return (await res.json()).data
}

async function signIn(page: Page, email: string, password: string) {
  const data = await apiLogin(page.request, email, password)
  await page.addInitScript((d) => {
    localStorage.setItem('accessToken', d.accessToken)
    localStorage.setItem('refreshToken', d.refreshToken)
    localStorage.setItem('user', JSON.stringify(d.user))
  }, data)
  return data
}

const heading = (page: Page, name: string) => page.getByRole('heading', { name, exact: true })
const field = (page: Page, label: string) => page.locator(`label:has-text("${label}") + input`)

for (const r of roles) {
  test.describe(`${r.label} profile (real API)`, () => {
    test.beforeEach(async ({ page }) => {
      const { email, password } = creds(r.env)
      await signIn(page, email, password)
      await page.goto(r.path)
      await expect(heading(page, 'My Profile')).toBeVisible({ timeout: 60_000 })
    })

    test('shows the signed-in user\'s real profile', async ({ page }) => {
      await expect(heading(page, r.name)).toBeVisible()
      await expect(page.getByText(creds(r.env).email).first()).toBeVisible()
    })

    test('edit form offers name, email and phone only', async ({ page }) => {
      await page.getByRole('button', { name: 'Edit Profile' }).click()
      await expect(field(page, 'Full Name')).toBeVisible()
      await expect(field(page, 'Email Address')).toBeVisible()
      await expect(field(page, 'Phone Number')).toBeVisible()
      await expect(page.locator('form input[type="text"]')).toHaveCount(3)
    })

    test('a saved name survives a reload, then is restored', async ({ page }) => {
      const temp = `${r.name} E2E`
      await page.getByRole('button', { name: 'Edit Profile' }).click()
      await field(page, 'Full Name').fill(temp)
      await page.getByRole('button', { name: 'Save Changes' }).click()
      await expect(heading(page, temp)).toBeVisible()
      await page.reload()
      await expect(heading(page, temp)).toBeVisible({ timeout: 60_000 })

      await page.getByRole('button', { name: 'Edit Profile' }).click()
      await field(page, 'Full Name').fill(r.name)
      await page.getByRole('button', { name: 'Save Changes' }).click()
      await expect(heading(page, r.name)).toBeVisible()
    })

    test('blank name and bad email are blocked', async ({ page }) => {
      await page.getByRole('button', { name: 'Edit Profile' }).click()
      await field(page, 'Full Name').fill('')
      await field(page, 'Email Address').fill('abc')
      await page.getByRole('button', { name: 'Save Changes' }).click()
      await expect(page.getByText('Full name is required.')).toBeVisible()
      await expect(page.getByText('Enter a valid email address.')).toBeVisible()
    })

    test('changing the email asks for the current password', async ({ page }) => {
      await page.getByRole('button', { name: 'Edit Profile' }).click()
      await field(page, 'Email Address').fill('someone.else@vidyaconnect.local')
      await expect(page.getByText('Current Password')).toBeVisible()
      await page.getByRole('button', { name: 'Save Changes' }).click()
      await expect(page.getByText('Enter your current password to change your email.')).toBeVisible()
    })

    test('password change: wrong current password is rejected', async ({ page }) => {
      let popup = ''
      page.once('dialog', async (d) => { popup = d.message(); await d.accept() })
      await page.getByRole('button', { name: 'Change Password' }).click()
      const f = page.locator('input[type="password"]')
      await f.nth(0).fill('definitely-wrong')
      await f.nth(1).fill('NewPass123!')
      await f.nth(2).fill('NewPass123!')
      await page.getByRole('button', { name: 'Save Password' }).click()
      await expect.poll(() => popup).toContain('Current password is incorrect')
      await expect(heading(page, 'Change Password')).toBeVisible() // modal stays open
    })

    test('password change works and is restored', async ({ page, request }) => {
      const { email, password } = creds(r.env)
      const temp = 'E2eTemp#2026'
      let popup = ''
      page.once('dialog', async (d) => { popup = d.message(); await d.accept() })
      await page.getByRole('button', { name: 'Change Password' }).click()
      const f = page.locator('input[type="password"]')
      await f.nth(0).fill(password)
      await f.nth(1).fill(temp)
      await f.nth(2).fill(temp)
      await page.getByRole('button', { name: 'Save Password' }).click()
      await expect.poll(() => popup).toContain('Password changed successfully')

      // the temporary password now works; put the original back
      const data = await apiLogin(request, email, temp)
      const back = await request.put(`${API}/profile/change-password`, {
        headers: { Authorization: `Bearer ${data.accessToken}` },
        data: { currentPassword: temp, newPassword: password },
      })
      expect(back.ok()).toBeTruthy()
      await apiLogin(request, email, password)
    })
  })
}

test('a teacher cannot use the Super Admin profile page', async ({ page }) => {
  const { email, password } = creds('TEACHER')
  await signIn(page, email, password)
  await page.goto('/profile/super-admin')
  await expect(page.getByText('This page is for Super Admin accounts only.')).toBeVisible({ timeout: 60_000 })
})

test('logged-out visitors end up on the login page', async ({ page }) => {
  await page.goto('/profile/teacher')
  await expect(page).toHaveURL(/\/login/, { timeout: 30_000 })
})
