import { Router } from 'express'
import { authMiddleware } from '@/api/middleware/auth-middleware'
import { UserRole, generateStudentMatriculaCode } from '@/domain'
import { container } from '@/infra/container/container'

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

    const existingStudent = await studentRepo.findById(id)
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' })
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

export default router
