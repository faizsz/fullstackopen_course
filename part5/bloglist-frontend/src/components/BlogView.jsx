import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const BlogView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const blog = useSelector(state => state.blogs.find(b => b.id === id))
  const user = useSelector(state => state.user)
  const [comment, setComment] = useState('')

  if (!blog) return null

  const handleLike = () => dispatch(likeBlog(blog))
  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title}?`)) {
      dispatch(deleteBlog(blog.id))
      navigate('/')
    }
  }
  const handleComment = async () => {
    await fetch(`/api/blogs/${blog.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment })
    })
    setComment('')
    // refresh blogs
    dispatch(initializeBlogs())
  }
  return (
    <div>
      <h2>{blog.title} by {blog.author}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>likes: {blog.likes} <button onClick={handleLike}>like</button></div>
      <div>added by {blog.user?.name}</div>
      {user?.username === blog.user?.username &&
        <button onClick={handleDelete}>remove</button>
      }
      <div>
  <h3>comments</h3>
  <input value={comment} onChange={e => setComment(e.target.value)} />
  <button onClick={handleComment}>add comment</button>
  <ul>
    {blog.comments && blog.comments.map((c, i) => <li key={i}>{c}</li>)}
  </ul>
</div>
    </div>
  )
}

export default BlogView