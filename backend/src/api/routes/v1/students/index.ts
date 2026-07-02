import { Router } from 'express'
import { authMiddleware } from '@/api/middleware/auth-middleware'
import { UserRole, generateStudentMatriculaCode } from '@/domain'
import { container } from '@/infra/container/container'
import { ConflictError, AppError } from '@/application/infra/errors'

import getStudentHistoryRoute from './get-student-history-route'

const router = Router()

function toStudentDto(student: any) {
  return {
    id: student.id,
    codigo_matricula: student.codigoMatricula,
    name: student.name,
    email: student.email,
    profissao: student.profissao,
    createdAt: student.createdAt,
  }
}

router.get('/', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), async (req, res, next) => {
  try {
    const studentRepo = container.StudentRepository
    const { students } = await studentRepo.findAll(1, 1000)
    return res.status(200).json(students.map(toStudentDto))
  } catch (err) {
    next(err)
  }
})

router.post('/', authMiddleware([UserRole.ADMIN]), async (req, res, next) => {
  try {
    const studentRepo = container.StudentRepository
    const { name, email, profissao } = req.body

    if (!name || name.trim() === '') {
      throw new AppError(400, 'Nome é obrigatório.')
    }

    if (email) {
      const existing = await studentRepo.findByEmail(email)
      if (existing) {
        throw new ConflictError('E-mail já cadastrado para outro beneficiário.')
      }
    }

    const student = await studentRepo.save({
      codigoMatricula: generateStudentMatriculaCode(),
      name,
      email: email || null,
      profissao: profissao || null,
    })

    return res.status(201).json(toStudentDto(student))
  } catch (err) {
    next(err)
  }
})

router.put('/:id', authMiddleware([UserRole.ADMIN]), async (req, res, next) => {
  try {
    const studentRepo = container.StudentRepository
    const { id } = req.params
    const { name, email, profissao } = req.body

    const existingStudent = await studentRepo.findById(id as string)
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' })
    }

    if (name !== undefined && name.trim() === '') {
      throw new AppError(400, 'Nome não pode ser vazio.')
    }

    if (email && email !== existingStudent.email) {
      const existing = await studentRepo.findByEmail(email)
      if (existing && existing.id !== id) {
        throw new ConflictError('E-mail já cadastrado para outro beneficiário.')
      }
    }

    const updated = await studentRepo.save({
      id,
      codigoMatricula: existingStudent.codigoMatricula,
      name: name !== undefined ? name : existingStudent.name,
      email: email !== undefined ? (email || null) : existingStudent.email,
      profissao: profissao !== undefined ? (profissao || null) : existingStudent.profissao,
    } as any)

    return res.status(200).json(toStudentDto(updated))
  } catch (err) {
    next(err)
  }
})

router.get('/:studentId/history', authMiddleware([UserRole.ADMIN, UserRole.TEACHER]), getStudentHistoryRoute)

export default router
