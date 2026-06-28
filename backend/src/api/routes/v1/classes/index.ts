import { Router } from 'express'
import { authMiddleware } from '@/api/middleware/auth-middleware'
import { UserRole } from '@/domain'
import { container } from '@/infra/container/container'
import listClassStudentsRoute from './list-class-students-route'
import enrollClassStudentRoute from './enroll-class-student-route'
import unenrollClassStudentRoute from './unenroll-class-student-route'
import registerClassAttendanceRoute from './register-class-attendance-route'

const router = Router({ mergeParams: true })

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
    const { nomeCurso, livrosEstudados, horario, diaSemana, vagasLimite, instructorIds } = req.body

    const instructors = []
    if (instructorIds && Array.isArray(instructorIds)) {
      for (const id of instructorIds) {
        const user = await userRepo.findById(id)
        if (user) instructors.push(user)
      }
    }

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
    const { nomeCurso, livrosEstudados, horario, diaSemana, vagasLimite, instructorIds } = req.body

    const existingClass = await classRepo.findById(classId)
    if (!existingClass) {
      return res.status(404).json({ message: 'Class not found' })
    }

    const instructors = []
    if (instructorIds && Array.isArray(instructorIds)) {
      for (const id of instructorIds) {
        const user = await userRepo.findById(id)
        if (user) instructors.push(user)
      }
    } else {
      instructors.push(...(existingClass.instructors || []))
    }

    const updated = await classRepo.save({
      id: classId,
      nomeCurso: nomeCurso !== undefined ? nomeCurso : existingClass.nomeCurso,
      livrosEstudados: livrosEstudados !== undefined ? livrosEstudados : existingClass.livrosEstudados,
      horario: horario !== undefined ? horario : existingClass.horario,
      diaSemana: diaSemana !== undefined ? diaSemana : existingClass.diaSemana,
      vagasLimite: vagasLimite !== undefined ? vagasLimite : existingClass.vagasLimite,
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
    await classRepo.deleteById(classId)
    return res.status(204).send()
  } catch (err) {
    next(err)
  }
})

router.get('/:classId/students', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), listClassStudentsRoute)
router.post('/:classId/students', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), enrollClassStudentRoute)
router.delete('/:classId/students/:studentId', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), unenrollClassStudentRoute)
router.post('/:classId/attendances', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), registerClassAttendanceRoute)

export default router
