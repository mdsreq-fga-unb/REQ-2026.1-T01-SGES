import type { InstructorHistoryRepository } from '../services/instructor-history-repository'

export type GetTeachersReportInput = {
  semester?: string
  year?: number
}

export class GetTeachersReportUseCase {
  constructor(private readonly instructorHistoryRepository: InstructorHistoryRepository) {}

  async execute(input: GetTeachersReportInput) {
    if (!input.semester && !input.year) {
      throw new Error('Either semester or year must be provided')
    }

    const historyList = await this.instructorHistoryRepository.findBySemesterOrYear(input.semester, input.year)
    return historyList
  }
}
