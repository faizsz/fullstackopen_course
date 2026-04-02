import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { initializeBlogs, createBlog } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'
import { setUser, clearUser } from './reducers/userReducer'
import loginService from './services/login'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import Nav from './components/Nav'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Notification = () => {
  const notification = useSelector(state => state.notification)
  if (!notification) return null
  return <div style={{ border: '1px solid green', padding: 5, marginBottom: 10 }}>{notification}</div>
}

const BlogList = ({ blogs, user, handleCreate, handleLike, handleDelete, blogFormRef }) => (
  <div>
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={handleCreate} />
    </Togglable>
    {blogs.map(blog => (
      <div key={blog.id} style={{ border: '1px solid black', padding: 5, marginBottom: 5 }}>
        <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
      </div>
    ))}
  </div>
)

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const blogs = useSelector(state => [...state.blogs].sort((a, b) => b.likes - a.likes))
  const user = useSelector(state => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [users, setUsers] = useState([])
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
    axios.get('/api/users').then(res => setUsers(res.data))
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUser) {
      const u = JSON.parse(loggedUser)
      dispatch(setUser(u))
      blogService.setToken(u.token)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const u = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(u))
      blogService.setToken(u.token)
      dispatch(setUser(u))
      setUsername('')
      setPassword('')
    } catch {
      dispatch(setNotification('wrong username or password', 5))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(clearUser())
    navigate('/')
  }

  const handleCreate = async (blogData) => {
    blogFormRef.current.toggleVisibility()
    await dispatch(createBlog(blogData))
    dispatch(setNotification(`a new blog ${blogData.title} by ${blogData.author} added`, 5))
  }

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>username <input value={username} onChange={e => setUsername(e.target.value)} /></div>
          <div>password <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Nav user={user} handleLogout={handleLogout} />
      <h2>blog app</h2>
      <Notification />
      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} user={user} handleCreate={handleCreate} blogFormRef={blogFormRef} />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/users/:id" element={<User users={users} />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </div>
  )
}

export default App