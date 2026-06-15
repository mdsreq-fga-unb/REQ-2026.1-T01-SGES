import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TeacherRegisterPresenceUseCase } from '@/application/usecases/teacher-register-presence-usecase'
import { AttendanceStatus, EnrollmentStatus, UserRole } from '@/domain'
import type { ClassRepository } from '@/application/services/class-repository'
import type { StudentRepository } from '@/application/services/student-repository'
import type { EnrollmentRepository } from '@/application/services/enrollment-repository'
import type { AttendanceRepository } from '@/application/services/attendance-repository'
import type { UserRepository } from '@/application/services/user-repository'
import type { NotificationRepository } from '@/application/services/notification-repository'
import type { IEmailService } from '@/application/services/email-service'

const CLASS_ID = 'class-id'
const STUDENT_ID = 'student-id'
const ENROLLMENT_ID = 'enrollment-id'

const makeClass = () => ({
  id: CLASS_ID,
  nomeCurso: 'Curso de Culinária',
  semester: '2026.1',
  schedule: 'Quarta à tarde',
  instructors: [
    { id: 'inst-1', name: 'Professor Teste', email: 'teacher@test.com', role: UserRole.TEACHER }
  ]
})

const makeStudent = () => ({
  id: STUDENT_ID,
  name: 'Estudante Teste',
  email: 'student@test.com',
  codigo_matricula: '12345678',
  profissao: 'Estudante',
  fotoUrl: null,
})

const makeEnrollment = () => ({
  id: ENROLLMENT_ID,
  studentId: STUDENT_ID,
  classId: CLASS_ID,
  status: EnrollmentStatus.ACTIVE,
})

