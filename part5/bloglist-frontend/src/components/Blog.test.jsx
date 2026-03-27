import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import Blog from './Blog'

const blog = {
  title: 'Test Blog Title',
  author: 'Test Author',
  url: 'https://testurl.com',
  likes: 7,
  user: { username: 'testuser', name: 'Test User' }
}

const currentUser = { username: 'testuser', name: 'Test User' }

// 5.13
describe('Blog component', () => {
  test('renders title and author but not url or likes by default', () => {
    render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} currentUser={currentUser} />)

    expect(screen.getByText(/Test Blog Title/)).toBeDefined()
    expect(screen.getByText(/Test Author/)).toBeDefined()
    expect(screen.queryByText('https://testurl.com')).toBeNull()
    expect(screen.queryByText(/likes 7/)).toBeNull()
  })

  // 5.14
  test('shows url and likes when view button is clicked', async () => {
    render(<Blog blog={blog} handleLike={() => {}} handleDelete={() => {}} currentUser={currentUser} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('https://testurl.com')).toBeDefined()
    expect(screen.getByText(/likes 7/)).toBeDefined()
  })

  // 5.15
  test('like button calls handler twice when clicked twice', async () => {
    const mockHandler = vi.fn()
    render(<Blog blog={blog} handleLike={mockHandler} handleDelete={() => {}} currentUser={currentUser} />)

    const user = userEvent.setup()
    await user.click(screen.getByText('view'))
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler).toHaveBeenCalledTimes(2)
  })
})