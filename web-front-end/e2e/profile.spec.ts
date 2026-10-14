import { test, expect, type Page } from '@playwright/test'

const roles = [
  { label: 'Super Admin', path: '/profile/super-admin', name: 'Super Admin', roleTitle: 'Super Administrator', id: 'SA-0001' },
  { label: 'School Admin', path: '/profile/school-admin', name: 'Admin User', roleTitle: 'School Administrator', id: 'ADM-2026-001' },
  { label: 'Teacher', path: '/profile/teacher', name: 'Mrs. Thompson', roleTitle: 'Mathematics Teacher', id: 'TCH-2026-047' },
]

const heading = (page: Page, name: string) => page.getByRole('heading', { name, exact: true })
const nameInput = (page: Page) => page.locator('label:has-text("Full Name") + input')

async function fillPasswords(page: Page, current: string, next: string, confirm: string) {
  const fields = page.locator('input[type="password"]')
  await fields.nth(0).fill(current)
  await fields.nth(1).fill(next)
  await fields.nth(2).fill(confirm)
}

const invalidEdits = [
  { field: 'Full Name', label: 'Full Name', value: '', message: 'Full name is required.' },
  { field: 'Full Name', label: 'Full Name', value: '     ', message: 'Full name is required.' },
  { field: 'Email Address', label: 'Email Address', value: 'abc', message: 'Enter a valid email address.' },
  { field: 'Phone Number', label: 'Phone Number', value: 'hello', message: 'Phone number can only contain digits' },
]

const badPasswords = [
  { why: 'all fields empty', cur: '', next: '', conf: '', message: 'Please fill in all fields.' },
  { why: 'new password too short', cur: 'OldPass123', next: 'abc12', conf: 'abc12', message: /at least 8 characters/ },
  { why: '7 characters (boundary)', cur: 'OldPass123', next: 'Abcd123', conf: 'Abcd123', message: /at least 8 characters/ },
  { why: 'only spaces', cur: 'OldPass123', next: '        ', conf: '        ', message: /at least 8 characters/ },
  { why: 'confirmation does not match', cur: 'OldPass123', next: 'NewPass123', conf: 'NewPass456', message: 'New password and confirmation do not match.' },
  { why: 'same as current password', cur: 'Test1234', next: 'Test1234', conf: 'Test1234', message: 'New password must be different from your current password.' },
]

const goodPasswords = [
  { why: 'valid values', next: 'NewPass123' },
  { why: '8 characters (boundary)', next: 'Abcd1234' },
]

