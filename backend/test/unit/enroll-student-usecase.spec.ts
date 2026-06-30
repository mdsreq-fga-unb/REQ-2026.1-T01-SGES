import { beforeEach, describe, expect, it, vi } from 'vitest'
import { EnrollStudentUseCase } from '@/application/usecases/enroll-student-usecase'
import { EnrollmentStatus } from '@/domain'
import { AppError, ConflictError, NotFoundError } from '@/application/infra/errors'
import type { Validator } from '@/application/infra/services/shared/validator'
import type { EnrollStudentInput } from '@/application/usecases/enroll-student-usecase'
import type { StudentRepository } from '@/application/services/student-repository'
import type { ClassRepository } from '@/application/services/class-repository'
import type { EnrollmentRepository } from '@/application/services/enrollment-repository'

const makeStudent = () => ({
  id: 'student-id',
  codigoMatricula: 'SEAS-2026-001',
  name: 'Ana Souza',
  email: 'ana@test.com',
  profissao: null,
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

const makeEnrollment = () => ({
  id: 'enrollment-id',
  studentId: 'student-id',
  classId: 'class-id',
  status: EnrollmentStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeValidator = (): Validator<EnrollStudentInput> => ({
  validate: vi.fn().mockImplementation(async (input) => input),
})

describe('EnrollStudentUseCase', () => {
  let studentRepository: StudentRepository
  let classRepository: ClassRepository
  let enrollmentRepository: EnrollmentRepository
  let validator: Validator<EnrollStudentInput>
  let sut: EnrollStudentUseCase

  beforeEach(() => {
    studentRepository = {
      findById: vi.fn().mockResolvedValue(makeStudent()),
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
      save: vi.fn().mockResolvedValue(makeEnrollment()),
      updateStatus: vi.fn(),
      deleteById: vi.fn(),
    }
    validator = makeValidator()
    sut = new EnrollStudentUseCase(studentRepository, classRepository, enrollmentRepository, validator)
  })

  it('should enroll student successfully', async () => {
    const result = await sut.execute({ studentId: 'student-id', classId: 'class-id' })
    expect(result.studentId).toBe('student-id')
    expect(result.classId).toBe('class-id')
    expect(result.status).toBe(EnrollmentStatus.ACTIVE)
    expect(enrollmentRepository.save).toHaveBeenCalledOnce()
  })

  it('should throw NotFoundError when student does not exist', async () => {
    vi.mocked(studentRepository.findById).mockResolvedValue(null)
    await expect(sut.execute({ studentId: 'bad-id', classId: 'class-id' }))
      .rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw NotFoundError when class does not exist', async () => {
    vi.mocked(classRepository.findById).mockResolvedValue(null)
    await expect(sut.execute({ studentId: 'student-id', classId: 'bad-id' }))
      .rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw ConflictError when student is already enrolled', async () => {
    vi.mocked(enrollmentRepository.findByStudentAndClass).mockResolvedValue(makeEnrollment())
    await expect(sut.execute({ studentId: 'student-id', classId: 'class-id' }))
      .rejects.toBeInstanceOf(ConflictError)
  })

  it('should throw AppError when class is full', async () => {
    vi.mocked(classRepository.findById).mockResolvedValue(makeClass(2))
    vi.mocked(enrollmentRepository.countActiveEnrollmentsByClass).mockResolvedValue(2)
    await expect(sut.execute({ studentId: 'student-id', classId: 'class-id' }))
      .rejects.toBeInstanceOf(AppError)
  })
})
