import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { api } from '@/api'
import { env } from '@/env'
import { UserRole } from '@/domain'
import { dataSource } from '@/infra/orm/datasource'
import { UserEntity } from '@/infra/orm/entity/user-entity'
import { JwtTokenService } from '@/infra/services/token-service'

const ADMIN_EMAIL = 'admin-users-integration@test.com'
const ADMIN_PASSWORD = 'Admin1234'
const NEW_USER_EMAIL = 'newuser-integration@test.com'
const NEW_USER_NO_RC_EMAIL = 'newuser-norc-integration@test.com'

let adminToken: string

beforeAll(async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
  await dataSource.getRepository(UserEntity).save({
    id: randomUUID(),
    registerCode: 'admin-integration-001',
    name: 'Admin Integration User',
    email: ADMIN_EMAIL,
    password: hash,
    role: UserRole.ADMIN,
  })

  const tokenService = new JwtTokenService(env.JWT_SECRET)
  adminToken = tokenService.generate({
    email: ADMIN_EMAIL,
    role: UserRole.ADMIN,
    name: 'Admin Integration User',
    registerCode: 'admin-integration-001',
  })
})

afterAll(async () => {
  await dataSource.getRepository(UserEntity).delete({ email: ADMIN_EMAIL })
  await dataSource.getRepository(UserEntity).delete({ email: NEW_USER_EMAIL })
  await dataSource.getRepository(UserEntity).delete({ email: NEW_USER_NO_RC_EMAIL })
})

describe('POST /v1/users', () => {
  it('should return 401 when no token is provided', async () => {
    const res = await request(api)
      .post('/v1/users')
      .send({ name: 'New User', email: NEW_USER_EMAIL, password: 'Pass1234', registerCode: '20251001', role: UserRole.TEACHER })

    expect(res.status).toBe(401)
  })

  it('should return 403 when token belongs to a TEACHER', async () => {
    const tokenService = new JwtTokenService(env.JWT_SECRET)
    const teacherToken = tokenService.generate({
      email: 'teacher@test.com',
      role: UserRole.TEACHER,
      name: 'Teacher',
      registerCode: 'tch-001',
    })

    const res = await request(api)
      .post('/v1/users')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ name: 'New User', email: NEW_USER_EMAIL, password: 'Pass1234', registerCode: '20251001', role: UserRole.TEACHER })

    expect(res.status).toBe(403)
  })

  it('should create a user and return 201 without password field', async () => {
    const res = await request(api)
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'New User', email: NEW_USER_EMAIL, role: UserRole.TEACHER })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('name', 'New User')
    expect(res.body).toHaveProperty('email', NEW_USER_EMAIL)
    expect(res.body).toHaveProperty('role', UserRole.TEACHER)
    expect(res.body).toHaveProperty('registerCode')
    expect(res.body).not.toHaveProperty('password')
  })

  it('should auto-generate a 6-digit registerCode when not provided', async () => {
    const res = await request(api)
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'No RC User', email: NEW_USER_NO_RC_EMAIL, password: 'Pass1234', role: UserRole.TEACHER })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('registerCode')
    expect(res.body.registerCode).toMatch(/^\d{6}$/)
  })

  it('should return 409 when email already exists', async () => {
    const res = await request(api)
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Duplicate User', email: NEW_USER_EMAIL, password: 'Pass1234', registerCode: '20251002', role: UserRole.TEACHER })

    expect(res.status).toBe(409)
    expect(res.body).toHaveProperty('message')
  })

  it('should return 400 for invalid body', async () => {
    const res = await request(api)
      .post('/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'X', email: 'not-an-email', password: 'Pass1234', registerCode: '123', role: UserRole.TEACHER })

    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('errors')
  })
})