describe('TeacherRegisterPresenceUseCase', () => {
  let classRepository: ClassRepository
  let studentRepository: StudentRepository
  let enrollmentRepository: EnrollmentRepository
  let attendanceRepository: AttendanceRepository
  let userRepository: UserRepository
  let notificationRepository: NotificationRepository
  let emailService: IEmailService
  let sut: TeacherRegisterPresenceUseCase

  beforeEach(() => {
    classRepository = {
      findById: vi.fn().mockResolvedValue(makeClass()),
      findAll: vi.fn(),
      save: vi.fn(),
    } as any

    studentRepository = {
      findById: vi.fn().mockResolvedValue(makeStudent()),
      findAll: vi.fn(),
      save: vi.fn(),
    } as any

    enrollmentRepository = {
      findByStudentAndClass: vi.fn().mockResolvedValue(makeEnrollment()),
      updateStatus: vi.fn(),
    } as any

    attendanceRepository = {
      save: vi.fn().mockImplementation(async (data) => ({ id: 'att-id', ...data })),
      findStudentAttendances: vi.fn().mockResolvedValue([]),
    } as any

    userRepository = {
      findAdmins: vi.fn().mockResolvedValue([
        { id: 'admin-1', name: 'Admin Teste', email: 'admin@test.com', role: UserRole.ADMIN }
      ]),
    } as any

    notificationRepository = {
      save: vi.fn().mockResolvedValue({ id: 'notif-id' }),
    } as any

    emailService = {
      sendAbsenceAlert: vi.fn().mockResolvedValue(undefined),
    } as any

    sut = new TeacherRegisterPresenceUseCase(
      classRepository,
      studentRepository,
      enrollmentRepository,
      attendanceRepository,
      userRepository,
      notificationRepository,
      emailService
    )
  })

  it('should successfully register presence and do not trigger alert if student has 0 or 1 absence', async () => {
    vi.mocked(attendanceRepository.findStudentAttendances).mockResolvedValue([
      { id: 'att-1', status: AttendanceStatus.ABSENT, date: new Date(), classId: CLASS_ID, studentId: STUDENT_ID }
    ])

    const res = await sut.execute({
      classId: CLASS_ID,
      date: new Date(),
      attendances: [{ studentId: STUDENT_ID, status: AttendanceStatus.ABSENT }]
    })

    expect(res).toHaveLength(1)
    expect(attendanceRepository.save).toHaveBeenCalled()
    expect(enrollmentRepository.updateStatus).not.toHaveBeenCalled()
    expect(emailService.sendAbsenceAlert).not.toHaveBeenCalled()
  })

  it('should trigger alert notification and email when student reaches 2 absences (default threshold)', async () => {
    vi.mocked(attendanceRepository.findStudentAttendances).mockResolvedValue([
      { id: 'att-1', status: AttendanceStatus.ABSENT, date: new Date(), classId: CLASS_ID, studentId: STUDENT_ID },
      { id: 'att-2', status: AttendanceStatus.ABSENT, date: new Date(), classId: CLASS_ID, studentId: STUDENT_ID }
    ])

    await sut.execute({
      classId: CLASS_ID,
      date: new Date(),
      attendances: [{ studentId: STUDENT_ID, status: AttendanceStatus.ABSENT }]
    })

    expect(emailService.sendAbsenceAlert).toHaveBeenCalledTimes(3)
    expect(notificationRepository.save).toHaveBeenCalledTimes(2)
    expect(enrollmentRepository.updateStatus).not.toHaveBeenCalled()
  })

  it('should automatically mark student as EVADED and alert admins/instructors when student reaches 3 absences', async () => {
    vi.mocked(attendanceRepository.findStudentAttendances).mockResolvedValue([
      { id: 'att-1', status: AttendanceStatus.ABSENT, date: new Date(), classId: CLASS_ID, studentId: STUDENT_ID },
      { id: 'att-2', status: AttendanceStatus.ABSENT, date: new Date(), classId: CLASS_ID, studentId: STUDENT_ID },
      { id: 'att-3', status: AttendanceStatus.ABSENT, date: new Date(), classId: CLASS_ID, studentId: STUDENT_ID }
    ])

    await sut.execute({
      classId: CLASS_ID,
      date: new Date(),
      attendances: [{ studentId: STUDENT_ID, status: AttendanceStatus.ABSENT }]
    })

    expect(enrollmentRepository.updateStatus).toHaveBeenCalledWith(ENROLLMENT_ID, EnrollmentStatus.EVADED)
    expect(emailService.sendAbsenceAlert).toHaveBeenCalledTimes(3)
    expect(notificationRepository.save).toHaveBeenCalledTimes(2)
  })

  it('should support configurable threshold (e.g. alert at 1 absence)', async () => {
    vi.mocked(attendanceRepository.findStudentAttendances).mockResolvedValue([
      { id: 'att-1', status: AttendanceStatus.ABSENT, date: new Date(), classId: CLASS_ID, studentId: STUDENT_ID }
    ])

    await sut.execute({
      classId: CLASS_ID,
      date: new Date(),
      alertThreshold: 1,
      attendances: [{ studentId: STUDENT_ID, status: AttendanceStatus.ABSENT }]
    })

    expect(emailService.sendAbsenceAlert).toHaveBeenCalledTimes(3)
    expect(notificationRepository.save).toHaveBeenCalledTimes(2)
  })

  it('should not count FT (Falta Trabalho) towards unexcused absences and eviction rules', async () => {
    vi.mocked(attendanceRepository.findStudentAttendances).mockResolvedValue([
      { id: 'att-1', status: AttendanceStatus.FT, date: new Date(), classId: CLASS_ID, studentId: STUDENT_ID }
    ])

    await sut.execute({
      classId: CLASS_ID,
      date: new Date(),
      attendances: [{ studentId: STUDENT_ID, status: AttendanceStatus.FT, justificativaDetalhes: 'Trabalhando no sábado à noite' }]
    })

    expect(enrollmentRepository.updateStatus).not.toHaveBeenCalled()
    expect(emailService.sendAbsenceAlert).not.toHaveBeenCalled()
    expect(notificationRepository.save).not.toHaveBeenCalled()
  })
})
