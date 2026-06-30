import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ListAttendanceByDateUseCase } from '@/application/usecases/list-attendance-by-date-usecase'
import { AttendanceStatus, EnrollmentStatus } from '@/domain'
import type { ClassRepository } from '@/application/services/class-repository'
import type { StudentRepository } from '@/application/services/student-repository'
import type { EnrollmentRepository } from '@/application/services/enrollment-repository'
import type { AttendanceRepository } from '@/application/services/attendance-repository'
import { NotFoundError } from '@/application/infra/errors'

const DATE = new Date('2026-06-28')
const CLASS_ID = 'class-id'

const makeEnrollment = (studentId: string) => ({
  id: `enroll-${studentId}`,
  studentId,
  classId: CLASS_ID,
  status: EnrollmentStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
})

const makeStudent = (id: string) => ({
  id,
  codigoMatricula: `SEAS-${id}`,
  name: `Aluno ${id}`,
  email: null,
  profissao: null,
  createdAt: new Date(),
  updatedAt: new Date(),
})

describe('ListAttendanceByDateUseCase', () => {
  let classRepository: ClassRepository
  let studentRepository: StudentRepository
  let enrollmentRepository: EnrollmentRepository
  let attendanceRepository: AttendanceRepository
  let sut: ListAttendanceByDateUseCase

  beforeEach(() => {
    classRepository = {
      findById: vi.fn().mockResolvedValue({ id: CLASS_ID, nomeCurso: 'Culinária', horario: '14h', diaSemana: 'quarta', vagasLimite: 30, createdAt: new Date(), updatedAt: new Date() }),
      findAll: vi.fn(),
      save: vi.fn(),
      deleteById: vi.fn(),
    }
    studentRepository = {
      findById: vi.fn().mockImplementation(async (id: string) => makeStudent(id)),
      findByCodigoMatricula: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      deleteById: vi.fn(),
    }
    enrollmentRepository = {
      findById: vi.fn(),
      findByStudentAndClass: vi.fn(),
      findActiveByClass: vi.fn().mockResolvedValue([makeEnrollment('s1'), makeEnrollment('s2')]),
      countActiveEnrollmentsByClass: vi.fn(),
      getFunnelData: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      updateStatus: vi.fn(),
      deleteById: vi.fn(),
    }
    attendanceRepository = {
      findById: vi.fn(),
      findByStudentClassAndDate: vi.fn(),
      findByClassAndDate: vi.fn().mockResolvedValue([
        { id: 'att-1', studentId: 's1', classId: CLASS_ID, date: DATE, status: AttendanceStatus.PRESENT, observacao: null, justificativaDetalhes: null, createdAt: new Date(), updatedAt: new Date() },
      ]),
      findStudentAttendances: vi.fn(),
      save: vi.fn(),
      deleteById: vi.fn(),
    }
    sut = new ListAttendanceByDateUseCase(classRepository, enrollmentRepository, studentRepository, attendanceRepository)
  })

  it('should return all enrolled students with their attendance status', async () => {
    const result = await sut.execute({ classId: CLASS_ID, date: DATE })
    expect(result).toHaveLength(2)
    const s1 = result.find((r) => r.studentId === 's1')
    const s2 = result.find((r) => r.studentId === 's2')
    expect(s1?.status).toBe(AttendanceStatus.PRESENT)
    expect(s2?.status).toBeNull()
  })

  it('should throw NotFoundError when class does not exist', async () => {
    vi.mocked(classRepository.findById).mockResolvedValue(null)
    await expect(sut.execute({ classId: 'bad', date: DATE })).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should return empty array when no students are enrolled', async () => {
    vi.mocked(enrollmentRepository.findActiveByClass).mockResolvedValue([])
    const result = await sut.execute({ classId: CLASS_ID, date: DATE })
    expect(result).toHaveLength(0)
  })

  it('should return null status for students without attendance record on that date', async () => {
    vi.mocked(attendanceRepository.findByClassAndDate).mockResolvedValue([])
    const result = await sut.execute({ classId: CLASS_ID, date: DATE })
    expect(result.every((r) => r.status === null)).toBe(true)
  })
})
