
import { test, expect } from '@playwright/test'

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': '*',
  'access-control-allow-methods': '*',
}

const initialProfile = {
  id: 'PAR-TEST0001',
  fullName: 'Test Parent',
  roleTitle: 'Parent / Guardian',
  avatarInitial: 'T',
  quickStats: [
    { label: 'Parent ID', value: 'PAR-TEST0001' },
    { label: 'Email', value: 'parent@test.lk' },
    { label: 'Phone', value: '+94 77 123 4567' },
    { label: 'Status', value: 'Active', isStatus: true },
  ],
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { label: 'Full Name', value: 'Test Parent', editable: true },
      ],
    },
    {
      title: 'Contact Information',
      fields: [
        { label: 'Email Address', value: 'parent@test.lk' },
        {
          label: 'Phone Number',
          value: '+94 77 123 4567',
          editable: true,
        },
      ],
    },
  ],
  children: [
    {
      id: 'c1',
      name: 'Seed Student One',
      className: 'Grade 9 A',
      relationship: 'Mother',
    },
  ],
  security: {
    passwordMasked: '********',
    twoFactorEnabled: false,
  },
  lastUpdated: 'now',
}

test.beforeEach(async ({ page }) => {
  // Keep mock profile data separate for each test.
  const savedProfile = structuredClone(initialProfile)

  await page.route('**/api/profile/me', async (route) => {
    const method = route.request().method()

    if (method === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: CORS })
    }

    if (method === 'PUT') {
      const body = route.request().postDataJSON()

      if (body.fullName !== undefined) {
        savedProfile.fullName = body.fullName
        savedProfile.avatarInitial = body.fullName[0] ?? ''
        savedProfile.sections[0].fields[0].value = body.fullName
      }

      if (body.phone !== undefined) {
        savedProfile.quickStats[2].value = body.phone
        savedProfile.sections[1].fields[1].value = body.phone
      }

      return route.fulfill({
        headers: CORS,
        json: { success: true, data: savedProfile },
      })
    }

    return route.fulfill({
      headers: CORS,
      json: { success: true, data: savedProfile },
    })
  })

  await page.route('**/api/profile/change-password', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: CORS })
    }


    return route.fulfill({
      status: 400,
      headers: CORS,
      json: {
        success: false,
        message: 'Current password is incorrect.',
      },
    })
  })

  await page.goto('/profile')

  // Keep the default password error for existing tests.
  // A successful-password test overrides the route separately.
})

test('shows the parent profile and children', async ({ page }) => {
  await expect(page.getByText('Parent / Guardian')).toBeVisible()
  await expect(page.getByText('Seed Student One')).toBeVisible()
  await expect(page.getByText(/Grade 9 A.*Mother/)).toBeVisible()
  await expect(page.getByText('Disabled')).toBeVisible()
})

test('edit blocks an empty name', async ({ page }) => {
  await page.getByText('Edit', { exact: true }).click()
  await page.getByPlaceholder('Full name').fill('')
  await page.getByText('Save Changes').click()
  await expect(page.getByText('Full name is required.')).toBeVisible()
})

test('edit blocks a bad phone number', async ({ page }) => {
  await page.getByText('Edit', { exact: true }).click()
  await page.getByPlaceholder('+94 77 123 4567').fill('hello')
  await page.getByText('Save Changes').click()
  await expect(page.getByText(/Use only digits/)).toBeVisible()
})

test('saving a valid name updates the header', async ({ page }) => {
  await page.getByText('Edit', { exact: true }).click()
  await page.getByPlaceholder('Full name').fill('New Name')
  await page.getByText('Save Changes').click()
  await expect(page.getByText('New Name').first()).toBeVisible()
})

test('change password shows the server error', async ({ page }) => {
  await page.getByText('Change Password').click()

  const fields = page.locator('input[type="password"]')
  await fields.nth(0).fill('OldPass12345')
  await fields.nth(1).fill('NewPass12345')
  await fields.nth(2).fill('NewPass12345')

  await page.getByText('Save Password').click()
  await expect(
    page.getByText('Current password is incorrect.'),
  ).toBeVisible()
})

test('change password rejects mismatched passwords', async ({ page }) => {
  await page.getByText('Change Password').click()

  const fields = page.locator('input[type="password"]')
  await fields.nth(0).fill('OldPass12345')
  await fields.nth(1).fill('NewPass12345')
  await fields.nth(2).fill('Different123')

  await page.getByText('Save Password').click()
  await expect(
    page.getByText('New password and confirmation do not match.'),
  ).toBeVisible()
})

test('saving a valid phone number updates the profile', async ({ page }) => {
  await page.getByText('Edit', { exact: true }).click()
  await page.getByPlaceholder('+94 77 123 4567').fill('+94 71 555 1234')
  await page.getByText('Save Changes').click()

  await expect(page.getByText('+94 71 555 1234').first()).toBeVisible()
})

test('profile changes remain after reloading', async ({ page }) => {
  await page.getByText('Edit', { exact: true }).click()
  await page.getByPlaceholder('Full name').fill('Persistent Test Name')
  await page.getByText('Save Changes').click()

  await expect(page.getByText('Persistent Test Name').first()).toBeVisible()

  await page.reload()

  await expect(page.getByText('Persistent Test Name').first()).toBeVisible()
})

test('profile remains visible at a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })

  await expect(page.getByText('Parent / Guardian')).toBeVisible()
  await expect(page.getByText('Seed Student One')).toBeVisible()
})



test('change password modal closes after a successful response', async ({ page }) => {
  await page.unroute('**/api/profile/change-password')

  await page.route('**/api/profile/change-password', async (route) => {
    if (route.request().method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: CORS })
    }

    return route.fulfill({
      status: 200,
      headers: CORS,
      json: {
        success: true,
        message: 'Password changed successfully.',
      },
    })
  })

  await page.getByText('Change Password').click()

  const fields = page.locator('input[type="password"]')
  await fields.nth(0).fill('OldPass12345')
  await fields.nth(1).fill('NewPass12345')
  await fields.nth(2).fill('NewPass12345')

  await page.getByText('Save Password').click()

  await expect(page.getByText('Save Password')).not.toBeVisible()
})


