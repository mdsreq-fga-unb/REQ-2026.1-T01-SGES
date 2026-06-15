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

const ADMIN_EMAIL = 'admin-delete-integration@test.com'
const TARGET_EMAIL = 'target-delete-integration@test.com'

let adminToken: string
let teacherToken: string
let targetUserId: string

beforeAll(async () => {
  if (!dataSource.isInitialized) {
    await dataSource.initialize()
  }

  const hash = await bcrypt.hash('Admin1234', 10)
  await dataSource.getRepository(UserEntity).save({
    id: randomUUID(),
    registerCode: 'admin-del-001',
    name: 'Admin Delete Test',
    email: ADMIN_EMAIL,
    password: hash,
    role: UserRole.ADMIN,
  })

  const target = await dataSource.getRepository(UserEntity).save({
    id: randomUUID(),
    registerCode: 'target-del-001',
    name: 'Target User',
    email: TARGET_EMAIL,
    password: hash,
    role: UserRole.TEACHER,
  })
  targetUserId = target.id

  const tokenService = new JwtTokenService(env.JWT_SECRET)
  adminToken = tokenService.generate({
    email: ADMIN_EMAIL,
    role: UserRole.ADMIN,
    name: 'Admin Delete Test',
    registerCode: 'admin-del-001',
  })
  teacherToken = tokenService.generate({
    email: 'teacher-del@test.com',
    role: UserRole.TEACHER,
    name: 'Teacher',
    registerCode: 'tch-del-001',
  })
})

afterAll(async () => {
  await dataSource.getRepository(UserEntity).delete({ email: ADMIN_EMAIL })
  await dataSource.getRepository(UserEntity).delete({ email: TARGET_EMAIL })
})

describe('DELETE /v1/users/:id', () => {
  it('should return 401 when no token is provided', async () => {
    const res = await request(api).delete(`/v1/users/${targetUserId}`)
    expect(res.status).toBe(401)
  })

  it('should return 403 when token belongs to a TEACHER', async () => {
    const res = await request(api)
      .delete(`/v1/users/${targetUserId}`)
      .set('Authorization', `Bearer ${teacherToken}`)
    expect(res.status).toBe(403)
  })

  it('should return 400 when id is not a valid uuid', async () => {
    const res = await request(api)
      .delete('/v1/users/not-a-uuid')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(400)
  })

  it('should return 404 when user does not exist', async () => {
    const res = await request(api)
      .delete(`/v1/users/${randomUUID()}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(404)
  })

  it('should delete user and return 204', async () => {
    const res = await request(api)
      .delete(`/v1/users/${targetUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})

    const deleted = await dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: targetUserId } })
    expect(deleted).toBeNull()
  })
})
