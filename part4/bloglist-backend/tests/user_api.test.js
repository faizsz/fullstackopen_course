const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.collection.drop().catch(() => null)
        await User.createIndexes() // pastikan unique index terbentuk dulu
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
        await user.save()
      })

  test('creation succeeds with fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = { username: 'root', name: 'Superuser', password: 'salainen' }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(result.body.error.includes('expected `username` to be unique'))
    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username less than 3 chars', async () => {
    const newUser = { username: 'ab', name: 'Short', password: 'validpass' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error)
  })

  test('creation fails if password less than 3 chars', async () => {
    const newUser = { username: 'validuser', name: 'Valid', password: 'ab' }
    const result = await api.post('/api/users').send(newUser).expect(400)
    assert(result.body.error)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})