const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.delete('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'testuser',
        name: 'Test User',
        password: 'testpassword'
      }
    })
    await page.goto('http://localhost:5173')
    await page.evaluate(() => window.localStorage.clear())
    await page.goto('http://localhost:5173') // goto lagi setelah clear, bukan reload
  })

  const login = async (page) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('testuser')
    await page.getByTestId('password').fill('testpassword')
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/login') && resp.status() === 200),
      page.getByRole('button', { name: 'login' }).click()
    ])
    await expect(page.getByText('Test User logged in')).toBeVisible()
  }
  const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.getByText(`a new blog ${title}`)).toBeVisible()
  }

  // 5.17
  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
  })

  // 5.18
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page)
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  // 5.19–5.23
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page)
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'E2E Test Blog', 'E2E Author', 'https://e2e.com')
      await expect(page.locator('.blog', { hasText: 'E2E Test Blog' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Like Test Blog', 'Author', 'https://like.com')
      const blog = page.locator('.blog', { hasText: 'Like Test Blog' })
      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'like' }).click()
      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('user who created blog can delete it', async ({ page }) => {
      await createBlog(page, 'Delete Test Blog', 'Author', 'https://delete.com')
      const blog = page.locator('.blog', { hasText: 'Delete Test Blog' })
      await blog.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'remove' }).click()
      await expect(page.locator('.blog', { hasText: 'Delete Test Blog' })).not.toBeVisible()
    })

    test('blogs are ordered by likes', async ({ page }) => {
      await createBlog(page, 'Less Likes Blog', 'A', 'https://a.com')
      await createBlog(page, 'More Likes Blog', 'B', 'https://b.com')

      const moreLikesBlog = page.locator('.blog', { hasText: 'More Likes Blog' })
      await moreLikesBlog.getByRole('button', { name: 'view' }).click()
      await moreLikesBlog.getByRole('button', { name: 'like' }).click()
      await expect(moreLikesBlog.getByText('likes 1')).toBeVisible()
      await moreLikesBlog.getByRole('button', { name: 'like' }).click()
      await expect(moreLikesBlog.getByText('likes 2')).toBeVisible()

      const blogs = page.locator('.blog')
      await expect(blogs.first()).toContainText('More Likes Blog')
    })
  })
})