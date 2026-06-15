import type { EnrollmentRepository } from '../services/enrollment-repository'

export type GetFunnelReportInput = {
  classId?: string
}

export class GetFunnelReportUseCase {
  constructor(private readonly enrollmentRepository: EnrollmentRepository) {}

  async execute(input: GetFunnelReportInput) {
    const funnelData = await this.enrollmentRepository.getFunnelData(input.classId)
    return funnelData
  }
}