for (const role of roles) {
  test.describe(`${role.label} profile`, () => {
    test.beforeEach(async ({ page }) => {
      // No backend yet: make the profile API fail so the page uses its mock data
      await page.route('**/api/profile/**', (route) => route.abort())
      await page.goto(role.path)
      await expect(page.getByRole('heading', { name: 'My Profile' })).toBeVisible({ timeout: 60_000 })
    })

    test('shows the header card and key details', async ({ page }) => {
      await expect(heading(page, role.name)).toBeVisible()
      await expect(page.getByText(role.roleTitle).first()).toBeVisible()
      await expect(page.getByText(role.id).first()).toBeVisible()
    })

    // ---------- Edit Profile ----------
    test('Edit Profile opens with the current name filled in', async ({ page }) => {
      await page.getByRole('button', { name: 'Edit Profile' }).click()
      await expect(heading(page, 'Edit Profile')).toBeVisible()
      await expect(nameInput(page)).toHaveValue(role.name)
    })

    test('saving a valid name updates the header', async ({ page }) => {
      await page.getByRole('button', { name: 'Edit Profile' }).click()
      await nameInput(page).fill('Test Person')
      await page.getByRole('button', { name: 'Save Changes' }).click()
      await expect(heading(page, 'Test Person')).toBeVisible()
      await expect(heading(page, 'Edit Profile')).toBeHidden()
    })

    test('Cancel discards the change', async ({ page }) => {
      await page.getByRole('button', { name: 'Edit Profile' }).click()
      await nameInput(page).fill('Should Not Save')
      await page.getByRole('button', { name: 'Cancel' }).click()
      await expect(heading(page, role.name)).toBeVisible()
      await expect(page.getByText('Should Not Save')).toHaveCount(0)
    })

    test('a reload brings back the original mock data', async ({ page }) => {
      await page.getByRole('button', { name: 'Edit Profile' }).click()
      await nameInput(page).fill('Temp Name')
      await page.getByRole('button', { name: 'Save Changes' }).click()
      await expect(heading(page, 'Temp Name')).toBeVisible()
      await page.reload()
      await expect(heading(page, role.name)).toBeVisible({ timeout: 60_000 })
    })

    for (const c of invalidEdits) {
      test(`blocks ${c.field} = "${c.value}"`, async ({ page }) => {
        await page.getByRole('button', { name: 'Edit Profile' }).click()
        await page.locator(`label:has-text("${c.label}") + input`).fill(c.value)
        await page.getByRole('button', { name: 'Save Changes' }).click()
        await expect(page.getByText(c.message)).toBeVisible()
        await expect(heading(page, 'Edit Profile')).toBeVisible()
      })
    }

    test('Full Name stops at 40 characters', async ({ page }) => {
      await page.getByRole('button', { name: 'Edit Profile' }).click()
      const input = nameInput(page)
      await input.fill('')
      await input.pressSequentially('A'.repeat(50))
      await expect(input).toHaveValue('A'.repeat(40))
    })

    test('Esc closes the edit modal without saving', async ({ page }) => {
      await page.getByRole('button', { name: 'Edit Profile' }).click()
      await nameInput(page).fill('Should Not Save')
      await page.keyboard.press('Escape')
      await expect(heading(page, 'Edit Profile')).toBeHidden()
      await expect(page.getByText('Should Not Save')).toHaveCount(0)
    })

    test('clicking outside the edit modal does not close it', async ({ page }) => {
      await page.getByRole('button', { name: 'Edit Profile' }).click()
      await page.mouse.click(5, 5)
      await expect(heading(page, 'Edit Profile')).toBeVisible()
    })

    // ---------- Change Password ----------
    for (const c of badPasswords) {
      test(`password change rejected: ${c.why}`, async ({ page }) => {
        await page.getByRole('button', { name: 'Change Password' }).click()
        await fillPasswords(page, c.cur, c.next, c.conf)
        await page.getByRole('button', { name: 'Save Password' }).click()
        await expect(page.getByText(c.message)).toBeVisible()
        await expect(heading(page, 'Change Password')).toBeVisible()
      })
    }

    for (const c of goodPasswords) {
      test(`password change accepted: ${c.why}`, async ({ page }) => {
        let popupText = ''
        page.once('dialog', async (dialog) => {
          popupText = dialog.message()
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'Change Password' }).click()
        await fillPasswords(page, 'OldPass123', c.next, c.next)
        await page.getByRole('button', { name: 'Save Password' }).click()
        await expect(heading(page, 'Change Password')).toBeHidden()
        expect(popupText).toContain('Password changed successfully')
      })
    }

    test('Cancel closes the password modal with no popup', async ({ page }) => {
      let popupSeen = false
      page.on('dialog', async (dialog) => {
        popupSeen = true
        await dialog.dismiss()
      })
      await page.getByRole('button', { name: 'Change Password' }).click()
      await fillPasswords(page, 'abc', 'def', 'ghi')
      await page.getByRole('button', { name: 'Cancel' }).click()
      await expect(heading(page, 'Change Password')).toBeHidden()
      expect(popupSeen).toBe(false)
    })

    test('Esc closes the password modal', async ({ page }) => {
      await page.getByRole('button', { name: 'Change Password' }).click()
      await page.keyboard.press('Escape')
      await expect(heading(page, 'Change Password')).toBeHidden()
    })

    // ---------- Two-factor ----------
    test('two-factor status is display-only', async ({ page }) => {
      const status = page.getByText('Enabled ✓')
      await expect(status).toBeVisible()
      await status.click()
      await expect(status).toBeVisible()
      await expect(page.getByText('Disabled')).toHaveCount(0)
    })
  })
}

// ---------- Loading state ----------
test('shows a loading message while the profile is being fetched', async ({ page }) => {
  await page.route('**/api/profile/**', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await route.abort()
  })
  await page.goto('/profile/teacher')
  await expect(page.getByText('Loading profile...')).toBeVisible()
  await expect(heading(page, 'Mrs. Thompson')).toBeVisible({ timeout: 60_000 })
})

// ---------- Integration: the page renders what the API returns ----------
test('renders the data returned by the profile API', async ({ page }) => {
  await page.route('**/api/profile/me*', (route) =>
    route.fulfill({
      json: {
        id: 'T-1',
        fullName: 'API Teacher',
        roleTitle: 'Test Role',
        roleBadge: 'Teacher',
        summaryLine: 'Returned by the API',
        avatarInitial: 'A',
        quickStats: [],
        sections: [],
        security: { passwordMasked: '••••••••', twoFactorEnabled: true },
        lastUpdated: 'now',
      },
    })
  )
  await page.goto('/profile/teacher')
  await expect(heading(page, 'API Teacher')).toBeVisible({ timeout: 60_000 })
})