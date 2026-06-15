import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { api } from '@/api'
import { UserRole } from '@/domain'
import { dataSource } from '@/infra/orm/datasource'
import { UserEntity } from '@/infra/orm/entity/user-entity'

const TEST_EMAIL = 'auth-integration@test.com'
const TEST_PASSWORD = 'Pass1234'

beforeAll(async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }

  const hash = await bcrypt.hash(TEST_PASSWORD, 10)
  await dataSource.getRepository(UserEntity).save({
    id: randomUUID(),
    registerCode: '202512345',
    name: 'Integration Test User',
    email: TEST_EMAIL,
    password: hash,
    role: UserRole.TEACHER,
  })
})

afterAll(async () => {
  await dataSource.getRepository(UserEntity).delete({ email: TEST_EMAIL })
  await dataSource.destroy()
})

describe('POST /v1/auth', () => {
  it('should return 200 and a JWT token for valid credentials', async () => {
    const res = await request(api)
      .post('/v1/auth')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(typeof res.body.token).toBe('string')
    expect(res.body.token.split('.')).toHaveLength(3)
  })

  it('should return 401 for wrong password', async () => {
    const res = await request(api)
      .post('/v1/auth')
      .send({ email: TEST_EMAIL, password: 'wrongpw' })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('message')
  })

  it('should return 401 for non-existent email', async () => {
    const res = await request(api)
      .post('/v1/auth')
      .send({ email: 'ghost@test.com', password: TEST_PASSWORD })

    expect(res.status).toBe(401)
  })

  it('should return 400 for invalid email format', async () => {
    const res = await request(api)
      .post('/v1/auth')
      .send({ email: 'not-an-email', password: TEST_PASSWORD })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })

  it('should return 400 for empty password', async () => {
    const res = await request(api)
      .post('/v1/auth')
      .send({ email: TEST_EMAIL, password: '' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })

  it('should return 400 for missing body fields', async () => {
    const res = await request(api).post('/v1/auth').send({})

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })

  it('token payload should contain user data', async () => {
    const res = await request(api)
      .post('/v1/auth')
      .send({ email: TEST_EMAIL, password: TEST_PASSWORD })

    const [, payloadB64] = res.body.token.split('.')
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())

    expect(payload.email).toBe(TEST_EMAIL)
    expect(payload.role).toBe(UserRole.TEACHER)
    expect(payload).toHaveProperty('name')
    expect(payload).toHaveProperty('registerCode')
  })
})
