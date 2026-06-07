import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { api } from '@/api'
import { UserRole } from '@/domain'
import { dataSource } from '@/infra/orm/datasource'
import { UserEntity } from '@/infra/orm/entity/user-entity'

const TEST_EMAIL = 'forgot-password-integration@test.com'

beforeAll(async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }

  const hash = await bcrypt.hash('Pass1234', 10)
  await dataSource.getRepository(UserEntity).save({
    id: randomUUID(),
    registerCode: 'forgot-001',
    name: 'Forgot Password User',
    email: TEST_EMAIL,
    password: hash,
    role: UserRole.TEACHER,
  })
})

afterAll(async () => {
  await dataSource.getRepository(UserEntity).delete({ email: TEST_EMAIL })
  if (dataSource.isInitialized) await dataSource.destroy()
})

describe('POST /v1/auth/forgot-password', () => {
  it('should return 200 when email exists', async () => {
    const res = await request(api)
      .post('/v1/auth/forgot-password')
      .send({ email: TEST_EMAIL })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
  })

  it('should return 200 even when email does not exist (security)', async () => {
    const res = await request(api)
      .post('/v1/auth/forgot-password')
      .send({ email: 'ghost@test.com' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
  })

  it('should store a reset code in the database for existing user', async () => {
    await request(api)
      .post('/v1/auth/forgot-password')
      .send({ email: TEST_EMAIL })

    const user = await dataSource.getRepository(UserEntity).findOne({ where: { email: TEST_EMAIL } })
    expect(user?.resetCode).toMatch(/^\d{6}$/)
    expect(user?.resetCodeExpiresAt).toBeInstanceOf(Date)
    expect(user!.resetCodeExpiresAt!.getTime()).toBeGreaterThan(Date.now())
  })

  it('should return 400 for invalid email format', async () => {
    const res = await request(api)
      .post('/v1/auth/forgot-password')
      .send({ email: 'not-an-email' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })

  it('should return 400 for missing email', async () => {
    const res = await request(api)
      .post('/v1/auth/forgot-password')
      .send({})

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })
})
