import { Worker } from 'bullmq'
import type { IEmailService } from '@/application/services/email-service'
import { QueueNames } from '@/application/services/queue-producer'

export function startWorkers(redisUrl: string, emailService: IEmailService): void {
  const connection = { url: redisUrl }

  new Worker(
    QueueNames.SEND_CREDENTIALS,
    async (job) => { await emailService.sendCredentials(job.data) },
    { connection },
  )

  new Worker(
    QueueNames.SEND_RESET_CODE,
    async (job) => { await emailService.sendResetCode(job.data) },
    { connection },
  )
}
