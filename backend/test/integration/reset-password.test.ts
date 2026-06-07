import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { api } from '@/api'
import { UserRole } from '@/domain'
import { dataSource } from '@/infra/orm/datasource'
import { UserEntity } from '@/infra/orm/entity/user-entity'

const TEST_EMAIL = 'reset-password-integration@test.com'
const VALID_CODE = '654321'
const FUTURE_EXPIRY = new Date(Date.now() + 30 * 60 * 1000)

beforeAll(async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }

  const hash = await bcrypt.hash('OldPas1', 10)
  await dataSource.getRepository(UserEntity).save({
    id: randomUUID(),
    registerCode: 'reset-001',
    name: 'Reset Password User',
    email: TEST_EMAIL,
    password: hash,
    role: UserRole.TEACHER,
  })
})

beforeEach(async () => {
  await dataSource.getRepository(UserEntity).update(
    { email: TEST_EMAIL },
    { resetCode: VALID_CODE, resetCodeExpiresAt: FUTURE_EXPIRY },
  )
})

afterAll(async () => {
  await dataSource.getRepository(UserEntity).delete({ email: TEST_EMAIL })
  if (dataSource.isInitialized) await dataSource.destroy()
})

describe('POST /v1/auth/reset-password', () => {
  it('should return 200 and update the password with valid code', async () => {
    const res = await request(api)
      .post('/v1/auth/reset-password')
      .send({ email: TEST_EMAIL, code: VALID_CODE, newPassword: 'NewPas1' })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
  })

  it('should clear the reset code after successful reset', async () => {
    await request(api)
      .post('/v1/auth/reset-password')
      .send({ email: TEST_EMAIL, code: VALID_CODE, newPassword: 'NewPas1' })

    const user = await dataSource.getRepository(UserEntity).findOne({ where: { email: TEST_EMAIL } })
    expect(user?.resetCode).toBeNull()
    expect(user?.resetCodeExpiresAt).toBeNull()
  })

  it('should allow login with the new password after reset', async () => {
    await request(api)
      .post('/v1/auth/reset-password')
      .send({ email: TEST_EMAIL, code: VALID_CODE, newPassword: 'NewPas1' })

    const loginRes = await request(api)
      .post('/v1/auth')
      .send({ email: TEST_EMAIL, password: 'NewPas1' })

    expect(loginRes.status).toBe(200)
    expect(loginRes.body).toHaveProperty('token')
  })

  it('should return 401 for wrong code', async () => {
    const res = await request(api)
      .post('/v1/auth/reset-password')
      .send({ email: TEST_EMAIL, code: '000000', newPassword: 'NewPas1' })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('message')
  })

  it('should return 401 for expired code', async () => {
    await dataSource.getRepository(UserEntity).update(
      { email: TEST_EMAIL },
      { resetCodeExpiresAt: new Date(Date.now() - 1000) },
    )

    const res = await request(api)
      .post('/v1/auth/reset-password')
      .send({ email: TEST_EMAIL, code: VALID_CODE, newPassword: 'NewPas1' })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('message')
  })

  it('should return 401 when user has no reset code', async () => {
    await dataSource.getRepository(UserEntity).update(
      { email: TEST_EMAIL },
      { resetCode: null, resetCodeExpiresAt: null },
    )

    const res = await request(api)
      .post('/v1/auth/reset-password')
      .send({ email: TEST_EMAIL, code: VALID_CODE, newPassword: 'NewPas1' })

    expect(res.status).toBe(401)
  })

  it('should return 400 for missing fields', async () => {
    const res = await request(api)
      .post('/v1/auth/reset-password')
      .send({ email: TEST_EMAIL })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })

  it('should return 400 if code is not 6 digits', async () => {
    const res = await request(api)
      .post('/v1/auth/reset-password')
      .send({ email: TEST_EMAIL, code: '123', newPassword: 'NewPas1' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })

  it('should return 400 if new password is shorter than 4 characters', async () => {
    const res = await request(api)
      .post('/v1/auth/reset-password')
      .send({ email: TEST_EMAIL, code: VALID_CODE, newPassword: 'abc' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })

  it('should return 400 if new password is longer than 8 characters', async () => {
    const res = await request(api)
      .post('/v1/auth/reset-password')
      .send({ email: TEST_EMAIL, code: VALID_CODE, newPassword: '123456789' })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })
})
