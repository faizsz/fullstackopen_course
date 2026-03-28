import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification(message)
    setNotificationType(type)
    setTimeout(() => setNotification(null), 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notify(`Welcome ${user.name}!`)
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(newBlog).sort((a, b) => b.likes - a.likes))
      notify(`a new blog ${newBlog.title} by ${newBlog.author} added`)
    } catch(error) {
      notify('failed to create blog', 'error')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?._id || blog.user,
    }
    try {
      const returned = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(b => b.id === blog.id ? { ...b, likes: returned.likes } : b)
        .sort((a, b) => b.likes - a.likes))
    } catch {
      notify('failed to update likes', 'error')
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notify(`blog ${blog.title} removed`)
      } catch {
        notify('failed to remove blog', 'error')
      }
    }
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification} type={notificationType} />

      {!user && (
        <Togglable buttonLabel="log in">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      )}

      {user && (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={handleCreateBlog} />
          </Togglable>
          <div>
            {blogs.map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                handleDelete={handleDelete}
                currentUser={user}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App