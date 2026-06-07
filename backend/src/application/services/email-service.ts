import type { QueueJobData, QueueNames } from './queue-producer'

export interface IEmailService {
  sendCredentials(data: QueueJobData[typeof QueueNames.SEND_CREDENTIALS]): Promise<void>
  sendResetCode(data: QueueJobData[typeof QueueNames.SEND_RESET_CODE]): Promise<void>
}
