import type { QueueJobData, QueueNames } from './queue-producer'

export interface IEmailService {
  sendCredentials(data: QueueJobData[typeof QueueNames.SEND_CREDENTIALS]): Promise<void>
  sendResetCode(data: QueueJobData[typeof QueueNames.SEND_RESET_CODE]): Promise<void>
  sendAbsenceAlert(email: string, data: { studentName: string; courseName: string; absencesCount: number; limitReached: boolean }): Promise<void>
}
