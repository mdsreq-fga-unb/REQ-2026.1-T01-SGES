import type { IEmailService } from '@/application/services/email-service'
import type { IQueueProducer, QueueJobData, QueueName } from '@/application/services/queue-producer'
import { QueueNames } from '@/application/services/queue-producer'

export class SyncQueueProducer implements IQueueProducer {
  private handlers: Map<QueueName, (data: any) => Promise<void>>

  constructor(emailService: IEmailService) {
    this.handlers = new Map([
      [QueueNames.SEND_CREDENTIALS, (data) => emailService.sendCredentials(data)],
      [QueueNames.SEND_RESET_CODE, (data) => emailService.sendResetCode(data)],
    ])
  }

  async add<Q extends QueueName>(queue: Q, data: QueueJobData[Q]): Promise<void> {
    await this.handlers.get(queue)!(data)
  }
}
