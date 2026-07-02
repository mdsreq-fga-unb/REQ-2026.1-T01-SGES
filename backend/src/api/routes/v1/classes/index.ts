import { Router } from 'express'
import { authMiddleware } from '@/api/middleware/auth-middleware'
import { UserRole } from '@/domain'
import { container } from '@/infra/container/container'
import { AppError, ConflictError, NotFoundError } from '@/application/infra/errors'
import { CreateClassZodValidator } from '@/application/infra/services/shared/zod/create-class-zod-validator'
import listClassStudentsRoute from './list-class-students-route'
import enrollClassStudentRoute from './enroll-class-student-route'
import unenrollClassStudentRoute from './unenroll-class-student-route'
import registerClassAttendanceRoute from './register-class-attendance-route'
import alterClassAttendanceRoute from './alter-class-attendance-route'

const router = Router({ mergeParams: true })
const classValidator = new CreateClassZodValidator()

// Helper: validate instructors and check schedule conflicts
async function validateInstructors(
  instructorIds: string[] | undefined,
  classRepo: typeof container.ClassRepository,
  userRepo: typeof container.UserRepository,
  diaSemana: string,
  horario: string,
  excludeClassId?: string,
) {
  const instructors = []
  if (instructorIds && Array.isArray(instructorIds)) {
    for (const id of instructorIds) {
      const user = await userRepo.findById(id)
      // FE-4-B: Instructor not found or soft-deleted
      if (!user) {
        throw new NotFoundError(`Instrutor com ID "${id}" não encontrado ou está inativo.`)
      }
      instructors.push(user)

      // FE-4-C: Schedule conflict — does this instructor already teach another class at the same day/time?
      const instructorClasses = await classRepo.findInstructorClasses(id)
      const conflict = instructorClasses.find(
        (c) =>
          c.diaSemana === diaSemana &&
          c.horario === horario &&
          (!excludeClassId || c.id !== excludeClassId),
      )
      if (conflict) {
        throw new AppError(
          409,
          `O instrutor "${user.name}" já está lecionando em outra turma (${conflict.nomeCurso}) no mesmo dia e horário.`,
        )
      }
    }
  }
  return instructors
}

router.get('/', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), async (req, res, next) => {
  try {
    const classRepo = container.ClassRepository
    const { classes } = await classRepo.findAll(1, 1000)
    return res.status(200).json(classes)
  } catch (err) {
    next(err)
  }
})

router.post('/', authMiddleware([UserRole.ADMIN]), async (req, res, next) => {
  try {
    const classRepo = container.ClassRepository
    const userRepo = container.UserRepository

    // FE-4-A/D: Validate required fields and vagasLimite >= 1 via Zod
    const validated = await classValidator.validate(req.body)
    const { nomeCurso, livrosEstudados, horario, diaSemana, vagasLimite, instructorIds } = validated

    // FE-4-E: Duplicate class check
    const duplicate = await classRepo.findByDetails(nomeCurso, diaSemana, horario)
    if (duplicate) {
      throw new ConflictError(
        `Já existe uma turma com o nome "${nomeCurso}" no mesmo dia e horário (${diaSemana} às ${horario}).`,
      )
    }

    // FE-4-B / FE-4-C: Validate instructors existence and schedule conflicts
    const instructors = await validateInstructors(
      Array.isArray(instructorIds) ? instructorIds : undefined,
      classRepo,
      userRepo,
      diaSemana,
      horario,
    )

    const newClass = await classRepo.save({
      nomeCurso,
      livrosEstudados: livrosEstudados || null,
      horario,
      diaSemana,
      vagasLimite: vagasLimite || null,
      instructors,
    })

    return res.status(201).json(newClass)
  } catch (err) {
    next(err)
  }
})

router.put('/:classId', authMiddleware([UserRole.ADMIN]), async (req, res, next) => {
  try {
    const classRepo = container.ClassRepository
    const userRepo = container.UserRepository
    const { classId } = req.params
    const classIdStr = classId as string

    const existingClass = await classRepo.findById(classId as string)
    if (!existingClass) {
      throw new NotFoundError('Turma não encontrada.')
    }

    // Merge new values with existing
    const mergedBody = {
      nomeCurso: req.body.nomeCurso ?? existingClass.nomeCurso,
      horario: req.body.horario ?? existingClass.horario,
      diaSemana: req.body.diaSemana ?? existingClass.diaSemana,
      livrosEstudados: req.body.livrosEstudados ?? existingClass.livrosEstudados,
      vagasLimite: req.body.vagasLimite ?? existingClass.vagasLimite,
      instructorIds: req.body.instructorIds,
    }

    // FE-4-A/D: Validate merged body via Zod
    const validated = await classValidator.validate(mergedBody)
    const { nomeCurso, livrosEstudados, horario, diaSemana, vagasLimite, instructorIds } = validated

    // FE-4-E: Duplicate class check (excluding current class)
    const duplicate = await classRepo.findByDetails(nomeCurso, diaSemana, horario, classIdStr)
    if (duplicate) {
      throw new ConflictError(
        `Já existe outra turma com o nome "${nomeCurso}" no mesmo dia e horário (${diaSemana} às ${horario}).`,
      )
    }

    let instructors
    if (instructorIds && Array.isArray(instructorIds)) {
      // FE-4-B / FE-4-C: Validate instructors existence and schedule conflicts
      instructors = await validateInstructors(
        instructorIds,
        classRepo,
        userRepo,
        diaSemana,
        horario,
        classIdStr,
      )
    } else {
      instructors = existingClass.instructors || []
    }

    const updated = await classRepo.save({
      id: classIdStr,
      nomeCurso,
      livrosEstudados: livrosEstudados || null,
      horario,
      diaSemana,
      vagasLimite: vagasLimite || null,
      instructors,
    } as any)

    return res.status(200).json(updated)
  } catch (err) {
    next(err)
  }
})

router.delete('/:classId', authMiddleware([UserRole.ADMIN]), async (req, res, next) => {
  try {
    const classRepo = container.ClassRepository
    const { classId } = req.params
    await classRepo.deleteById(classId as string)
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
})

router.get('/:classId/students', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), listClassStudentsRoute)
router.post('/:classId/students', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), enrollClassStudentRoute)
router.delete('/:classId/students/:studentId', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), unenrollClassStudentRoute)
router.post('/:classId/attendances', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), registerClassAttendanceRoute)
router.put('/:classId/attendances', authMiddleware([UserRole.ADMIN]), alterClassAttendanceRoute)

export default router
