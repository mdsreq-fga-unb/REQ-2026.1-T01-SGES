import { Queue } from 'bullmq'
import type { IQueueProducer, QueueJobData, QueueName } from '@/application/services/queue-producer'
import { QueueNames } from '@/application/services/queue-producer'

export class BullMQProducer implements IQueueProducer {
  private queues: Map<QueueName, Queue>

  constructor(redisUrl: string) {
    const connection = { url: redisUrl }
    this.queues = new Map([
      [QueueNames.SEND_CREDENTIALS, new Queue(QueueNames.SEND_CREDENTIALS, { connection })],
      [QueueNames.SEND_RESET_CODE, new Queue(QueueNames.SEND_RESET_CODE, { connection })],
    ])
  }

  async add<Q extends QueueName>(queue: Q, data: QueueJobData[Q]): Promise<void> {
    await this.queues.get(queue)!.add(queue, data)
  }
}
