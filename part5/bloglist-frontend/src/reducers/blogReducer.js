import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.payload
    case 'ADD_BLOG':
      return [...state, action.payload]
    case 'LIKE_BLOG':
      return state.map(b =>
        b.id === action.payload.id ? action.payload : b
      )
    case 'DELETE_BLOG':
      return state.filter(b => b.id !== action.payload)
    default:
      return state
  }
}

export const initializeBlogs = () => async (dispatch) => {
  const blogs = await blogService.getAll()
  dispatch({ type: 'INIT_BLOGS', payload: blogs })
}

export const createBlog = (blog) => async (dispatch) => {
  const newBlog = await blogService.create(blog)
  dispatch({ type: 'ADD_BLOG', payload: newBlog })
}

export const likeBlog = (blog) => async (dispatch) => {
  const updated = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 })
  dispatch({ type: 'LIKE_BLOG', payload: updated })
}

export const deleteBlog = (id) => async (dispatch) => {
  await blogService.remove(id)
  dispatch({ type: 'DELETE_BLOG', payload: id })
}

export default blogReducer