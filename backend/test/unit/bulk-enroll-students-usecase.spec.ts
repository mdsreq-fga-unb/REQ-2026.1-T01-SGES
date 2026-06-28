import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BulkEnrollStudentsUseCase } from '@/application/usecases/bulk-enroll-students-usecase'
import { EnrollmentStatus } from '@/domain'
import type { StudentRepository } from '@/application/services/student-repository'
import type { ClassRepository } from '@/application/services/class-repository'
import type { EnrollmentRepository } from '@/application/services/enrollment-repository'

const makeStudent = (id: string) => ({
  id,
  codigoMatricula: `SEAS-2026-${id}`,
  name: `Aluno ${id}`,
  email: null,
  profissao: null,
  fotoUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeClass = (vagasLimite = 30) => ({
  id: 'class-id',
  nomeCurso: 'Culinária',
  horario: '14:00',
  diaSemana: 'quarta',
  vagasLimite,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeEnrollment = (studentId: string) => ({
  id: `enrollment-${studentId}`,
  studentId,
  classId: 'class-id',
  status: EnrollmentStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
})

describe('BulkEnrollStudentsUseCase', () => {
  let studentRepository: StudentRepository
  let classRepository: ClassRepository
  let enrollmentRepository: EnrollmentRepository
  let sut: BulkEnrollStudentsUseCase

  beforeEach(() => {
    studentRepository = {
      findById: vi.fn().mockImplementation(async (id: string) => makeStudent(id)),
      findByCodigoMatricula: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      deleteById: vi.fn(),
    }
    classRepository = {
      findById: vi.fn().mockResolvedValue(makeClass()),
      findAll: vi.fn(),
      save: vi.fn(),
      deleteById: vi.fn(),
    }
    enrollmentRepository = {
      findById: vi.fn(),
      findByStudentAndClass: vi.fn().mockResolvedValue(null),
      findActiveByClass: vi.fn(),
      countActiveEnrollmentsByClass: vi.fn().mockResolvedValue(0),
      getFunnelData: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn().mockImplementation(async (data: { studentId: string }) => makeEnrollment(data.studentId)),
      updateStatus: vi.fn(),
      deleteById: vi.fn(),
    }
    sut = new BulkEnrollStudentsUseCase(studentRepository, classRepository, enrollmentRepository)
  })

  it('should enroll all students successfully when all are valid', async () => {
    const result = await sut.execute({ classId: 'class-id', studentIds: ['s1', 's2', 's3'] })
    expect(result.enrolled).toHaveLength(3)
    expect(result.failed).toHaveLength(0)
  })

  it('should collect failures without aborting the entire batch', async () => {
    vi.mocked(studentRepository.findById)
      .mockResolvedValueOnce(makeStudent('s1'))
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(makeStudent('s3'))

    const result = await sut.execute({ classId: 'class-id', studentIds: ['s1', 'bad-id', 's3'] })

    expect(result.enrolled).toHaveLength(2)
    expect(result.failed).toHaveLength(1)
    expect(result.failed[0].studentId).toBe('bad-id')
    expect(result.failed[0].reason).toContain('not found')
  })

  it('should fail all when class does not exist', async () => {
    vi.mocked(classRepository.findById).mockResolvedValue(null)
    const result = await sut.execute({ classId: 'bad-class', studentIds: ['s1', 's2'] })
    expect(result.enrolled).toHaveLength(0)
    expect(result.failed).toHaveLength(2)
  })

  it('should fail individual student if already enrolled', async () => {
    vi.mocked(enrollmentRepository.findByStudentAndClass)
      .mockResolvedValueOnce(makeEnrollment('s1'))
      .mockResolvedValueOnce(null)

    const result = await sut.execute({ classId: 'class-id', studentIds: ['s1', 's2'] })
    expect(result.enrolled).toHaveLength(1)
    expect(result.failed).toHaveLength(1)
    expect(result.failed[0].reason).toContain('already enrolled')
  })

  it('should stop enrolling when class is full during batch', async () => {
    vi.mocked(classRepository.findById).mockResolvedValue(makeClass(1))
    vi.mocked(enrollmentRepository.countActiveEnrollmentsByClass)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(1)

    const result = await sut.execute({ classId: 'class-id', studentIds: ['s1', 's2'] })
    expect(result.enrolled).toHaveLength(1)
    expect(result.failed).toHaveLength(1)
    expect(result.failed[0].reason).toContain('full')
  })
})
