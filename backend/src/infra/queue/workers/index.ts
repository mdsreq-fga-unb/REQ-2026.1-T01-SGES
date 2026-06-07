import { Worker } from 'bullmq'
import type { IEmailService } from '@/application/services/email-service'
import { QueueNames } from '@/application/services/queue-producer'
import logger from '@/infra/logger'

export function startWorkers(redisUrl: string, emailService: IEmailService): void {
  const connection = { url: redisUrl }

  const credentialsWorker = new Worker(
    QueueNames.SEND_CREDENTIALS,
    async (job) => {
      logger.debug({ jobId: job.id, queue: QueueNames.SEND_CREDENTIALS }, 'Worker: processando job')
      await emailService.sendCredentials(job.data)
    },
    { connection },
  )

  credentialsWorker.on('completed', (job) => {
    logger.info({ jobId: job.id, queue: QueueNames.SEND_CREDENTIALS }, 'Worker: job concluído')
  })

  credentialsWorker.on('failed', (job, err) => {
    logger.error(
      err,
      `Worker: job ${job?.id ?? 'unknown'} falhou na fila ${QueueNames.SEND_CREDENTIALS}`,
      'MSG',
    )
  })

  const resetCodeWorker = new Worker(
    QueueNames.SEND_RESET_CODE,
    async (job) => {
      logger.debug({ jobId: job.id, queue: QueueNames.SEND_RESET_CODE }, 'Worker: processando job')
      await emailService.sendResetCode(job.data)
    },
    { connection },
  )

  resetCodeWorker.on('completed', (job) => {
    logger.info({ jobId: job.id, queue: QueueNames.SEND_RESET_CODE }, 'Worker: job concluído')
  })

  resetCodeWorker.on('failed', (job, err) => {
    logger.error(
      err,
      `Worker: job ${job?.id ?? 'unknown'} falhou na fila ${QueueNames.SEND_RESET_CODE}`,
      'MSG',
    )
  })
}
