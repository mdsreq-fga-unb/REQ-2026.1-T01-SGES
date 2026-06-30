import type { Request, Response } from 'express'
import { container } from '@/infra/container/container'

export default async function (req: Request, res: Response) {
  const classId = req.params.classId as string
  const enrollmentRepository = container.EnrollmentRepository
  const studentRepository = container.StudentRepository

  const enrollments = await enrollmentRepository.findActiveByClass(classId)
  const students = await Promise.all(
    enrollments.map((e) => studentRepository.findById(e.studentId))
  )

  const result = students
    .filter((s) => s !== null)
    .map((s) => ({
      id: s!.id,
      codigo_matricula: s!.codigoMatricula,
      name: s!.name,
      email: s!.email ?? '',
      profissao: s!.profissao ?? '',
      createdAt: s!.createdAt,
    }))

  return res.status(200).json(result)
}
