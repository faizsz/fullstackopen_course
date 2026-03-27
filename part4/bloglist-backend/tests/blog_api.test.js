const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token = ''

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})
  
    // Buat user untuk testing
    const passwordHash = await bcrypt.hash('testpassword', 10)
    const user = await new User({ username: 'testuser', name: 'Test User', passwordHash }).save()
  
    // Insert initial blogs
    const savedBlogs = await Promise.all(
      helper.initialBlogs.map(blog => new Blog({ ...blog, user: user._id }).save())
    )
  
    // Update user.blogs langsung di DB, tanpa re-save user object lama
    await User.findByIdAndUpdate(
      user._id,
      { $set: { blogs: savedBlogs.map(b => b._id) } },
      { new: true }
    )
  
    // Login untuk dapet token
    const loginResult = await api
      .post('/api/login')
      .send({ username: 'testuser', password: 'testpassword' })
    token = loginResult.body.token
  })

// 4.8
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// 4.8
test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// 4.9
test('unique identifier is named id not _id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert(blog.id !== undefined)
  assert(blog._id === undefined)
})

// 4.10
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies writing async code',
    author: 'Test Author',
    url: 'https://example.com',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await helper.blogsInDb()
  assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)

  const titles = blogsAfter.map(b => b.title)
  assert(titles.includes(newBlog.title))
})

// 4.11
test('likes defaults to 0 if missing', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Author',
    url: 'https://example.com'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

// 4.12
test('blog without title is not added', async () => {
  const newBlog = { author: 'Author', url: 'https://example.com', likes: 5 }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog without url is not added', async () => {
  const newBlog = { title: 'Title only', author: 'Author', likes: 5 }
  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

// 4.13
test('a blog can be deleted by its creator', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAfter = await helper.blogsInDb()
  assert.strictEqual(blogsAfter.length, helper.initialBlogs.length - 1)
})

// 4.14
test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = { ...blogToUpdate, likes: 999 }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)

  assert.strictEqual(response.body.likes, 999)
})

// 4.23 — token required
test('adding blog fails with 401 if token not provided', async () => {
  const newBlog = {
    title: 'No token blog',
    author: 'Author',
    url: 'https://example.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})