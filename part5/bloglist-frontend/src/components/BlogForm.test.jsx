import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  test('calls createBlog with correct details when form is submitted', async () => {
    const mockCreate = vi.fn()
    render(<BlogForm createBlog={mockCreate} />)

    const user = userEvent.setup()

    await user.type(screen.getByTestId('title'), 'Test Title')
    await user.type(screen.getByTestId('author'), 'Test Author')
    await user.type(screen.getByTestId('url'), 'https://test.com')

    await user.click(screen.getByText('create'))

    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockCreate).toHaveBeenCalledWith({
      title: 'Test Title',
      author: 'Test Author',
      url: 'https://test.com'
    })
  })
})