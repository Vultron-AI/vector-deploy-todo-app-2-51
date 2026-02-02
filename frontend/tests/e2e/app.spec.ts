/**
 * E2E Tests for Team Task Tracker
 *
 * These tests capture screenshots for visual validation.
 *
 * Required screenshots:
 * - MainPage.png: Main task tracker page with task list and form
 * - LandingPage.png: Landing page (same as main since no auth)
 */

import { test, expect } from '@playwright/test'
import { mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// DO NOT CHANGE THESE NAMES
const MAIN_PAGE_SCREENSHOT_NAME = 'MainPage'
const LANDING_PAGE_SCREENSHOT_NAME = 'LandingPage'

// Ensure screenshots directory exists (ESM-compatible)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const screenshotsDir = join(__dirname, '..', 'screenshots')
if (!existsSync(screenshotsDir)) {
  mkdirSync(screenshotsDir, { recursive: true })
}

test.describe('Team Task Tracker E2E Tests', () => {
  /**
   * Landing Page Test
   * Since the app has no authentication, the landing page is the main page.
   */
  test('captures LandingPage screenshot', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    // Wait for the user selector to be visible (indicates app has loaded)
    await expect(page.getByTestId('nav.user-selector')).toBeVisible()

    await page.screenshot({
      path: join(screenshotsDir, LANDING_PAGE_SCREENSHOT_NAME + '.png'),
      fullPage: true,
    })

    await expect(page).toHaveTitle(/.+/)
  })

  /**
   * Main Page Test
   * Verifies the task list, form, and user selector are visible
   */
  test('captures MainPage screenshot', async ({ page }) => {
    await page.goto('/')

    await page.waitForLoadState('networkidle')

    // Wait for key elements to be visible
    await expect(page.getByTestId('nav.user-selector')).toBeVisible()
    await expect(page.getByTestId('tasks.form.title')).toBeVisible()
    await expect(page.getByTestId('tasks.form.submit')).toBeVisible()

    // The task list should show empty state or items
    const taskList = page.getByTestId('tasks.list')
    const emptyState = page.getByTestId('tasks.list.empty-state')

    // Either the task list or empty state should be visible
    const hasTaskList = await taskList.isVisible().catch(() => false)
    const hasEmptyState = await emptyState.isVisible().catch(() => false)
    expect(hasTaskList || hasEmptyState).toBe(true)

    await page.screenshot({
      path: join(screenshotsDir, MAIN_PAGE_SCREENSHOT_NAME + '.png'),
      fullPage: true,
    })

    await expect(page).toHaveTitle(/.+/)
  })
})
