import { test, expect } from '@playwright/test'

test.describe('BMI Application E2E Tests', () => {

  // Test Case 1: Homepage Verification
  test('should load homepage with correct title and buttons', async ({ page }) => {
    await page.goto('/')
    // Verify title or main heading
    await expect(page.getByRole('heading', { name: 'BMI Web Application' })).toBeVisible()
    await expect(page.getByText('Track your health journey')).toBeVisible()

    // Verify navigation buttons
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Register' })).toBeVisible()
  })

  // Test Case 2: Navigation to Register Page
  test('should navigate to register page from home', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Register')
    await expect(page).toHaveURL(/\/register/)
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  })

  // Test Case 3: Navigation to Login Page
  test('should navigate to login page from home', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Login')
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  })

  // Test Case 4: Register New User (Happy Path)
  test('should allow a new user to register successfully', async ({ page }) => {
    const timestamp = Date.now()
    const username = `user_${timestamp}`
    const password = 'password123'

    await page.goto('/register')

    // Fill form
    await page.fill('input[type="text"]', username) // Username is first input
    // Display name is optional, skipping or filling
    // Password is last input
    await page.fill('input[type="password"]', password)

    // Submit
    await page.click('button[type="submit"]')

    // Expect redirect to login page
    await expect(page).toHaveURL(/\/login/)

    // Verify we can see the login form now
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  })

  // Test Case 5: Login with Invalid Credentials
  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('input[type="text"]', 'non_existent_user')
    await page.fill('input[type="password"]', 'wrong_password')

    await page.click('button[type="submit"]')

    // Expect error message to appear
    // Based on code: <p className="text-red-500 text-center">{error}</p>
    // The error message from API for invalid user is likely "Invalid credentials" or similar.
    // We can just check for any text-red-500 or just the presence of an error message container if we knew the specific text.
    // Let's check for "Login failed" or "Invalid" or just generic error visibility.
    // The component sets error state.

    // We'll wait for the error message. 
    // Since we don't know the exact API response for non-existent user (probably 401/400), we expect *some* error text.
    // Looking at Login page code: setError(data.error || "Login failed");
    // We can check for "Login failed" or whatever the API returns.
    // Let's look for a red text element.
    const errorLocator = page.locator('.text-red-500')
    await expect(errorLocator).toBeVisible()
  })

  // Test Case 6: Login and Record BMI
  test('should login and record new BMI entry', async ({ page }) => {
    // 1. Register a new user to ensure clean state
    const timestamp = Date.now()
    const username = `bmi_user_${timestamp}`
    const password = 'password123'

    await page.goto('/register')
    await page.fill('input[type="text"]', username)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/login/)

    // 2. Login
    await page.fill('input[type="text"]', username)
    await page.fill('input[type="password"]', password)
    await page.click('button[type="submit"]')

    // Expect redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByRole('heading', { name: 'BMI Dashboard' })).toBeVisible()

    // 3. Add New Record
    // Looking for inputs: Weight (kg), Height (cm), Note
    // Based on dashboard/page.tsx, inputs are labeled.
    // We can use getByLabel or fill by input type/order.
    // Inputs: Weight (number), Height (number), Note (text)

    // Using placeholders or labels if available. 
    // Code: <label>Weight (kg)</label><input type="number" ... />
    await page.getByLabel('Weight (kg)').fill('70')
    await page.getByLabel('Height (cm)').fill('175')
    await page.getByLabel('Note').fill('Test Record')

    await page.click('button:has-text("Add Record")')

    // 4. Verify Record appears
    // The dashboard updates list and "Latest Status"
    // Check "Latest Status" section
    await expect(page.getByText('Latest Status')).toBeVisible()

    // Calculate expected BMI: 70 / (1.75 * 1.75) = 22.86
    // The display shows formatted number.
    // Check if 22.86 is visible. Use .first() or scope to specific container if multiple exist (e.g. table and card)
    await expect(page.getByText('22.86').first()).toBeVisible()

    // Check weight display - might also appear multiple times
    await expect(page.getByText('70 kg').first()).toBeVisible()
  })

})
