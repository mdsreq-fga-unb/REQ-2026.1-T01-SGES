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

const ADMIN_EMAIL = 'admin-list-integration@test.com'
const SEEDED_EMAILS = Array.from({ length: 3 }, (_, i) => `list-user-${i}@test.com`)

let adminToken: string
let teacherToken: string

beforeAll(async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }

  const hash = await bcrypt.hash('Admin1234', 10)
  await dataSource.getRepository(UserEntity).save({
    id: randomUUID(),
    registerCode: 'admin-list-001',
    name: 'Admin List Test',
    email: ADMIN_EMAIL,
    password: hash,
    role: UserRole.ADMIN,
  })

  for (let i = 0; i < SEEDED_EMAILS.length; i++) {
    await dataSource.getRepository(UserEntity).save({
      id: randomUUID(),
      registerCode: `list-rc-00${i}`,
      name: `List User ${i}`,
      email: SEEDED_EMAILS[i],
      password: hash,
      role: UserRole.TEACHER,
    })
  }

  const tokenService = new JwtTokenService(env.JWT_SECRET)
  adminToken = tokenService.generate({
    email: ADMIN_EMAIL,
    role: UserRole.ADMIN,
    name: 'Admin List Test',
    registerCode: 'admin-list-001',
  })
  teacherToken = tokenService.generate({
    email: 'teacher-list@test.com',
    role: UserRole.TEACHER,
    name: 'Teacher',
    registerCode: 'tch-list-001',
  })
})

afterAll(async () => {
  await dataSource.getRepository(UserEntity).delete({ email: ADMIN_EMAIL })
  for (const email of SEEDED_EMAILS) {
    await dataSource.getRepository(UserEntity).delete({ email })
  }
})

describe('GET /v1/users', () => {
  it('should return 401 when no token is provided', async () => {
    const res = await request(api).get('/v1/users')
    expect(res.status).toBe(401)
  })

  it('should return 403 when token belongs to a TEACHER', async () => {
    const res = await request(api)
      .get('/v1/users')
      .set('Authorization', `Bearer ${teacherToken}`)
    expect(res.status).toBe(403)
  })

  it('should return paginated list with correct structure', async () => {
    const res = await request(api)
      .get('/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body).toHaveProperty('page', 1)
    expect(res.body).toHaveProperty('limit', 10)
    expect(res.body).toHaveProperty('total')
    expect(res.body).toHaveProperty('totalPages')
    expect(Array.isArray(res.body.data)).toBe(true)
  })

  it('should not expose password in the response', async () => {
    const res = await request(api)
      .get('/v1/users')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    for (const user of res.body.data) {
      expect(user).not.toHaveProperty('password')
    }
  })

  it('should return 400 when page is less than 1', async () => {
    const res = await request(api)
      .get('/v1/users?page=0')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(400)
  })

  it('should paginate correctly with page=1', async () => {
    const res = await request(api)
      .get('/v1/users?page=1')
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(200)
    expect(res.body.page).toBe(1)
    expect(res.body.data.length).toBeLessThanOrEqual(10)
  })
})
